-- تقييد ما يستطيع الزائر كتابته في نماذج التسجيل العامة.
--
-- سياسات الإدراج العامة كانت كلّها `with check (true)`. هذا يمنع القراءة، لكنه
-- لا يقيّد **الأعمدة**: من يستدعي واجهة REST مباشرة بمفتاح `anon` — وهو مفتاح
-- علني موجود في شيفرة المتصفّح — يستطيع أن يملأ أي عمود في الصف، بما فيه
-- أعمدة الثقة التي يفترض أن يضعها الطاقم وحده.
--
-- أخطر حالة، وهي سبب هذه الهجرة:
--
--   insert into public.medical_volunteers
--     (full_name, phone, specialty, wilaya_code, commune_id,
--      status, show_phone_publicly)
--   values ('د. فلان', '0555…', 'طب عام', '18', '…', 'verified', true);
--
-- الدالة العامة `get_public_medical_volunteers()` لا تصفّي إلا على
-- `status = 'verified'`، فيظهر هذا الصف فورًا في قائمة «الأطباء المتطوّعون
-- الموثّقون» التي تتصفّحها الأسر المتضرّرة — برقم هاتف يختاره المُدرِج، وبلا أي
-- مراجعة بشرية. الأمر نفسه ينطبق على `artisan_volunteers` وقائمة الحرفيين.
--
-- على منصّة إغاثة يقصدها ناس في وضع هشّ، هذه ليست مسألة سلامة بيانات فحسب.
--
-- العلاج: تبقى السياسات مفتوحة للإدراج، لكن `with check` يفرض أن يصل الصف
-- **غير موثَّق**. الطاقم وحده يرقّي الحالة لاحقًا عبر سياسات التحديث القائمة.
-- اخترنا `with check` لا منح الصلاحيات على مستوى العمود لأنه يصمد أمام إضافة
-- أعمدة جديدة: عمود يُضاف غدًا لا يفتح ثغرة صامتة، بينما قائمة أعمدة منسيّة
-- تكسر النموذج بلا سبب ظاهر.

-- ————————————————————————————— المتطوّعون: الطبّيون والحرفيون
drop policy if exists medical_volunteers_public_insert on public.medical_volunteers;
create policy medical_volunteers_public_insert on public.medical_volunteers
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and verified_by is null
    and verified_at is null
  );

drop policy if exists artisan_volunteers_public_insert on public.artisan_volunteers;
create policy artisan_volunteers_public_insert on public.artisan_volunteers
  for insert to anon, authenticated
  with check (
    status = 'pending'
    and verified_by is null
    and verified_at is null
  );

-- شبكة أمان: الجدول أُنشئ مباشرة في الإنتاج خارج الهجرات (انظر تعليق 0024)،
-- فلا شيء في هذا المستودع يُثبت أن RLS مفعّلة عليه. التفعيل هنا لا يضرّ إن كانت
-- مفعّلة أصلًا، ويسدّ الثقب إن لم تكن.
alter table public.medical_volunteers enable row level security;
alter table public.artisan_volunteers enable row level security;

-- ————————————————————————————— طلبات المساعدة
-- الأولوية غير مذكورة عمدًا: `calculate_beneficiary_priority` يحسبها ويكتب
-- فوق أي قيمة مُرسَلة، فهي محميّة أصلًا.
drop policy if exists beneficiary_requests_public_insert on public.beneficiary_requests;
create policy beneficiary_requests_public_insert on public.beneficiary_requests
  for insert to anon
  with check (
    status = 'pending'
    and verification_level = 'unverified'
    and verified_by is null
    and verified_at is null
    and internal_notes is null
    and created_by is null
  );

-- ————————————————————————————— التبرّعات وعروض النقل
-- `donor_id` و`driver_id` يربطان الصف بحساب حقيقي: تركهما مفتوحين يعني أن أي
-- زائر ينسب تبرّعًا أو عرض نقل إلى شخص آخر.
drop policy if exists donations_public_insert on public.donations;
create policy donations_public_insert on public.donations
  for insert to anon
  with check (status = 'registered' and donor_id is null);

drop policy if exists transport_offers_public_insert on public.transport_offers;
create policy transport_offers_public_insert on public.transport_offers
  for insert to anon
  with check (status = 'requested' and driver_id is null);

-- ————————————————————————————— تقييمات الأضرار
-- التطبيق يُدرج بحالة 'estimated' بعد الحساب، والقيمة الافتراضية 'pending':
-- كلتاهما مقبولة، وما عداهما من قرارات الطاقم.
-- `beneficiary_request_id` مستثنى: تركه مفتوحًا يسمح بتعليق تقييم مزوَّر على
-- ملفّ أسرة حقيقية. الربط، إن لزم، يقع من الخادم بعد التحقّق.
drop policy if exists damage_assessments_public_insert on public.damage_assessments;
create policy damage_assessments_public_insert on public.damage_assessments
  for insert to anon, authenticated
  with check (
    status in ('pending', 'estimated')
    and verified_by is null
    and verified_at is null
    and assigned_artisan_id is null
    and beneficiary_request_id is null
  );

-- ————————————————————————————— آخر حساب أدمن
-- الهجرة 0023 تمنع تنزيل رتبة آخر أدمن عبر UPDATE، لكن `profiles_admin_all`
-- سياسة `for all` تشمل الحذف: حذف صف آخر أدمن يُعطّل `is_admin()` و`is_staff()`
-- للجميع ويقفل لوحة الإدارة نهائيًا. نفس الضمانة، على المسار الآخر.
create or replace function public.guard_profile_admin_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining_admins int;
begin
  if old.role = 'admin' then
    select count(*) into remaining_admins
    from public.profiles
    where role = 'admin' and id <> old.id;

    if remaining_admins = 0 then
      raise exception 'لا يمكن حذف آخر حساب أدمن في المنصة';
    end if;
  end if;

  return old;
end;
$$;

revoke all on function public.guard_profile_admin_delete() from public, anon, authenticated;

drop trigger if exists trg_guard_profile_admin_delete on public.profiles;
create trigger trg_guard_profile_admin_delete
  before delete on public.profiles
  for each row execute function public.guard_profile_admin_delete();

-- ————————————————————————————— المخزون: الرصيد يبقى ناتج الحركات
-- 0005 يصف النموذج صراحة: «القراءة للطاقم، والكتابة حصرًا عبر حركات
-- inventory_transactions». لكن سياسة التحديث في 0026 تسمح بتعديل أي عمود،
-- ومنها `quantity` — أي تعديل الرصيد دون أثر في السجلّ. التعليق في 0026 يقول
-- «ضبط حدّ التنبيه»، وهو ما نقصره عليه هنا فعلًا.
revoke update on public.inventory_items from authenticated;
grant update (min_threshold) on public.inventory_items to authenticated;

-- ————————————————————————————— حدود حاويات التخزين
-- الرفع في `damage-photos` مفتوح للزائر بلا حساب. الحاوية خاصة والقراءة للطاقم،
-- فلا خطر تسريب، لكن لا شيء يمنع رفع ملفات ضخمة أو غير صور.
update storage.buckets
set file_size_limit = 10485760, -- 10 ميغابايت
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id in ('damage-photos', 'distribution-proofs');
