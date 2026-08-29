-- ثغرة تصعيد صلاحيات: سياسة profiles_update_own تسمح لأي مستخدم بتعديل صفّه،
-- وRLS تعمل على مستوى الصف لا العمود، فكان بإمكان أي حساب مسجَّل أن يضع role='admin'
-- لنفسه ويصل إلى بيانات الأسر المتضررة كاملة (أسماء، هواتف، عناوين).
-- التسجيل العام مفتوح في Supabase Auth، ما يجعل الثغرة قابلة للاستغلال من أي شخص.

create or replace function public.guard_profile_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_service boolean;
  v_admin_count int;
begin
  if new.role is not distinct from old.role then
    return new;
  end if;

  -- سكربتات الإدارة المحلية تعمل بمفتاح الخدمة (بدون auth.uid) وتبقى مسموحة
  v_is_service := coalesce(auth.jwt() ->> 'role', '') = 'service_role' or auth.uid() is null;

  if not v_is_service and not public.is_admin() then
    raise exception 'تغيير الدور مسموح لحسابات الأدمن فقط';
  end if;

  -- منع فقدان الوصول: لا يجوز إزالة آخر حساب أدمن
  if old.role = 'admin' and new.role <> 'admin' then
    select count(*) into v_admin_count from public.profiles where role = 'admin';
    if v_admin_count <= 1 then
      raise exception 'لا يمكن إزالة آخر حساب أدمن في المنصة';
    end if;
  end if;

  return new;
end;
$$;

revoke execute on function public.guard_profile_role_change() from public, anon, authenticated;

create trigger trg_guard_profile_role_change
  before update of role on public.profiles
  for each row execute function public.guard_profile_role_change();
