-- سجل المناطق المتضررة من الحرائق عبر ولايات جيجل وبجاية وميلة وسكيكدة
-- كيان مستقل عن الاحتياجات ونقاط التجميع: يصف "أين وقع الضرر" لا "ماذا نحتاج".

create type public.affected_severity as enum (
  'ravaged',      -- أضرار جسيمة / ضحايا
  'evacuated',    -- تم إجلاء السكان
  'threatened',   -- منازل مهددة
  'burning',      -- حريق نشط / منطقة متضررة
  'unconfirmed'   -- بلاغ من مواقع التواصل لم يُؤكَّد بعد
);

create table public.affected_areas (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id),
  wilaya text not null,
  wilaya_fr text,
  daira text not null,
  daira_fr text,
  commune text not null,
  commune_fr text,
  spot text,
  spot_fr text,
  status_raw text,
  severity public.affected_severity not null default 'burning',
  lat double precision,
  lng double precision,
  notes text,
  source text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_affected_areas_wilaya on public.affected_areas(wilaya);
create index idx_affected_areas_severity on public.affected_areas(severity);

create trigger trg_affected_areas_updated_at before update on public.affected_areas
  for each row execute function public.set_updated_at();

alter table public.affected_areas enable row level security;

-- لا تحتوي على أي بيانات شخصية: القراءة عامة، والكتابة للطاقم المسؤول فقط.
create policy affected_areas_select_all on public.affected_areas for select using (true);
create policy affected_areas_manager_insert on public.affected_areas for insert with check (public.is_manager());
create policy affected_areas_manager_update on public.affected_areas for update using (public.is_manager());
create policy affected_areas_manager_delete on public.affected_areas for delete using (public.is_manager());
