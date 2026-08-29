-- Reconciles the medical_volunteers table/type that were already created directly
-- against production (outside of any tracked migration) with this project's
-- security conventions: staff/manager-gated RLS, opt-in public phone disclosure,
-- and a SECURITY DEFINER RPC for the public-facing list.
--
-- Uses ALTER/CREATE OR REPLACE throughout (not CREATE TABLE) because the table
-- and the medical_verification_status enum already exist live.

alter table public.medical_volunteers
  add column if not exists show_phone_publicly boolean not null default false,
  add column if not exists verified_by uuid references public.profiles(id),
  add column if not exists verified_at timestamptz;

drop trigger if exists trg_medical_volunteers_updated_at on public.medical_volunteers;
create trigger trg_medical_volunteers_updated_at
  before update on public.medical_volunteers
  for each row execute function public.set_updated_at();

-- Drop the ad-hoc policies that were applied directly to production and exposed
-- full volunteer rows (name, phone, email, license number, notes) to anon/public
-- with no verification gating.
drop policy if exists "Allow public read for medical volunteers" on public.medical_volunteers;
drop policy if exists "Lecture publique des medecins" on public.medical_volunteers;
drop policy if exists medical_volunteers_admin_select on public.medical_volunteers;
drop policy if exists medical_volunteers_admin_update on public.medical_volunteers;
drop policy if exists medical_volunteers_public_insert on public.medical_volunteers;
drop policy if exists medical_volunteers_staff_select on public.medical_volunteers;
drop policy if exists medical_volunteers_manager_update on public.medical_volunteers;
drop policy if exists medical_volunteers_manager_delete on public.medical_volunteers;

create policy medical_volunteers_public_insert on public.medical_volunteers
  for insert to anon, authenticated with check (true);

create policy medical_volunteers_staff_select on public.medical_volunteers
  for select using (public.is_staff());

create policy medical_volunteers_manager_update on public.medical_volunteers
  for update using (public.is_manager());

create policy medical_volunteers_manager_delete on public.medical_volunteers
  for delete using (public.is_manager());

create or replace function public.get_public_medical_volunteers()
returns table (
  id uuid,
  full_name text,
  specialty text,
  wilaya_code text,
  commune_id text,
  current_workplace text,
  can_teleconsult boolean,
  can_field_intervene boolean,
  phone text
)
language sql stable security definer set search_path = public as $$
  select id, full_name, specialty, wilaya_code, commune_id, current_workplace,
    can_teleconsult, can_field_intervene,
    case when show_phone_publicly then phone else null end
  from public.medical_volunteers
  where status = 'verified';
$$;

grant execute on function public.get_public_medical_volunteers() to anon, authenticated;
