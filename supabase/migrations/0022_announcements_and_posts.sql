-- شريط الأخبار العاجلة (announcements) + مدونة الأخبار (posts)
-- كلاهما ينشره الطاقم المسؤول فقط، ويُقرأ من العامة.

create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id),
  message text not null,
  is_active boolean not null default true,
  sort_order int not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_announcements_active on public.announcements(is_active, sort_order);
create trigger trg_announcements_updated_at before update on public.announcements
  for each row execute function public.set_updated_at();

alter table public.announcements enable row level security;

-- العامة ترى فقط الرسائل المفعّلة والسارية زمنيًا
create policy announcements_select_public on public.announcements for select
  using (
    public.is_staff()
    or (
      is_active
      and (starts_at is null or starts_at <= now())
      and (ends_at is null or ends_at >= now())
    )
  );
create policy announcements_manager_insert on public.announcements for insert with check (public.is_manager());
create policy announcements_manager_update on public.announcements for update using (public.is_manager());
create policy announcements_manager_delete on public.announcements for delete using (public.is_manager());

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid references public.campaigns(id),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text not null,
  is_published boolean not null default false,
  published_at timestamptz,
  author_id uuid references public.profiles(id),
  author_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_posts_published on public.posts(is_published, published_at desc);
create trigger trg_posts_updated_at before update on public.posts
  for each row execute function public.set_updated_at();

alter table public.posts enable row level security;

create policy posts_select_public on public.posts for select
  using (public.is_staff() or (is_published and (published_at is null or published_at <= now())));
create policy posts_manager_insert on public.posts for insert with check (public.is_manager());
create policy posts_manager_update on public.posts for update using (public.is_manager());
create policy posts_manager_delete on public.posts for delete using (public.is_manager());
