-- طلبات المتضررين، نقاط التجميع، مراكز الاستقبال، الاحتياجات، المخزون

create table public.beneficiary_requests (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id),
  full_name text not null,
  phone text not null,
  wilaya text not null default 'جيجل',
  commune text not null,
  address_note text,
  family_members_count int not null default 1,
  children_count int not null default 0,
  housing_status text,
  is_housing_habitable boolean,
  has_injuries boolean not null default false,
  injuries_note text,
  needs_medical boolean not null default false,
  medical_note text,
  lost_livestock boolean not null default false,
  lost_income boolean not null default false,
  needed_categories text[] not null default '{}',
  other_needs_note text,
  status public.request_status not null default 'pending',
  verification_level public.verification_level not null default 'unverified',
  priority public.priority_level not null default 'medium',
  source_type public.source_type not null default 'public_report',
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  internal_notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_beneficiary_requests_status on public.beneficiary_requests(status);
create index idx_beneficiary_requests_commune on public.beneficiary_requests(commune);
create trigger trg_beneficiary_requests_updated_at before update on public.beneficiary_requests
  for each row execute function public.set_updated_at();

-- حساب أولوية أولية تلقائيًا عند إنشاء الطلب (قابلة للتعديل يدويًا لاحقًا من الإدارة)
create or replace function public.calculate_beneficiary_priority()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  score int := 0;
begin
  score := score + least(new.family_members_count, 10);
  score := score + (new.children_count * 2);
  if new.has_injuries then score := score + 15; end if;
  if new.needs_medical then score := score + 15; end if;
  if new.is_housing_habitable is false then score := score + 20; end if;
  if new.lost_livestock then score := score + 3; end if;
  if new.lost_income then score := score + 5; end if;

  if score >= 35 then new.priority := 'critical';
  elsif score >= 20 then new.priority := 'high';
  elsif score >= 10 then new.priority := 'medium';
  else new.priority := 'low';
  end if;

  return new;
end;
$$;

create trigger trg_calculate_beneficiary_priority
  before insert on public.beneficiary_requests
  for each row execute function public.calculate_beneficiary_priority();

create table public.collection_points (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id),
  name text not null,
  wilaya text not null,
  commune text not null,
  address text,
  lat double precision,
  lng double precision,
  phone text,
  show_phone_publicly boolean not null default false,
  contact_name text,
  accepted_categories text[] not null default '{}',
  capacity_note text,
  opening_hours text,
  status public.point_status not null default 'open',
  verification_level public.verification_level not null default 'unverified',
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_collection_points_updated_at before update on public.collection_points
  for each row execute function public.set_updated_at();

create table public.relief_hubs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id),
  name text not null,
  wilaya text not null,
  commune text not null,
  address text,
  lat double precision,
  lng double precision,
  phone text,
  show_phone_publicly boolean not null default false,
  contact_name text,
  capacity_note text,
  opening_hours text,
  is_shelter boolean not null default false,
  status public.point_status not null default 'open',
  verification_level public.verification_level not null default 'unverified',
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_relief_hubs_updated_at before update on public.relief_hubs
  for each row execute function public.set_updated_at();

create table public.needs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id),
  category_id uuid not null references public.categories(id),
  hub_id uuid references public.relief_hubs(id),
  collection_point_id uuid references public.collection_points(id),
  wilaya text not null,
  commune text not null,
  title text,
  quantity_needed numeric not null default 0,
  quantity_available numeric not null default 0,
  unit public.unit_type not null default 'piece',
  priority public.priority_level not null default 'medium',
  status public.need_status not null default 'active',
  source_type public.source_type not null default 'field_team',
  is_auto_generated boolean not null default false,
  verification_level public.verification_level not null default 'unverified',
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  notes text,
  expires_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_needs_status on public.needs(status);
