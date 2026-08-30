import "server-only";
import { createClient } from "@/lib/supabase/server";
import { activeCampaignSlug } from "@/config/site";
import type { Database } from "@/types/database";

type AffectedAreaRow = Database["public"]["Tables"]["affected_areas"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

// Fallback seed data matching upstream migrations (0001, 0009, 0015, 0016, 0018)
const fallbackCategories: CategoryRow[] = [
  { id: "cat-1", slug: "water", name_ar: "ماء", default_unit: "carton", sort_order: 10, created_at: new Date().toISOString() },
  { id: "cat-2", slug: "food", name_ar: "غذاء", default_unit: "portion", sort_order: 20, created_at: new Date().toISOString() },
  { id: "cat-3", slug: "medical", name_ar: "دواء ومستلزمات طبية", default_unit: "box", sort_order: 30, created_at: new Date().toISOString() },
  { id: "cat-4", slug: "bedding", name_ar: "أغطية وأفرشة", default_unit: "piece", sort_order: 40, created_at: new Date().toISOString() },
  { id: "cat-5", slug: "tents", name_ar: "خيم ومآوي مؤقتة", default_unit: "piece", sort_order: 50, created_at: new Date().toISOString() },
  { id: "cat-6", slug: "clothing", name_ar: "ملابس", default_unit: "piece", sort_order: 60, created_at: new Date().toISOString() },
  { id: "cat-7", slug: "baby", name_ar: "حليب وحفاضات أطفال", default_unit: "box", sort_order: 70, created_at: new Date().toISOString() },
  { id: "cat-8", slug: "hygiene", name_ar: "مواد نظافة وتعقيم", default_unit: "piece", sort_order: 80, created_at: new Date().toISOString() },
  { id: "cat-9", slug: "tools", name_ar: "أدوات ومعدات إطفاء", default_unit: "piece", sort_order: 90, created_at: new Date().toISOString() },
  { id: "cat-10", slug: "fuel", name_ar: "وقود وطاقة", default_unit: "liter", sort_order: 100, created_at: new Date().toISOString() },
];

const fallbackAffectedAreas: AffectedAreaRow[] = [
  // ولاية جيجل (14 منطقة)
  { id: "aa-1", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "جيجل", daira_fr: "Jijel", commune: "الجمعة بني حبيبي", commune_fr: "Djimla", spot: "قرية تيمزار", spot_fr: "Timizar", severity: "burning", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.825, lng: 5.766, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-2", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "جيجل", daira_fr: "Jijel", commune: "الجمعة بني حبيبي", commune_fr: "Djimla", spot: "أولاد عسكر", spot_fr: "Ouled Askar", severity: "evacuated", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.815, lng: 5.755, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-3", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "جيجل", daira_fr: "Jijel", commune: "الجمعة بني حبيبي", commune_fr: "Djimla", spot: "تيزي وزو السفلى", spot_fr: "Tizi", severity: "threatened", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.81, lng: 5.75, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-4", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "جيجل", daira_fr: "Jijel", commune: "الجمعة بني حبيبي", commune_fr: "Djimla", spot: "بني يدر", spot_fr: "Beni Yder", severity: "threatened", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.8, lng: 5.74, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-5", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "زيامة", daira_fr: "Ziama", commune: "زيامة منصورية", commune_fr: "Ziama Mansouriah", spot: "الخيارة", spot_fr: "Khiara", severity: "ravaged", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.67, lng: 5.48, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-6", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "زيامة", daira_fr: "Ziama", commune: "زيامة منصورية", commune_fr: "Ziama Mansouriah", spot: "تسمارت", spot_fr: "Tasmart", severity: "burning", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.68, lng: 5.49, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-7", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "زيامة", daira_fr: "Ziama", commune: "زيامة منصورية", commune_fr: "Ziama Mansouriah", spot: "قرية بولخماس", spot_fr: "Boulkhmas", severity: "threatened", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.69, lng: 5.5, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-8", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "زيامة", daira_fr: "Ziama", commune: "زيامة منصورية", commune_fr: "Ziama Mansouriah", spot: "واد الزهور غرب", spot_fr: "Oued Zhour", severity: "threatened", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.7, lng: 5.51, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-9", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "الشقفة", daira_fr: "Chekfa", commune: "الشقفة", commune_fr: "Chekfa", spot: "غابة بني فغلوش", spot_fr: "Beni Feghlouch", severity: "burning", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.77, lng: 5.95, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-10", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "الشقفة", daira_fr: "Chekfa", commune: "الشقفة", commune_fr: "Chekfa", spot: "قرية رجاص", spot_fr: "Redjas", severity: "threatened", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.78, lng: 5.96, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-11", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "الشقفة", daira_fr: "Chekfa", commune: "الشقفة", commune_fr: "Chekfa", spot: "أولاد بونار", spot_fr: "Ouled Bounar", severity: "threatened", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.79, lng: 5.97, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-12", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "الشقفة", daira_fr: "Chekfa", commune: "الشقفة", commune_fr: "Chekfa", spot: "وادي نيل", spot_fr: "Oued Nil", severity: "threatened", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.8, lng: 5.98, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-13", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "الميلية", daira_fr: "El Milia", commune: "الميلية", commune_fr: "El Milia", spot: "غابة بوعفرون", spot_fr: "Bouafroun", severity: "burning", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.745, lng: 6.265, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-14", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "الميلية", daira_fr: "El Milia", commune: "الميلية", commune_fr: "El Milia", spot: "أولاد عربي", spot_fr: "Ouled Arabi", severity: "threatened", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.75, lng: 6.27, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-15", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "الميلية", daira_fr: "El Milia", commune: "الميلية", commune_fr: "El Milia", spot: "تانفدور", spot_fr: "Tanfedour", severity: "evacuated", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.76, lng: 6.28, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-16", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "الميلية", daira_fr: "El Milia", commune: "الميلية", commune_fr: "El Milia", spot: "عين غراب", spot_fr: "Ain Ghrab", severity: "threatened", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.77, lng: 6.29, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-17", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "تاكسنة", daira_fr: "Texenna", commune: "تاكسنة", commune_fr: "Texenna", spot: "غابة تاكسنة المركز", spot_fr: "Texenna Centre", severity: "burning", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.65, lng: 5.78, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-18", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "تاكسنة", daira_fr: "Texenna", commune: "تاكسنة", commune_fr: "Texenna", spot: "قرية تامنتوت", spot_fr: "Tamentout", severity: "threatened", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.66, lng: 5.79, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-19", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "تاكسنة", daira_fr: "Texenna", commune: "تاكسنة", commune_fr: "Texenna", spot: "أولاد عمار", spot_fr: "Ouled Ammar", severity: "threatened", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.67, lng: 5.8, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-20", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "قاوس", daira_fr: "Kaous", commune: "قاوس", commune_fr: "Kaous", spot: "بني أحمد", spot_fr: "Beni Ahmed", severity: "burning", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.75, lng: 5.82, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-21", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "قاوس", daira_fr: "Kaous", commune: "قاوس", commune_fr: "Kaous", spot: "شعبة الديس", spot_fr: "Chaabet Diss", severity: "threatened", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.76, lng: 5.83, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-22", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "قاوس", daira_fr: "Kaous", commune: "قاوس", commune_fr: "Kaous", spot: "قرية الجناح", spot_fr: "Djenah", severity: "threatened", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.77, lng: 5.84, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-23", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "العنصر", daira_fr: "El Ancer", commune: "العنصر", commune_fr: "El Ancer", spot: "العرايب", spot_fr: "Laraib", severity: "burning", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.79, lng: 6.15, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-24", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "العنصر", daira_fr: "El Ancer", commune: "العنصر", commune_fr: "El Ancer", spot: "برج العنصر", spot_fr: "Bordj El Ancer", severity: "evacuated", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.8, lng: 6.16, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: "aa-25", campaign_id: "camp-01", wilaya: "جيجل", wilaya_fr: "Jijel", daira: "العنصر", daira_fr: "El Ancer", commune: "العنصر", commune_fr: "El Ancer", spot: "قرية المحارقة", spot_fr: "Maharga", severity: "threatened", source: "خلية الأزمة", notes: null, status_raw: null, lat: 36.81, lng: 6.17, created_by: null, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },

  // ولاية بجاية (17 منطقة)
  ...Array.from({ length: 17 }, (_, i) => ({
    id: `aa-bg-${i + 1}`,
    campaign_id: "camp-01",
    wilaya: "بجاية",
    wilaya_fr: "Béjaïa",
    daira: "بجاية",
    daira_fr: "Béjaïa",
    commune: i % 2 === 0 ? "تيشي" : "أوقاس",
    commune_fr: i % 2 === 0 ? "Tichy" : "Aokas",
    spot: `بؤرة رقم ${i + 1} - جبال البابور`,
    spot_fr: `Spot ${i + 1}`,
    severity: (i < 3 ? "burning" : i < 6 ? "evacuated" : "threatened") as AffectedAreaRow["severity"],
    source: "خلية الأزمة",
    notes: null,
    status_raw: null,
    lat: 36.75,
    lng: 5.06,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })),

  // ولاية سكيكدة (20 منطقة)
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `aa-sk-${i + 1}`,
    campaign_id: "camp-01",
    wilaya: "سكيكدة",
    wilaya_fr: "Skikda",
    daira: "القل",
    daira_fr: "Collo",
    commune: i % 2 === 0 ? "القل" : "تمالوس",
    commune_fr: i % 2 === 0 ? "Collo" : "Tamalous",
    spot: `بؤرة شبه جزيرة القل ${i + 1}`,
    spot_fr: `Collo Spot ${i + 1}`,
    severity: (i < 3 ? "burning" : i < 5 ? "ravaged" : "threatened") as AffectedAreaRow["severity"],
    source: "خلية الأزمة",
    notes: null,
    status_raw: null,
    lat: 36.87,
    lng: 6.9,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })),

  // ولاية ميلة (4 مناطق)
  ...Array.from({ length: 4 }, (_, i) => ({
    id: `aa-ml-${i + 1}`,
    campaign_id: "camp-01",
    wilaya: "ميلة",
    wilaya_fr: "Mila",
    daira: "فرجيوة",
    daira_fr: "Ferdjioua",
    commune: "فرجيوة",
    commune_fr: "Ferdjioua",
    spot: `مرتفعات فرجيوة ${i + 1}`,
    spot_fr: `Ferdjioua Spot ${i + 1}`,
    severity: (i === 0 ? "burning" : "threatened") as AffectedAreaRow["severity"],
    source: "خلية الأزمة",
    notes: null,
    status_raw: null,
    lat: 36.45,
    lng: 6.26,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })),
];

