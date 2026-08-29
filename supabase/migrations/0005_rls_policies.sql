-- سياسات أمان مستوى الصف (RLS) — الحماية الأساسية لبيانات الأسر المتضررة والعمليات الداخلية

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role in ('admin','coordinator','volunteer') from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role in ('admin','coordinator') from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.campaigns enable row level security;
alter table public.locations enable row level security;
alter table public.categories enable row level security;
alter table public.beneficiary_requests enable row level security;
alter table public.collection_points enable row level security;
alter table public.relief_hubs enable row level security;
alter table public.needs enable row level security;
alter table public.inventory_items enable row level security;
alter table public.inventory_transactions enable row level security;
alter table public.donations enable row level security;
alter table public.donation_items enable row level security;
alter table public.transport_offers enable row level security;
alter table public.transport_requests enable row level security;
alter table public.distributions enable row level security;
alter table public.verification_records enable row level security;
alter table public.notifications enable row level security;
alter table public.activity_logs enable row level security;
alter table public.official_updates enable row level security;

-- profiles: كل مستخدم يرى/يعدّل ملفه فقط، والطاقم يرى الجميع، والأدمن يدير الأدوار
create policy profiles_select on public.profiles for select
  using (id = auth.uid() or public.is_staff());
create policy profiles_update_own on public.profiles for update
  using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_all on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- organizations: الجمعيات الموثقة تظهر للعامة، الإدارة الكاملة للطاقم المسؤول
create policy organizations_select_public on public.organizations for select
  using (verification_level in ('verified','field_verified') or public.is_staff());
create policy organizations_manage on public.organizations for all
  using (public.is_manager()) with check (public.is_manager());

-- campaigns: قراءة عامة، تعديل من الأدمن فقط
create policy campaigns_select_all on public.campaigns for select using (true);
create policy campaigns_insert_admin on public.campaigns for insert with check (public.is_admin());
create policy campaigns_update_admin on public.campaigns for update using (public.is_admin());
create policy campaigns_delete_admin on public.campaigns for delete using (public.is_admin());

-- locations / categories: بيانات مرجعية عامة للقراءة، الأدمن فقط يعدّلها
create policy locations_select_all on public.locations for select using (true);
create policy locations_manage_admin on public.locations for all
  using (public.is_admin()) with check (public.is_admin());

create policy categories_select_all on public.categories for select using (true);
create policy categories_manage_admin on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- beneficiary_requests: بيانات حساسة — ممنوعة تمامًا عن العامة. التسجيل العام يتم عبر server action بصلاحية الخدمة
create policy beneficiary_requests_staff_select on public.beneficiary_requests for select
  using (public.is_staff());
create policy beneficiary_requests_staff_insert on public.beneficiary_requests for insert
  with check (public.is_staff());
create policy beneficiary_requests_staff_update on public.beneficiary_requests for update
  using (public.is_staff());
create policy beneficiary_requests_manager_delete on public.beneficiary_requests for delete
  using (public.is_manager());

-- collection_points / relief_hubs: الجدول الأساسي للطاقم فقط، والعرض العام يتم عبر Views آمنة
create policy collection_points_staff_select on public.collection_points for select
  using (public.is_staff());
create policy collection_points_manager_insert on public.collection_points for insert
  with check (public.is_manager());
create policy collection_points_manager_update on public.collection_points for update
  using (public.is_manager());
create policy collection_points_manager_delete on public.collection_points for delete
  using (public.is_manager());

create policy relief_hubs_staff_select on public.relief_hubs for select
  using (public.is_staff());
create policy relief_hubs_manager_insert on public.relief_hubs for insert
  with check (public.is_manager());
create policy relief_hubs_manager_update on public.relief_hubs for update
  using (public.is_manager());
create policy relief_hubs_manager_delete on public.relief_hubs for delete
  using (public.is_manager());

-- needs: لا بيانات شخصية فيها، تُعرض للعامة عند تفعيلها فقط
create policy needs_public_select on public.needs for select
  using (status = 'active' or public.is_staff());
create policy needs_manager_insert on public.needs for insert
  with check (public.is_manager());
create policy needs_manager_update on public.needs for update
  using (public.is_manager());
create policy needs_manager_delete on public.needs for delete
  using (public.is_manager());

-- inventory: القراءة للطاقم، والكتابة حصرًا عبر حركات inventory_transactions (سجل غير قابل للتعديل)
create policy inventory_items_staff_select on public.inventory_items for select
  using (public.is_staff());

create policy inventory_txn_staff_select on public.inventory_transactions for select
  using (public.is_staff());
create policy inventory_txn_staff_insert on public.inventory_transactions for insert
  with check (public.is_staff());

-- donations / donation_items: بيانات تواصل المتبرعين — للطاقم فقط
create policy donations_staff_select on public.donations for select using (public.is_staff());
create policy donations_staff_insert on public.donations for insert with check (public.is_staff());
create policy donations_manager_update on public.donations for update using (public.is_manager());
create policy donations_manager_delete on public.donations for delete using (public.is_manager());

create policy donation_items_staff_select on public.donation_items for select using (public.is_staff());
create policy donation_items_staff_insert on public.donation_items for insert with check (public.is_staff());
create policy donation_items_manager_update on public.donation_items for update using (public.is_manager());
create policy donation_items_manager_delete on public.donation_items for delete using (public.is_manager());

-- transport: بيانات السائقين الشخصية — للطاقم فقط
create policy transport_offers_staff_select on public.transport_offers for select using (public.is_staff());
create policy transport_offers_staff_insert on public.transport_offers for insert with check (public.is_staff());
create policy transport_offers_manager_update on public.transport_offers for update using (public.is_manager());
create policy transport_offers_manager_delete on public.transport_offers for delete using (public.is_manager());

create policy transport_requests_staff_select on public.transport_requests for select using (public.is_staff());
create policy transport_requests_staff_insert on public.transport_requests for insert with check (public.is_staff());
create policy transport_requests_manager_update on public.transport_requests for update using (public.is_manager());
create policy transport_requests_manager_delete on public.transport_requests for delete using (public.is_manager());

-- distributions: تسجيل ميداني من الطاقم، تعديل/حذف من المسؤولين فقط
create policy distributions_staff_select on public.distributions for select using (public.is_staff());
create policy distributions_staff_insert on public.distributions for insert with check (public.is_staff());
create policy distributions_manager_update on public.distributions for update using (public.is_manager());
create policy distributions_manager_delete on public.distributions for delete using (public.is_manager());

-- verification_records
create policy verification_records_staff_select on public.verification_records for select using (public.is_staff());
create policy verification_records_manager_insert on public.verification_records for insert with check (public.is_manager());

-- notifications: كل مستخدم يرى إشعاراته فقط، الإدارة تُنشئها
create policy notifications_select_own on public.notifications for select using (profile_id = auth.uid());
create policy notifications_update_own on public.notifications for update using (profile_id = auth.uid());
create policy notifications_manager_insert on public.notifications for insert with check (public.is_manager());

-- activity_logs: سجل تدقيق للمسؤولين فقط
create policy activity_logs_manager_select on public.activity_logs for select using (public.is_manager());
create policy activity_logs_staff_insert on public.activity_logs for insert with check (public.is_staff());

-- official_updates: معلومات موثقة عامة للجميع، والإدارة فقط تنشرها
create policy official_updates_select_all on public.official_updates for select using (true);
create policy official_updates_manage_admin on public.official_updates for all
  using (public.is_manager()) with check (public.is_manager());
