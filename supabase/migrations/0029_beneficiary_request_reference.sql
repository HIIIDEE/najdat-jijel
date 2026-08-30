-- مرجع علني لطلب المساعدة + استعلام عن حالته.
--
-- المشكلة: بعد إرسال طلب المساعدة لا يبقى بيد المتضرّر شيء — لا رقم ولا وسيلة
-- ليعرف إن كان طلبه قد وصل أو رُوجع. فيعيد إرساله مرّتين وثلاثًا، أو يتصل،
-- أو ييأس. النتيجة تكرار في الجداول وضغط على فرق التنسيق.
--
-- الحل: مرجع قصير يمكن إملاؤه في الهاتف (مثال: HB-K7M2QX)، ودالة عامة تكشف
-- حالة الطلب وحدها — بلا اسم ولا عنوان ولا احتياجات — ولا تعمل إلا بتطابق
-- المرجع ورقم الهاتف معًا.
--
-- ملاحظة تشغيلية قبل التطبيق: كل `alter table` هنا يأخذ قفل ACCESS EXCLUSIVE
-- يبقى إلى نهاية المعاملة، أي طوال حلقة تعبئة الطلبات القديمة وفحص NOT NULL.
-- ما دام الجدول صغيرًا فالتوقّف لحظي، لكن مع عدد كبير من الطلبات ستتعطّل
-- الإضافة من `/help` ولوحة الإدارة طوال المدة: يُفضَّل التطبيق في ساعة هادئة
-- بعد التحقّق من عدد الصفوف.

alter table public.beneficiary_requests
  add column if not exists reference text;

-- أبجدية بلا محارف يسهل الخلط بينها نطقًا أو كتابة: بلا O و0، بلا I و1 و L.
--
-- `security definer` ضروري هنا: الدالة تُستعمل قيمةً افتراضية للعمود، أي أنها
-- تُنفَّذ بصلاحية من يُدرج الصف — والزائر (anon) لا يقرأ هذا الجدول، فلولا ذلك
-- لفشل التحقّق من التفرّد عنده. ما ترجعه سلسلة عشوائية لا تكشف أي بيان.
create or replace function public.generate_request_reference()
returns text
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  alphabet constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  candidate text;
  i int;
begin
  loop
    candidate := 'HB-';
    for i in 1..6 loop
      candidate := candidate
        || substr(
             alphabet,
             1 + (get_byte(extensions.gen_random_bytes(1), 0) % length(alphabet)),
             1
           );
    end loop;
    exit when not exists (
      select 1 from public.beneficiary_requests where reference = candidate
    );
  end loop;
  return candidate;
end;
$$;

revoke all on function public.generate_request_reference() from public;
grant execute on function public.generate_request_reference() to anon, authenticated, service_role;

-- الفهرس قبل التعبئة لا بعدها: دالة التوليد تتحقّق من التفرّد باستعلام على
-- العمود، فبلا فهرس يصير كل تحقّق مسحًا كاملًا للجدول — أي N مسحًا لـ N صفًا،
-- والقفل الحصري مأخوذ طوال المدة. الفهرس الفريد يقبل عمودًا كله NULL لأن
-- القيم الفارغة لا تتساوى في Postgres.
create unique index if not exists idx_beneficiary_requests_reference
  on public.beneficiary_requests(reference);

-- الطلبات القديمة تأخذ مراجعها واحدًا واحدًا: تحديث جماعي واحد يستدعي الدالة
-- لكل صف ضمن اللقطة نفسها، فلا ترى الدالة ما ولّدته للصفوف الأخرى وقد تتكرّر.
do $$
declare
  r record;
begin
  for r in select id from public.beneficiary_requests where reference is null loop
    update public.beneficiary_requests
      set reference = public.generate_request_reference()
      where id = r.id;
  end loop;
end;
$$;

-- قيمة افتراضية شبكةَ أمان: التطبيق يولّد المرجع بنفسه ويمرّره صراحةً (لأن
-- الزائر لا يملك حق القراءة فلا يستطيع استرجاع ما تولّده القاعدة)، فهذه
-- الافتراضية تخصّ ما يُدرَج من خارج التطبيق — سكربت، بيانات تجريبية، أو مسار
-- إداري مستقبلي. بدونها يسقط مثل هذا الصف على قيد NOT NULL.
alter table public.beneficiary_requests
  alter column reference set default public.generate_request_reference();

alter table public.beneficiary_requests
  alter column reference set not null;

-- الاستعلام العام عن الحالة.
--
-- `security definer` لأن الزائر (anon) لا يملك حق القراءة على الجدول أصلًا،
-- وهذا مقصود. الدالة ترجع الحالة والتاريخين فقط، ولا ترجع شيئًا ما لم يتطابق
-- المرجع ورقم الهاتف. المقارنة تتجاهل الفراغات والشرطات وحالة الأحرف والبادئة
-- حتى لا يفشل الاستعلام لأن أحدهم كتب "hb k7m2qx" أو "K7M2QX" وحدها.
--
-- التطبيع يقع على المُعامل لا على العمود: لو غُلِّف العمود بـ upper/regexp_replace
-- لتعذّر على المخطِّط استعمال الفهرس الفريد، فصار كل استعلام مسحًا كاملًا للجدول
-- على مسار عام مفتوح للجميع.
create or replace function public.get_beneficiary_request_status(
  p_reference text,
  p_phone text
)
returns table (
  reference text,
  status public.request_status,
  created_at timestamptz,
  updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  with raw as (
    select
      upper(regexp_replace(coalesce(p_reference, ''), '[^A-Za-z0-9]', '', 'g')) as ref,
      regexp_replace(coalesce(p_phone, ''), '[^0-9]', '', 'g') as phone
  ),
  normalized as (
    -- الطول هو الفيصل في حذف البادئة لا مجرّد وجود "HB": الحرفان من الأبجدية
    -- نفسها، فقد يبدأ جسم المرجع بهما.
    select
      'HB-' || case
                 when length(ref) = 8 and left(ref, 2) = 'HB' then substr(ref, 3)
                 else ref
               end as ref,
      phone
    from raw
  )
  select r.reference, r.status, r.created_at, r.updated_at
  from public.beneficiary_requests r, normalized n
  where r.reference = n.ref
    and regexp_replace(r.phone, '[^0-9]', '', 'g') = n.phone
  limit 1;
$$;

revoke all on function public.get_beneficiary_request_status(text, text) from public;
grant execute on function public.get_beneficiary_request_status(text, text) to anon, authenticated, service_role;