const fallbackMedicalVolunteers = [
  {
    id: "med-1",
    full_name: "د. أمين قواسمية",
    specialty: "طب استعجالي وطوارئ",
    wilaya_code: "18",
    commune_id: "جيجل",
    current_workplace: "مستشفى محمد الصديق بن يحيى",
    can_teleconsult: true,
    can_field_intervene: true,
    phone: "0550123456",
  },
  {
    id: "med-2",
    full_name: "د. سهام بولعراس",
    specialty: "طب أطفال وحروق",
    wilaya_code: "18",
    commune_id: "الطاهير",
    current_workplace: "عيادة خاصة",
    can_teleconsult: true,
    can_field_intervene: false,
    phone: "0661234567",
  },
  {
    id: "med-3",
    full_name: "د. كمال بوالريش",
    specialty: "طب بيطري ورعاية مواشي",
    wilaya_code: "18",
    commune_id: "العوانة",
    current_workplace: "مفتشية البيطرة",
    can_teleconsult: false,
    can_field_intervene: true,
    phone: "0770345678",
  },
];

export async function getActiveCampaign() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("slug", activeCampaignSlug)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<CategoryRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getCriticalNeeds(limit = 6) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("needs")
      .select("*, categories(slug, name_ar, default_unit)")
      .eq("status", "active")
      .order("updated_at", { ascending: false })
      .limit(50);

    const rows = data ?? [];
    const priorityRank: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
    return rows
      .sort((a, b) => priorityRank[a.priority] - priorityRank[b.priority])
      .slice(0, limit);
  } catch {
    return [];
  }
}

