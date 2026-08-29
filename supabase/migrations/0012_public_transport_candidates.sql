-- دالة عامة آمنة تعرض ملخص المساعدات التي تحتاج نقلًا دون كشف بيانات المتبرع الشخصية
-- تُستخدم في صفحة النقل لعرض "مساعدات قريبة من مسارك" لأي زائر (حتى قبل تسجيله كسائق)

create or replace function public.get_public_transport_candidates()
returns table (
  donation_id uuid,
  current_wilaya text,
  current_commune text,
  items_summary text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    d.id,
    d.current_wilaya,
    d.current_commune,
    string_agg(di.quantity::text || ' ' || di.unit::text || ' — ' || c.name_ar, '، ')
  from public.donations d
  join public.donation_items di on di.donation_id = d.id
  join public.categories c on c.id = di.category_id
  where d.needs_transport = true and d.status in ('registered', 'matched')
  group by d.id, d.current_wilaya, d.current_commune;
$$;

grant execute on function public.get_public_transport_candidates() to anon, authenticated;
