-- بيانات مرجعية أساسية للتشغيل (وليست بيانات تجريبية): الحملة الحالية، الفئات، الولايات الـ58

insert into public.campaigns (slug, name, description, disaster_type, region_wilaya, is_active)
values (
  'jijel-fires-2026',
  'حرائق جيجل 2026',
  'حملة تنسيق المساعدات والإغاثة للمتضررين من حرائق الغابات في ولاية جيجل',
  'wildfire',
  'جيجل',
  true
)
on conflict (slug) do nothing;

insert into public.categories (slug, name_ar, default_unit, sort_order) values
  ('water', 'ماء', 'liter', 1),
  ('food', 'غذاء', 'portion', 2),
  ('clothing', 'ملابس', 'piece', 3),
  ('blankets', 'أغطية وبطانيات', 'piece', 4),
  ('baby_supplies', 'مستلزمات أطفال', 'box', 5),
  ('hygiene', 'مواد نظافة', 'box', 6),
  ('medical', 'أدوية ومستلزمات طبية', 'box', 7),
  ('kitchenware', 'أدوات طبخ', 'piece', 8),
  ('relief_materials', 'مواد إغاثة متنوعة', 'carton', 9),
  ('shelter', 'مأوى', 'piece', 10),
  ('construction_materials', 'مواد بناء', 'ton', 11),
  ('other', 'أخرى', 'piece', 12)
on conflict (slug) do nothing;

insert into public.locations (wilaya_code, wilaya_name, commune_name) values
  ('01','أدرار',null),('02','الشلف',null),('03','الأغواط',null),('04','أم البواقي',null),
  ('05','باتنة',null),('06','بجاية',null),('07','بسكرة',null),('08','بشار',null),
  ('09','البليدة',null),('10','البويرة',null),('11','تمنراست',null),('12','تبسة',null),
  ('13','تلمسان',null),('14','تيارت',null),('15','تيزي وزو',null),('16','الجزائر',null),
  ('17','الجلفة',null),('18','جيجل',null),('19','سطيف',null),('20','سعيدة',null),
  ('21','سكيكدة',null),('22','سيدي بلعباس',null),('23','عنابة',null),('24','قالمة',null),
  ('25','قسنطينة',null),('26','المدية',null),('27','مستغانم',null),('28','المسيلة',null),
  ('29','معسكر',null),('30','ورقلة',null),('31','وهران',null),('32','البيض',null),
  ('33','إليزي',null),('34','برج بوعريريج',null),('35','بومرداس',null),('36','الطارف',null),
  ('37','تندوف',null),('38','تيسمسيلت',null),('39','الوادي',null),('40','خنشلة',null),
  ('41','سوق أهراس',null),('42','تيبازة',null),('43','ميلة',null),('44','عين الدفلى',null),
  ('45','النعامة',null),('46','عين تموشنت',null),('47','غرداية',null),('48','غليزان',null),
  ('49','تيميمون',null),('50','برج باجي مختار',null),('51','أولاد جلال',null),('52','بني عباس',null),
  ('53','عين صالح',null),('54','عين قزام',null),('55','تقرت',null),('56','جانت',null),
  ('57','المغير',null),('58','المنيعة',null)
on conflict (wilaya_code, commune_name) do nothing;
