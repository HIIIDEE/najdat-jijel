-- 0026_security_and_rls_hardening.sql
-- 1. Prevent privilege escalation on public signup (enforce default 'donor' role, ignore client-provided role).
-- 2. Add UPDATE RLS policy for inventory_items so managers can configure min_threshold.
-- 3. Expand public INSERT policies to authenticated non-staff users (donations, beneficiary requests, transport offers).
-- 4. Allow all staff members (including volunteers) to record audit logs in verification_records.
-- 5. Add 'person' unit to unit_type enum to align with application schemas.
-- 6. Prevent negative initial quantities in inventory_items on initial 'out' or 'transfer' transactions.

-- 1. Secure new user profile creation trigger against role escalation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    'donor'::public.app_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- 2. Allow managers to update inventory items (e.g., minimum alert thresholds)
drop policy if exists inventory_items_manager_update on public.inventory_items;
create policy inventory_items_manager_update on public.inventory_items
  for update using (public.is_manager()) with check (public.is_manager());

-- 3. Allow both anonymous and authenticated community members to submit public forms
drop policy if exists beneficiary_requests_public_insert on public.beneficiary_requests;
create policy beneficiary_requests_public_insert on public.beneficiary_requests
  for insert to anon, authenticated with check (true);

drop policy if exists donations_public_insert on public.donations;
create policy donations_public_insert on public.donations
  for insert to anon, authenticated with check (true);

drop policy if exists donation_items_public_insert on public.donation_items;
create policy donation_items_public_insert on public.donation_items
  for insert to anon, authenticated with check (true);

drop policy if exists transport_offers_public_insert on public.transport_offers;
create policy transport_offers_public_insert on public.transport_offers
  for insert to anon, authenticated with check (true);

-- 4. Allow all staff members (admin, coordinator, volunteer) to create verification audit records
drop policy if exists verification_records_manager_insert on public.verification_records;
drop policy if exists verification_records_staff_insert on public.verification_records;
create policy verification_records_staff_insert on public.verification_records
  for insert with check (public.is_staff());

-- 5. Add 'person' to unit_type enum if not already present
alter type public.unit_type add value if not exists 'person';

-- 6. Ensure initial inventory items created via 'out' or 'transfer' do not start with a negative balance
create or replace function public.apply_inventory_transaction()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.type = 'in' then
    insert into public.inventory_items (hub_id, category_id, quantity, unit, min_threshold, updated_at)
    values (new.hub_id, new.category_id, new.quantity, new.unit, 0, now())
    on conflict (hub_id, category_id)
    do update set quantity = public.inventory_items.quantity + excluded.quantity, updated_at = now();

  elsif new.type = 'out' then
    insert into public.inventory_items (hub_id, category_id, quantity, unit, min_threshold, updated_at)
    values (new.hub_id, new.category_id, 0, new.unit, 0, now())
    on conflict (hub_id, category_id)
    do update set quantity = greatest(public.inventory_items.quantity - new.quantity, 0), updated_at = now();

  elsif new.type = 'adjustment' then
    insert into public.inventory_items (hub_id, category_id, quantity, unit, min_threshold, updated_at)
    values (new.hub_id, new.category_id, new.quantity, new.unit, 0, now())
    on conflict (hub_id, category_id)
    do update set quantity = new.quantity, updated_at = now();

  elsif new.type = 'transfer' then
    if new.source_hub_id is null or new.destination_hub_id is null then
      raise exception 'Transfer transaction requires both source and destination hubs';
    end if;

    insert into public.inventory_items (hub_id, category_id, quantity, unit, min_threshold, updated_at)
    values (new.source_hub_id, new.category_id, 0, new.unit, 0, now())
    on conflict (hub_id, category_id)
    do update set quantity = greatest(public.inventory_items.quantity - new.quantity, 0), updated_at = now();

    insert into public.inventory_items (hub_id, category_id, quantity, unit, min_threshold, updated_at)
    values (new.destination_hub_id, new.category_id, new.quantity, new.unit, 0, now())
    on conflict (hub_id, category_id)
    do update set quantity = public.inventory_items.quantity + excluded.quantity, updated_at = now();
  end if;

  return new;
end;
$$;
