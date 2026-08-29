-- إصلاح: يجب تحويل نص الأولوية صراحةً إلى النوع priority_level

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
      (case when new.quantity <= 0 then 'critical' else 'high' end)::public.priority_level,
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

revoke execute on function public.sync_auto_need() from public;
