-- المساعدات (donations)، النقل، التوزيع، التحقق، الإشعارات، سجل الأنشطة، المعلومات الرسمية

create table public.donations (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id),
  donor_name text not null,
  donor_phone text not null,
  donor_id uuid references public.profiles(id),
  current_wilaya text not null,
  current_commune text,
  needs_transport boolean not null default false,
  can_deliver_self boolean not null default false,
  ready_at timestamptz,
  status public.donation_status not null default 'registered',
  suggested_collection_point_id uuid references public.collection_points(id),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_donations_status on public.donations(status);
create trigger trg_donations_updated_at before update on public.donations
  for each row execute function public.set_updated_at();

create table public.donation_items (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid not null references public.donations(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  quantity numeric not null check (quantity > 0),
  unit public.unit_type not null default 'piece',
  description text,
  created_at timestamptz not null default now()
);
create index idx_donation_items_donation on public.donation_items(donation_id);

create table public.transport_offers (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id),
  driver_name text not null,
  phone text not null,
  driver_id uuid references public.profiles(id),
  origin_wilaya text not null,
  origin_note text,
  destination_wilaya text not null default 'جيجل',
  destination_note text,
  vehicle_type public.vehicle_type not null,
  max_capacity_kg numeric,
  available_space_note text,
  travel_date date,
  time_window text,
  has_empty_space boolean not null default true,
  notes text,
  status public.transport_status not null default 'requested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_transport_offers_updated_at before update on public.transport_offers
  for each row execute function public.set_updated_at();

create table public.transport_requests (
  id uuid primary key default gen_random_uuid(),
  donation_id uuid references public.donations(id),
  need_id uuid references public.needs(id),
  transport_offer_id uuid references public.transport_offers(id),
  from_wilaya text not null,
  to_wilaya text not null,
  category_id uuid references public.categories(id),
  quantity numeric,
  unit public.unit_type,
  status public.transport_status not null default 'requested',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_transport_requests_updated_at before update on public.transport_requests
  for each row execute function public.set_updated_at();

create table public.distributions (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id),
  hub_id uuid not null references public.relief_hubs(id),
  category_id uuid not null references public.categories(id),
  quantity numeric not null check (quantity > 0),
  unit public.unit_type not null default 'piece',
  beneficiary_family_count int not null default 0,
  distribution_date date not null default current_date,
  responsible_name text not null,
  responsible_id uuid references public.profiles(id),
  proof_file_path text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_distributions_updated_at before update on public.distributions
  for each row execute function public.set_updated_at();

-- كل عملية توزيع تُسجَّل تلقائيًا كحركة صرف من المخزون
create or replace function public.apply_distribution_inventory()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.inventory_transactions (
    hub_id, category_id, type, quantity, unit, related_distribution_id, performed_by, note
  ) values (
    new.hub_id, new.category_id, 'out', new.quantity, new.unit, new.id, new.responsible_id,
    'صرف تلقائي عند تسجيل عملية توزيع'
  );
  return new;
end;
$$;

create trigger trg_apply_distribution_inventory
  after insert on public.distributions
  for each row execute function public.apply_distribution_inventory();

create table public.verification_records (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid not null,
  level public.verification_level not null,
  verified_by uuid references public.profiles(id),
  note text,
  created_at timestamptz not null default now()
);
create index idx_verification_entity on public.verification_records(entity_type, entity_id);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  is_read boolean not null default false,
  link text,
  created_at timestamptz not null default now()
);
create index idx_notifications_profile on public.notifications(profile_id, is_read);

create table public.activity_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before jsonb,
  after jsonb,
  created_at timestamptz not null default now()
);
create index idx_activity_logs_entity on public.activity_logs(entity_type, entity_id);
create index idx_activity_logs_created on public.activity_logs(created_at desc);

create table public.official_updates (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id),
  title text not null,
  body text,
  source text not null,
  url text,
  update_type text not null default 'news',
  published_at timestamptz not null default now(),
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create index idx_official_updates_published on public.official_updates(published_at desc);
