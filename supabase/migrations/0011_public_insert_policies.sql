-- السماح للعامة (anon) بإدخال النماذج العامة فقط دون أي صلاحية قراءة أو تعديل أو حذف.
-- هذا يُغني عن الحاجة لأي مفتاح خدمة (service role) في مسارات النماذج العامة،
-- ويُبقي كل الحماية عند مستوى RLS نفسه.

create policy beneficiary_requests_public_insert on public.beneficiary_requests
  for insert to anon with check (true);

create policy donations_public_insert on public.donations
  for insert to anon with check (true);

create policy donation_items_public_insert on public.donation_items
  for insert to anon with check (true);

create policy transport_offers_public_insert on public.transport_offers
  for insert to anon with check (true);
