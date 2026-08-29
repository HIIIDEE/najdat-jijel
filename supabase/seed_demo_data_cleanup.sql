-- ============================================================================
-- حذف كل البيانات التجريبية التي أدخلها seed_demo_data.sql
-- كل الصفوف التجريبية تحمل العلامة '[بيانات تجريبية]' في حقل notes/internal_notes،
-- أو أرقام هواتف تبدأ بـ 0555000، أو أسماء تحتوي على "تجريبي" / "تجريبية".
-- لا يمس هذا الملف البيانات المرجعية الأساسية (campaigns, categories, locations).
-- ============================================================================

delete from public.distributions where notes ilike '%بيانات تجريبية%';
delete from public.official_updates where source = 'بيانات تجريبية للتطوير';
delete from public.transport_offers where phone like '0555000%';
delete from public.donation_items where donation_id in (
  select id from public.donations where donor_phone like '0555000%'
);
delete from public.donations where donor_phone like '0555000%';
delete from public.beneficiary_requests where phone like '0555000%';
delete from public.needs where notes ilike '%بيانات تجريبية%';
delete from public.inventory_transactions where note ilike '%بيانات تجريبية%';
delete from public.inventory_items where hub_id in (
  select id from public.relief_hubs where notes ilike '%بيانات تجريبية%'
);
delete from public.collection_points where notes ilike '%بيانات تجريبية%';
delete from public.relief_hubs where notes ilike '%بيانات تجريبية%';