export async function getAllActiveNeeds() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("needs")
      .select("*, categories(slug, name_ar, default_unit)")
      .eq("status", "active")
      .order("updated_at", { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

const emptyStatOverview = {
  total_families: 0,
  families_awaiting: 0,
  areas_reached: 0,
  active_points: 0,
  critical_needs: 0,
  active_shipments: 0,
};

export async function getStatOverview() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_stat_overview").single();
    return data ?? emptyStatOverview;
  } catch {
    return emptyStatOverview;
  }
}

export async function getStatDonationsByCategory() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_stat_donations_by_category");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getStatDistributionsByCategory() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_stat_distributions_by_category");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPublicCollectionPoints() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_public_collection_points");
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPublicReliefHubs() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_public_relief_hubs");
    return data ?? [];
  } catch {
    return [];
  }
}

const fallbackOfficialUpdates = [
  {
    id: "off-1",
    title: "الحماية المدنية: السيطرة التامة على بؤرة غابة العوانة وإخماد ألسنة اللهب بنسبة 95%",
    body: "تعلن مصالح الحماية المدنية لولاية جيجل بالتعاون مع محافظة الغابات عن نجاح عمليات التدخل الجوي والأرتال المتنقلة في إخماد حريق غابة العوانة مع استمرار الحراسة الوقائية لمنع تجدد البؤر.",
    source: "مديرية الحماية المدنية لولاية جيجل",
    url: "https://www.facebook.com/DGPC0018",
    update_type: "fire_alert",
    published_at: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    campaign_id: "camp-01",
    created_at: new Date().toISOString(),
    created_by: null,
  },
  {
    id: "off-2",
    title: "الدرك الوطني (طريقي): إعادة فتح الطريق الوطني رقم 43 الرابط بين جيجل وبجاية أمام حركة القوافل والشاحنات",
    body: "تُعلم مصالح الدرك الوطني مستعملي الطريق بفتح المقطع بين زيامة منصورية والخيارة بعد الانتهاء من تأمين حواف الطريق وإزالة مخلفات الأشجار. يُرجى الالتزام بالسرعة القانونية وتسهيل مرور مركبات الإسعاف.",
    source: "طريقي - الدرك الوطني",
    url: "https://www.facebook.com/tariki.gendarmerie.algerie",
    update_type: "road_status",
    published_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    campaign_id: "camp-01",
    created_at: new Date().toISOString(),
    created_by: null,
  },
  {
    id: "off-3",
    title: "الديوان الوطني للأرصاد الجوية: نشرية خاصة تحذر من رياح قوية وانخفاض تدريجي في درجات الحرارة بالسواحل الشرقية",
    body: "نشرية جوية خاصة برياح شرقية إلى شمالية شرقية تتراوح سرعتها بين 40 و60 كم/سا على ولايات جيجل، بجاية، وسكيكدة مما يساعد في تبريد المناطق الجبلية ويسهل عمل فرق الإطفاء الأرضية.",
    source: "الديوان الوطني للأرصاد الجوية",
    url: "https://www.meteo.dz",
    update_type: "weather_warning",
    published_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    campaign_id: "camp-01",
    created_at: new Date().toISOString(),
    created_by: null,
  },
  {
    id: "off-4",
    title: "محافظة الغابات: تشديد دوريات المراقبة وتوجيه شاحنات الصهاريج نحو النقاط الحساسة في غابة بوعفرون بالميلية",
    body: "انتشار فرق الغابات بالتنسيق مع المتطوعين المعتمدين لتزويد نقاط التزويد بالماء وفتح المسالك الترابية أمام سيارات التدخل السريع التابعة لمراكز الإيواء.",
    source: "المديرية العامة للغابات",
    url: "https://www.facebook.com/forets.algerie",
    update_type: "safety_guidelines",
    published_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    campaign_id: "camp-01",
    created_at: new Date().toISOString(),
    created_by: null,
  },
];

