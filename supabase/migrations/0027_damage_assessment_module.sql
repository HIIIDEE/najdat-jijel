-- وحدة تقييم أضرار السكن وربطها بمواد الترميم والحرفيين المتطوعين.
-- 1. تقييم الأضرار (استمارة عامة + صور) يُنتج تقديرًا للمواد ويُنشئ احتياجًا قياسيًا
--    يدخل تلقائيًا في دورة المطابقة الحالية (donations -> matching.ts -> transport).
-- 2. جدول حرفيين متطوعين، بنفس نمط medical_volunteers تمامًا.

-- 1. Enums
do $$ begin
    create type damage_assessment_status as enum
        ('pending', 'estimated', 'matched', 'in_progress', 'completed', 'rejected');
exception
    when duplicate_object then null;
end $$;

do $$ begin
    create type artisan_verification_status as enum ('pending', 'verified', 'rejected');
exception
    when duplicate_object then null;
end $$;

-- 2. جدول تقييمات الأضرار
create table if not exists public.damage_assessments (
    id uuid primary key default gen_random_uuid(),
    beneficiary_request_id uuid references public.beneficiary_requests(id) on delete set null,
    full_name text not null,
    phone text not null,
    wilaya text not null,
    commune text not null,
    address_note text,
    needs_paint boolean not null default false,
    paint_area_sqm numeric,
    needs_flooring boolean not null default false,
    needs_roofing boolean not null default false,
    needs_plumbing boolean not null default false,
    needs_electrical boolean not null default false,
    finishing_notes text,
    photo_paths text[] not null default '{}',
    status damage_assessment_status not null default 'pending',
    estimated_paint_liters numeric,
    estimated_paint_cans integer,
    required_specialties text[] not null default '{}',
    linked_need_id uuid references public.needs(id) on delete set null,
    assigned_artisan_id uuid,
    verified_by uuid references public.profiles(id),
    verified_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
create index if not exists idx_damage_assessments_status on public.damage_assessments(status);
create index if not exists idx_damage_assessments_wilaya on public.damage_assessments(wilaya);

-- 3. جدول الحرفيين المتطوعين
create table if not exists public.artisan_volunteers (
    id uuid primary key default gen_random_uuid(),
    full_name text not null,
    phone text not null,
    specialty text not null,
    wilaya_code text not null,
    commune_id text not null,
    can_travel boolean not null default false,
    has_own_tools boolean not null default false,
    show_phone_publicly boolean not null default false,
    notes text,
    status artisan_verification_status not null default 'pending',
    verified_by uuid references public.profiles(id),
    verified_at timestamptz,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

alter table public.damage_assessments
    drop constraint if exists damage_assessments_assigned_artisan_id_fkey;
alter table public.damage_assessments
    add constraint damage_assessments_assigned_artisan_id_fkey
    foreign key (assigned_artisan_id) references public.artisan_volunteers(id) on delete set null;

drop trigger if exists trg_damage_assessments_updated_at on public.damage_assessments;
create trigger trg_damage_assessments_updated_at
    before update on public.damage_assessments
    for each row execute function public.set_updated_at();

drop trigger if exists trg_artisan_volunteers_updated_at on public.artisan_volunteers;
create trigger trg_artisan_volunteers_updated_at
    before update on public.artisan_volunteers
    for each row execute function public.set_updated_at();

-- 4. RLS
alter table public.damage_assessments enable row level security;
alter table public.artisan_volunteers enable row level security;

drop policy if exists damage_assessments_public_insert on public.damage_assessments;
drop policy if exists damage_assessments_staff_select on public.damage_assessments;
drop policy if exists damage_assessments_manager_update on public.damage_assessments;
drop policy if exists damage_assessments_manager_delete on public.damage_assessments;

create policy damage_assessments_public_insert on public.damage_assessments
    for insert to anon, authenticated with check (true);
create policy damage_assessments_staff_select on public.damage_assessments
    for select using (public.is_staff());
create policy damage_assessments_manager_update on public.damage_assessments
    for update using (public.is_manager());
create policy damage_assessments_manager_delete on public.damage_assessments
    for delete using (public.is_manager());

drop policy if exists artisan_volunteers_public_insert on public.artisan_volunteers;
drop policy if exists artisan_volunteers_staff_select on public.artisan_volunteers;
drop policy if exists artisan_volunteers_manager_update on public.artisan_volunteers;
drop policy if exists artisan_volunteers_manager_delete on public.artisan_volunteers;

create policy artisan_volunteers_public_insert on public.artisan_volunteers
    for insert to anon, authenticated with check (true);
create policy artisan_volunteers_staff_select on public.artisan_volunteers
    for select using (public.is_staff());
create policy artisan_volunteers_manager_update on public.artisan_volunteers
    for update using (public.is_manager());
create policy artisan_volunteers_manager_delete on public.artisan_volunteers
    for delete using (public.is_manager());

-- 5. حاوية تخزين صور الأضرار (خاصة، رفع عام مسموح، قراءة للطاقم فقط)
insert into storage.buckets (id, name, public)
values ('damage-photos', 'damage-photos', false)
on conflict (id) do nothing;

drop policy if exists storage_damage_photos_public_insert on storage.objects;
drop policy if exists storage_damage_photos_staff_read on storage.objects;
drop policy if exists storage_damage_photos_manager_delete on storage.objects;

create policy storage_damage_photos_public_insert on storage.objects
    for insert to anon, authenticated with check (bucket_id = 'damage-photos');
create policy storage_damage_photos_staff_read on storage.objects
    for select using (bucket_id = 'damage-photos' and public.is_staff());
create policy storage_damage_photos_manager_delete on storage.objects
    for delete using (bucket_id = 'damage-photos' and public.is_manager());

-- 6. RPC عامة لقائمة الحرفيين الموثقين (نفس نمط get_public_medical_volunteers)
create or replace function public.get_public_artisan_volunteers()
returns table (
    id uuid,
    full_name text,
    specialty text,
    wilaya_code text,
    commune_id text,
    can_travel boolean,
    has_own_tools boolean,
    phone text
)
language sql stable security definer set search_path = public as $$
    select id, full_name, specialty, wilaya_code, commune_id, can_travel, has_own_tools,
        case when show_phone_publicly then phone else null end
    from public.artisan_volunteers
    where status = 'verified';
$$;

grant execute on function public.get_public_artisan_volunteers() to anon, authenticated;