create index idx_needs_priority on public.needs(priority);
create index idx_needs_category on public.needs(category_id);
create unique index uq_needs_auto_hub_category on public.needs (hub_id, category_id) where is_auto_generated = true;
create trigger trg_needs_updated_at before update on public.needs
  for each row execute function public.set_updated_at();

create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  hub_id uuid not null references public.relief_hubs(id) on delete cascade,
  category_id uuid not null references public.categories(id),
  quantity numeric not null default 0,
  unit public.unit_type not null default 'piece',
  min_threshold numeric not null default 0,
  updated_at timestamptz not null default now(),
  unique (hub_id, category_id)
);

create table public.inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  hub_id uuid not null references public.relief_hubs(id),
  category_id uuid not null references public.categories(id),
  type public.inventory_txn_type not null,
  quantity numeric not null check (quantity > 0),
  unit public.unit_type not null default 'piece',
  source_hub_id uuid references public.relief_hubs(id),
  destination_hub_id uuid references public.relief_hubs(id),
  related_distribution_id uuid,
  related_donation_id uuid,
  performed_by uuid references public.profiles(id),
  note text,
  created_at timestamptz not null default now()
);
create index idx_inventory_txn_hub on public.inventory_transactions(hub_id);
create index idx_inventory_items_hub on public.inventory_items(hub_id);

-- تطبيق أثر حركة المخزون على جدول الأرصدة inventory_items
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
    values (new.hub_id, new.category_id, -new.quantity, new.unit, 0, now())
    on conflict (hub_id, category_id)
    do update set quantity = greatest(public.inventory_items.quantity - new.quantity, 0), updated_at = now();

  elsif new.type = 'adjustment' then
    insert into public.inventory_items (hub_id, category_id, quantity, unit, min_threshold, updated_at)
    values (new.hub_id, new.category_id, new.quantity, new.unit, 0, now())
    on conflict (hub_id, category_id)
    do update set quantity = new.quantity, updated_at = now();

  elsif new.type = 'transfer' then
    if new.source_hub_id is null or new.destination_hub_id is null then
      raise exception 'عملية النقل بين المراكز تتطلب تحديد المصدر والوجهة';
    end if;

    insert into public.inventory_items (hub_id, category_id, quantity, unit, min_threshold, updated_at)
    values (new.source_hub_id, new.category_id, -new.quantity, new.unit, 0, now())
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

create trigger trg_apply_inventory_transaction
  after insert on public.inventory_transactions
  for each row execute function public.apply_inventory_transaction();

-- توليد/تحديث "احتياج" تلقائي عند انخفاض المخزون تحت الحد الأدنى، وإغلاقه عند العودة فوقه
create or replace function public.sync_auto_need()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_campaign_id uuid;
  v_wilaya text;
  v_commune text;
begin
  select campaign_id, wilaya, commune into v_campaign_id, v_wilaya, v_commune
  from public.relief_hubs where id = new.hub_id;

  if new.min_threshold > 0 and new.quantity < new.min_threshold then
    insert into public.needs (
      campaign_id, category_id, hub_id, wilaya, commune, title,
      quantity_needed, quantity_available, unit, priority, status,
      source_type, is_auto_generated
    ) values (
      v_campaign_id, new.category_id, new.hub_id, v_wilaya, v_commune, null,
      new.min_threshold, greatest(new.quantity, 0), new.unit,
      case when new.quantity <= 0 then 'critical' else 'high' end,
      'active', 'field_team', true
    )
    on conflict (hub_id, category_id) where is_auto_generated = true
    do update set
      quantity_needed = excluded.quantity_needed,
      quantity_available = excluded.quantity_available,
      priority = excluded.priority,
      status = 'active',
      updated_at = now();
  else
    update public.needs
      set status = 'resolved', updated_at = now()
      where hub_id = new.hub_id and category_id = new.category_id
        and is_auto_generated = true and status = 'active';
  end if;

  return new;
end;
$$;

create trigger trg_sync_auto_need
  after insert or update of quantity, min_threshold on public.inventory_items
  for each row execute function public.sync_auto_need();
