-- ============================================================================
-- بيانات تجريبية — ليست معلومات ميدانية حقيقية
-- هذا الملف مخصص لبيئة التطوير فقط لعرض شكل المنصة وهي تعمل.
-- كل الأسماء وأرقام الهواتف والكميات وهمية بالكامل ومُعلَّم عليها بوضوح.
-- لحذف هذه البيانات بالكامل، شغّل: supabase/seed_demo_data_cleanup.sql
-- ============================================================================

do $$
declare
  v_campaign_id uuid;
  v_cat_water uuid; v_cat_food uuid; v_cat_blankets uuid; v_cat_baby uuid;
  v_cat_medical uuid; v_cat_hygiene uuid; v_cat_clothing uuid;
  v_hub_taher uuid; v_hub_milia uuid; v_hub_jijel uuid;
  v_cp_algiers uuid; v_cp_blida uuid; v_cp_constantine uuid;
begin
  select id into v_campaign_id from public.campaigns where slug = 'jijel-fires-2026';

  select id into v_cat_water from public.categories where slug = 'water';
  select id into v_cat_food from public.categories where slug = 'food';
  select id into v_cat_blankets from public.categories where slug = 'blankets';
  select id into v_cat_baby from public.categories where slug = 'baby_supplies';
  select id into v_cat_medical from public.categories where slug = 'medical';
  select id into v_cat_hygiene from public.categories where slug = 'hygiene';
  select id into v_cat_clothing from public.categories where slug = 'clothing';

  -- مراكز الاستقبال (تجريبية)
  insert into public.relief_hubs (
    campaign_id, name, wilaya, commune, address, lat, lng, phone, show_phone_publicly,
    contact_name, opening_hours, status, verification_level, notes
  ) values
  (v_campaign_id, 'مركز استقبال الطاهير (بيانات تجريبية)', 'جيجل', 'الطاهير',
   'بالقرب من المقر البلدي، الطاهير', 36.7667, 5.9333, '0555000001', true,
   'مسؤول تجريبي', 'يوميًا 8 صباحًا - 6 مساءً', 'open', 'field_verified',
   '[بيانات تجريبية] لأغراض التطوير فقط')
  returning id into v_hub_taher;

  insert into public.relief_hubs (
    campaign_id, name, wilaya, commune, address, lat, lng, phone, show_phone_publicly,
    contact_name, opening_hours, status, verification_level, notes
  ) values
  (v_campaign_id, 'مركز استقبال الميلية (بيانات تجريبية)', 'جيجل', 'الميلية',
   'وسط مدينة الميلية', 36.7936, 6.2331, '0555000002', true,
   'مسؤول تجريبي', 'يوميًا 8 صباحًا - 6 مساءً', 'open', 'verified',
   '[بيانات تجريبية] لأغراض التطوير فقط')
  returning id into v_hub_milia;

  insert into public.relief_hubs (
    campaign_id, name, wilaya, commune, address, lat, lng, phone, show_phone_publicly,
    contact_name, opening_hours, status, verification_level, is_shelter, notes
  ) values
  (v_campaign_id, 'مركز إيواء جيجل الوسطى (بيانات تجريبية)', 'جيجل', 'جيجل',
   'حي 1 نوفمبر، جيجل', 36.8190, 5.7660, '0555000003', false,
   'مسؤول تجريبي', 'على مدار الساعة', 'open', 'pending', true,
   '[بيانات تجريبية] لأغراض التطوير فقط')
  returning id into v_hub_jijel;

  -- نقاط التجميع (تجريبية) في ولايات أخرى
  insert into public.collection_points (
    campaign_id, name, wilaya, commune, address, lat, lng, phone, show_phone_publicly,
    contact_name, accepted_categories, opening_hours, status, verification_level, notes
  ) values
  (v_campaign_id, 'نقطة تجميع الجزائر الوسطى (بيانات تجريبية)', 'الجزائر', 'سيدي امحمد',
   'بالقرب من ساحة الشهداء', 36.7538, 3.0588, '0555000010', true,
   'منسق تجريبي', array['water','food','blankets','baby_supplies'], 'يوميًا 9 صباحًا - 5 مساءً',
   'open', 'verified', '[بيانات تجريبية] لأغراض التطوير فقط')
  returning id into v_cp_algiers;

  insert into public.collection_points (
    campaign_id, name, wilaya, commune, address, lat, lng, phone, show_phone_publicly,
    contact_name, accepted_categories, opening_hours, status, verification_level, notes
  ) values
  (v_campaign_id, 'نقطة تجميع البليدة (بيانات تجريبية)', 'البليدة', 'البليدة',
   'وسط المدينة', 36.4703, 2.8277, '0555000011', false,
   'منسق تجريبي', array['clothing','hygiene','medical'], 'يوميًا 9 صباحًا - 5 مساءً',
   'open', 'unverified', '[بيانات تجريبية] لأغراض التطوير فقط')
  returning id into v_cp_blida;

  insert into public.collection_points (
    campaign_id, name, wilaya, commune, address, lat, lng, phone, show_phone_publicly,
    contact_name, accepted_categories, opening_hours, status, verification_level, notes
  ) values
  (v_campaign_id, 'نقطة تجميع قسنطينة (بيانات تجريبية)', 'قسنطينة', 'قسنطينة',
   'حي زواغي سليمان', 36.3650, 6.6147, '0555000012', true,
   'منسق تجريبي', array['water','food','blankets'], 'السبت - الخميس 9 - 4',
   'full', 'verified', '[بيانات تجريبية] لأغراض التطوير فقط')
  returning id into v_cp_constantine;

  -- حركات مخزون أولية (تُنشئ أرصدة inventory_items تلقائيًا عبر trigger)
  insert into public.inventory_transactions (hub_id, category_id, type, quantity, unit, note) values
    (v_hub_taher, v_cat_water, 'in', 12000, 'liter', '[بيانات تجريبية] شحنة أولية'),
    (v_hub_taher, v_cat_blankets, 'in', 150, 'piece', '[بيانات تجريبية] شحنة أولية'),
    (v_hub_milia, v_cat_food, 'in', 300, 'portion', '[بيانات تجريبية] شحنة أولية'),
    (v_hub_milia, v_cat_baby, 'in', 20, 'box', '[بيانات تجريبية] شحنة أولية'),
    (v_hub_jijel, v_cat_medical, 'in', 40, 'box', '[بيانات تجريبية] شحنة أولية'),
    (v_hub_jijel, v_cat_hygiene, 'in', 90, 'box', '[بيانات تجريبية] شحنة أولية');

  -- ضبط حدود دنيا لبعض المواد لإظهار نقص حقيقي (يولّد "احتياج" تلقائي عبر trigger)
  update public.inventory_items set min_threshold = 20000 where hub_id = v_hub_taher and category_id = v_cat_water;
  update public.inventory_items set min_threshold = 400 where hub_id = v_hub_taher and category_id = v_cat_blankets;
  update public.inventory_items set min_threshold = 800 where hub_id = v_hub_milia and category_id = v_cat_food;
  update public.inventory_items set min_threshold = 100 where hub_id = v_hub_milia and category_id = v_cat_baby;
  update public.inventory_items set min_threshold = 60 where hub_id = v_hub_jijel and category_id = v_cat_medical;

  -- احتياج مُدخل يدويًا من فريق ميداني (تجريبي)
  insert into public.needs (
    campaign_id, category_id, hub_id, wilaya, commune, title,
    quantity_needed, quantity_available, unit, priority, status, source_type,
    verification_level, notes
  ) values (
    v_campaign_id, v_cat_clothing, v_hub_jijel, 'جيجل', 'جيجل', 'ملابس شتوية للأطفال',
    500, 80, 'piece', 'high', 'active', 'field_team', 'field_verified',
    '[بيانات تجريبية] لأغراض التطوير فقط'
  );

  -- طلبات مساعدة من أسر متضررة (تجريبية)
  insert into public.beneficiary_requests (
    campaign_id, full_name, phone, wilaya, commune, address_note,
    family_members_count, children_count, housing_status, is_housing_habitable,
    has_injuries, needs_medical, lost_livestock, lost_income,
    needed_categories, status, verification_level, source_type, internal_notes
  ) values
  (v_campaign_id, 'عائلة تجريبية 1', '0555000101', 'جيجل', 'الطاهير', 'حي قريب من الغابة',
   6, 3, 'متضرر جزئيًا', false, false, true, true, true,
   array['water','food','blankets','medical'], 'under_review', 'pending', 'public_report',
   '[بيانات تجريبية] لأغراض التطوير فقط'),
  (v_campaign_id, 'عائلة تجريبية 2', '0555000102', 'جيجل', 'الميلية', 'بالقرب من الوادي',
   4, 1, 'غير صالح للسكن', false, true, true, false, true,
   array['shelter','food','medical'], 'verified', 'field_verified', 'field_team',
   '[بيانات تجريبية] لأغراض التطوير فقط'),
  (v_campaign_id, 'عائلة تجريبية 3', '0555000103', 'جيجل', 'جيجل', null,
   3, 0, 'سليم جزئيًا', true, false, false, false, false,
   array['clothing','hygiene'], 'pending', 'unverified', 'public_report',
   '[بيانات تجريبية] لأغراض التطوير فقط');

  -- مساعدات مسجَّلة من متبرعين (تجريبية)
  insert into public.donations (
    campaign_id, donor_name, donor_phone, current_wilaya, current_commune,
    needs_transport, can_deliver_self, status, suggested_collection_point_id, notes
  ) values
  (v_campaign_id, 'متبرع تجريبي - الجزائر', '0555000201', 'الجزائر', 'سيدي امحمد',
   true, false, 'registered', v_cp_algiers, '[بيانات تجريبية] لأغراض التطوير فقط')
  returning id into v_hub_taher; -- إعادة استخدام المتغير مؤقتًا لتفادي تعريف متغير إضافي

  insert into public.donation_items (donation_id, category_id, quantity, unit, description) values
    (v_hub_taher, v_cat_water, 500, 'piece', 'قوارير مياه 1.5 لتر (بيانات تجريبية)'),
    (v_hub_taher, v_cat_blankets, 200, 'piece', 'بطانيات صوفية (بيانات تجريبية)');

  -- عروض نقل (تجريبية)
  insert into public.transport_offers (
    campaign_id, driver_name, phone, origin_wilaya, destination_wilaya,
    vehicle_type, max_capacity_kg, has_empty_space, status, notes
  ) values
  (v_campaign_id, 'سائق تجريبي', '0555000301', 'الجزائر', 'جيجل',
   'medium_truck', 5000, true, 'requested', '[بيانات تجريبية] لأغراض التطوير فقط');

  -- عملية توزيع مسجَّلة (تجريبية) — تُنشئ تلقائيًا حركة صرف من المخزون
  insert into public.distributions (
    campaign_id, hub_id, category_id, quantity, unit,
    beneficiary_family_count, responsible_name, notes
  ) values
  (v_campaign_id, v_hub_milia, v_cat_food, 150, 'portion',
   45, 'منسق تجريبي', '[بيانات تجريبية] لأغراض التطوير فقط');

  -- معلومة رسمية موثقة (تجريبية)
  insert into public.official_updates (
    campaign_id, title, body, source, update_type, published_at
  ) values
  (v_campaign_id, 'مثال: بيان تجريبي حول سير عمليات الإغاثة',
   'هذا نص تجريبي فقط لعرض شكل قسم المعلومات الموثقة. يجب استبداله ببيانات حقيقية من مصدر موثوق.',
   'بيانات تجريبية للتطوير', 'news', now());

end $$;
