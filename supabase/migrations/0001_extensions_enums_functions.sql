-- هبة الجزائر: الإضافات، الأنواع (enums)، الدوال المساعدة العامة

create extension if not exists pgcrypto with schema extensions;

create type public.app_role as enum (
  'admin','coordinator','volunteer','verified_organization','donor','driver','beneficiary'
);

create type public.verification_level as enum (
  'unverified','pending','verified','field_verified'
);

create type public.priority_level as enum (
  'critical','high','medium','low'
);

create type public.request_status as enum (
  'pending','under_review','verified','partially_helped','helped','closed','rejected'
);

create type public.point_status as enum (
  'open','full','paused','closed'
);

create type public.transport_status as enum (
  'requested','matched','confirmed','in_transit','delivered','cancelled'
);

create type public.inventory_txn_type as enum (
  'in','out','adjustment','transfer'
);

create type public.source_type as enum (
  'field_team','organization','municipality','official','volunteer','public_report'
);

create type public.unit_type as enum (
  'piece','box','portion','carton','liter','kg','ton','bundle'
);

create type public.vehicle_type as enum (
  'car','van','small_truck','medium_truck','large_truck','trailer'
);

create type public.donation_status as enum (
  'registered','matched','delivered','cancelled'
);

create type public.need_status as enum (
  'active','resolved','expired'
);

-- تحديث عمود updated_at تلقائيًا عند أي تعديل
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