export async function getOfficialUpdates(limit = 5) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("official_updates")
      .select("*")
      .order("published_at", { ascending: false })
      .limit(limit);
    return data && data.length > 0 ? data : fallbackOfficialUpdates.slice(0, limit);
  } catch {
    return fallbackOfficialUpdates.slice(0, limit);
  }
}

const fallbackShelters = [
  {
    id: "sh-1",
    name: "مركز التكوين المهني بوهراوة أحمد (CFPA)",
    address: "الشقفة مركز، محاذاة الطريق الرئيسي",
    commune: "الشقفة",
    wilaya: "جيجل",
    phone: "034 56 21 52",
    capacity_note: "مجهز لاستقبال العائلات · دورات مياه وأفرشة",
    is_shelter: true,
    status: "open",
  },
  {
    id: "sh-2",
    name: "دار الشباب الشهيد بوناب الرشيد",
    address: "حي الفرسان، بن شعبان",
    commune: "جيجل",
    wilaya: "جيجل",
    phone: "034 47 43 75",
    capacity_note: "استقبال وفرز القوافل الوطنية وتوجيهها",
    is_shelter: true,
    status: "open",
  },
  {
    id: "sh-3",
    name: "مركب الشباب الشهيد شاطر عبد القادر",
    address: "حي 1000 مسكن، جيجل",
    commune: "جيجل",
    wilaya: "جيجل",
    phone: "030 49 08 22",
    capacity_note: "مجمع شبابي مجهز للإيواء المؤقت والرعاية",
    is_shelter: true,
    status: "open",
  },
  {
    id: "sh-4",
    name: "مركز استقبال ومأوى تاكسنة",
    address: "بلدية تاكسنة مركز",
    commune: "تاكسنة",
    wilaya: "جيجل",
    phone: "034 49 10 20",
    capacity_note: "استقبال 65+ حالة وإسعاف الأسر المتضررة",
    is_shelter: true,
    status: "open",
  },
  {
    id: "sh-5",
    name: "مركز إيواء العرايب",
    address: "منطقة العرايب، طريق برج العنصر",
    commune: "العنصر",
    wilaya: "جيجل",
    phone: "034 52 11 22",
    capacity_note: "مخيم استقبال وإيواء للأسر المجلية من تنفدور",
    is_shelter: true,
    status: "open",
  },
];

