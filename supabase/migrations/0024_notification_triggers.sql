-- إشعارات تلقائية للطاقم (أدمن/منسّق) عند وصول طلب مساعدة جديد، عرض تبرع جديد، أو عرض نقل جديد.
-- جدول notifications وسياساته موجودة مسبقًا (0004/0005) دون أي شيء يغذّيها — هذه الدفعة تسدّ الفجوة.

create or replace function public.notify_managers(p_title text, p_body text, p_link text)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.notifications (profile_id, title, body, link)
  select id, p_title, p_body, p_link
  from public.profiles
  where role in ('admin', 'coordinator');
$$;

create or replace function public.notify_new_beneficiary_request()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_title text;
begin
  v_title := case
    when new.priority = 'critical' or new.has_injuries or new.needs_medical
      then '🔴 طلب عاجل: طلب مساعدة جديد'
    else 'طلب مساعدة جديد'
  end;

  perform public.notify_managers(
    v_title,
    new.full_name || ' — ' || new.commune || '، ' || new.wilaya,
    '/admin/beneficiaries'
  );

  return new;
end;
$$;

create trigger trg_notify_new_beneficiary_request
  after insert on public.beneficiary_requests
  for each row execute function public.notify_new_beneficiary_request();

create or replace function public.notify_new_donation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_managers(
    'عرض تبرع جديد',
    new.donor_name || ' — ' || new.current_wilaya,
    '/admin/donations'
  );

  return new;
end;
$$;

create trigger trg_notify_new_donation
  after insert on public.donations
  for each row execute function public.notify_new_donation();

create or replace function public.notify_new_transport_offer()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.notify_managers(
    'عرض نقل جديد',
    new.driver_name || ' — ' || new.origin_wilaya || ' → ' || new.destination_wilaya,
    '/admin/transport'
  );

  return new;
end;
$$;

create trigger trg_notify_new_transport_offer
  after insert on public.transport_offers
  for each row execute function public.notify_new_transport_offer();
