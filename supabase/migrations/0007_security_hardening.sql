-- تشديد الأمان: استبدال Views من نوع SECURITY DEFINER بدوال RPC صريحة،
-- وإصلاح search_path، ومنع استدعاء دوال triggers مباشرة من الخارج

drop view if exists public.public_collection_points;
drop view if exists public.public_relief_hubs;
drop view if exists public.stat_overview;
drop view if exists public.stat_donations_by_category;
drop view if exists public.stat_distributions_by_category;

create or replace function public.get_public_collection_points()
returns table (
  id uuid, campaign_id uuid, name text, wilaya text, commune text, address text,
  lat double precision, lng double precision, phone text, contact_name text,
  accepted_categories text[], capacity_note text, opening_hours text,
  status public.point_status, verification_level public.verification_level,
  notes text, created_at timestamptz, updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    id, campaign_id, name, wilaya, commune, address, lat, lng,
    case when show_phone_publicly then phone else null end,
    contact_name, accepted_categories, capacity_note, opening_hours,
    status, verification_level, notes, created_at, updated_at
  from public.collection_points;
$$;
grant execute on function public.get_public_collection_points() to anon, authenticated;

create or replace function public.get_public_relief_hubs()
returns table (
  id uuid, campaign_id uuid, name text, wilaya text, commune text, address text,
  lat double precision, lng double precision, phone text, contact_name text,
  capacity_note text, opening_hours text, is_shelter boolean,
  status public.point_status, verification_level public.verification_level,
  notes text, created_at timestamptz, updated_at timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select
    id, campaign_id, name, wilaya, commune, address, lat, lng,
    case when show_phone_publicly then phone else null end,
    contact_name, capacity_note, opening_hours, is_shelter,
    status, verification_level, notes, created_at, updated_at
  from public.relief_hubs;
$$;
grant execute on function public.get_public_relief_hubs() to anon, authenticated;

create or replace function public.get_stat_overview()
returns table (
  total_families bigint,
  families_awaiting bigint,
  areas_reached bigint,
  active_points bigint,
  critical_needs bigint,
  active_shipments bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    (select count(*) from public.beneficiary_requests),
    (select count(*) from public.beneficiary_requests where status not in ('helped','closed','rejected')),
    (select count(distinct commune) from public.distributions d join public.relief_hubs h on h.id = d.hub_id),
    (select count(*) from public.collection_points where status='open') + (select count(*) from public.relief_hubs where status='open'),
    (select count(*) from public.needs where status='active' and priority='critical'),
    (select count(*) from public.transport_offers where status in ('requested','matched','confirmed','in_transit'));
$$;
grant execute on function public.get_stat_overview() to anon, authenticated;

create or replace function public.get_stat_donations_by_category()
returns table (slug text, name_ar text, unit public.unit_type, total_quantity numeric, donation_count bigint)
language sql
stable
security definer
set search_path = public
as $$
  select c.slug, c.name_ar, di.unit, sum(di.quantity), count(distinct di.donation_id)
  from public.donation_items di join public.categories c on c.id = di.category_id
  group by c.slug, c.name_ar, di.unit;
$$;
grant execute on function public.get_stat_donations_by_category() to anon, authenticated;

create or replace function public.get_stat_distributions_by_category()
returns table (slug text, name_ar text, unit public.unit_type, total_quantity numeric, total_families bigint)
language sql
stable
security definer
set search_path = public
as $$
  select c.slug, c.name_ar, d.unit, sum(d.quantity), sum(d.beneficiary_family_count)
  from public.distributions d join public.categories c on c.id = d.category_id
  group by c.slug, c.name_ar, d.unit;
$$;
grant execute on function public.get_stat_distributions_by_category() to anon, authenticated;

-- إصلاح search_path القابل للتغيير
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- منع استدعاء دوال الـ triggers الداخلية مباشرة عبر REST/RPC (تعمل تلقائيًا عبر المشغّلات فقط)
revoke execute on function public.handle_new_user() from anon, authenticated;
revoke execute on function public.calculate_beneficiary_priority() from anon, authenticated;
revoke execute on function public.apply_inventory_transaction() from anon, authenticated;
revoke execute on function public.apply_distribution_inventory() from anon, authenticated;
revoke execute on function public.sync_auto_need() from anon, authenticated;