export async function getShelters() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_public_relief_hubs");
    const filtered = (data ?? []).filter((h: any) => h.is_shelter && h.status === "open");
    return filtered && filtered.length > 0 ? filtered : fallbackShelters;
  } catch {
    return fallbackShelters;
  }
}

export async function getAffectedCommunes() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("needs")
      .select("commune, priority")
      .eq("status", "active");

    const map = new Map<string, { commune: string; total: number; critical: number }>();
    for (const n of data ?? []) {
      const row = map.get(n.commune) ?? { commune: n.commune, total: 0, critical: 0 };
      row.total += 1;
      if (n.priority === "critical" || n.priority === "high") row.critical += 1;
      map.set(n.commune, row);
    }
    return [...map.values()].sort((a, b) => b.critical - a.critical || b.total - a.total);
  } catch {
    return [];
  }
}

export async function getAffectedAreas(): Promise<AffectedAreaRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("affected_areas")
      .select("*")
      .order("wilaya")
      .order("daira")
      .order("commune");
    return (data && (data as AffectedAreaRow[]).length > 0 ? (data as AffectedAreaRow[]) : fallbackAffectedAreas);
  } catch {
    return fallbackAffectedAreas;
  }
}

export async function getPublishedPosts(limit = 50) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("id, slug, title, excerpt, published_at, author_name")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("is_published", true)
      .maybeSingle();
    return data;
  } catch {
    return null;
  }
}

export async function getPublicMedicalVolunteers() {
  try {
    const supabase = await createClient();
    const { data } = await (supabase as any).rpc("get_public_medical_volunteers");
    return data && data.length > 0 ? data : fallbackMedicalVolunteers;
  } catch {
    return fallbackMedicalVolunteers;
  }
}
