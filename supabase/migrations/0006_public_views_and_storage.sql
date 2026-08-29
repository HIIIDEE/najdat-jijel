-- Views عامة آمنة (تُخفي الحقول الحساسة عن العرض العام) + دلو تخزين إثباتات التوزيع

create view public.public_collection_points
with (security_invoker = false) as
select
  id, campaign_id, name, wilaya, commune, address, lat, lng,
  case when show_phone_publicly then phone else null end as phone,
  contact_name, accepted_categories, capacity_note, opening_hours,
  status, verification_level, notes, created_at, updated_at
from public.collection_points;

create view public.public_relief_hubs
with (security_invoker = false) as
select
  id, campaign_id, name, wilaya, commune, address, lat, lng,
  case when show_phone_publicly then phone else null end as phone,
  contact_name, capacity_note, opening_hours, is_shelter,
  status, verification_level, notes, created_at, updated_at
from public.relief_hubs;

create view public.stat_overview
with (security_invoker = false) as
select
  (select count(*) from public.beneficiary_requests) as total_families,
  (select count(*) from public.beneficiary_requests
     where status not in ('helped', 'closed', 'rejected')) as families_awaiting,
  (select count(distinct commune) from public.distributions d
     join public.relief_hubs h on h.id = d.hub_id) as areas_reached,
  (select count(*) from public.collection_points where status = 'open')
    + (select count(*) from public.relief_hubs where status = 'open') as active_points,
  (select count(*) from public.needs where status = 'active' and priority = 'critical') as critical_needs,
  (select count(*) from public.transport_offers
     where status in ('requested', 'matched', 'confirmed', 'in_transit')) as active_shipments;

create view public.stat_donations_by_category
with (security_invoker = false) as
select c.slug, c.name_ar, di.unit, sum(di.quantity) as total_quantity, count(distinct di.donation_id) as donation_count
from public.donation_items di
join public.categories c on c.id = di.category_id
group by c.slug, c.name_ar, di.unit;

create view public.stat_distributions_by_category
with (security_invoker = false) as
select c.slug, c.name_ar, d.unit,
  sum(d.quantity) as total_quantity,
  sum(d.beneficiary_family_count) as total_families
from public.distributions d
join public.categories c on c.id = d.category_id
group by c.slug, c.name_ar, d.unit;

grant select on public.public_collection_points to anon, authenticated;
grant select on public.public_relief_hubs to anon, authenticated;
grant select on public.stat_overview to anon, authenticated;
grant select on public.stat_donations_by_category to anon, authenticated;
grant select on public.stat_distributions_by_category to anon, authenticated;

-- دلو تخزين إثباتات التوزيع (خاص، لا يُشارك بشكل علني)
insert into storage.buckets (id, name, public)
values ('distribution-proofs', 'distribution-proofs', false)
on conflict (id) do nothing;

create policy storage_distribution_proofs_staff_read
  on storage.objects for select
  using (bucket_id = 'distribution-proofs' and public.is_staff());

create policy storage_distribution_proofs_staff_write
  on storage.objects for insert
  with check (bucket_id = 'distribution-proofs' and public.is_staff());

create policy storage_distribution_proofs_manager_delete
  on storage.objects for delete
  using (bucket_id = 'distribution-proofs' and public.is_manager());
