-- الحملات، المواقع المرجعية، الفئات، الملفات الشخصية، الجمعيات

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  disaster_type text not null default 'wildfire',
  region_wilaya text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_campaigns_updated_at before update on public.campaigns
  for each row execute function public.set_updated_at();

create table public.locations (
  id uuid primary key default gen_random_uuid(),
  wilaya_code text not null,
  wilaya_name text not null,
  commune_name text,
  created_at timestamptz not null default now(),
  unique (wilaya_code, commune_name)
);
create index idx_locations_wilaya_name on public.locations (wilaya_name);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name_ar text not null,
  default_unit public.unit_type not null default 'piece',
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role public.app_role not null default 'donor',
  wilaya text,
  organization_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  org_type text,
  contact_name text,
  phone text,
  wilaya text,
  verification_level public.verification_level not null default 'unverified',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_organizations_updated_at before update on public.organizations
  for each row execute function public.set_updated_at();

alter table public.profiles
  add constraint profiles_organization_fk foreign key (organization_id) references public.organizations(id);

-- إنشاء ملف شخصي تلقائيًا عند تسجيل مستخدم جديد في Supabase Auth
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
    coalesce(new.raw_user_meta_data->>'role', 'donor')::public.app_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
