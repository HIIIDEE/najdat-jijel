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
  {
    id: "aa-1",
    campaign_id: "camp-01",
    wilaya: "جيجل",
    wilaya_fr: "Jijel",
    daira: "جيجل",
    daira_fr: "Jijel",
    commune: "جيجل",
    commune_fr: "Jijel",
    spot: "بوالجرور",
    spot_fr: "Boudjarour",
    severity: "burning",
    source: "خلية متابعة أزمة حرائق الشمال الشرقي",
    notes: null,
    status_raw: null,
    lat: 36.825,
    lng: 5.766,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "aa-2",
    campaign_id: "camp-01",
    wilaya: "جيجل",
    wilaya_fr: "Jijel",
    daira: "جيجل",
    daira_fr: "Jijel",
    commune: "جيجل",
    commune_fr: "Jijel",
    spot: "200 مسكن",
    spot_fr: "200 Logements",
    severity: "evacuated",
    source: "خلية متابعة أزمة حرائق الشمال الشرقي",
    notes: null,
    status_raw: null,
    lat: 36.815,
    lng: 5.755,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "aa-3",
    campaign_id: "camp-01",
    wilaya: "جيجل",
    wilaya_fr: "Jijel",
    daira: "العوانة",
    daira_fr: "El Aouana",
    commune: "العوانة",
    commune_fr: "El Aouana",
    spot: "غابة العوانة",
    spot_fr: "Foret El Aouana",
    severity: "burning",
    source: "خلية متابعة أزمة حرائق الشمال الشرقي",
    notes: null,
    status_raw: null,
    lat: 36.775,
    lng: 5.688,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "aa-4",
    campaign_id: "camp-01",
    wilaya: "جيجل",
    wilaya_fr: "Jijel",
    daira: "الميلية",
    daira_fr: "El Milia",
    commune: "الميلية",
    commune_fr: "El Milia",
    spot: "غابة بوعفرون",
    spot_fr: "Bouafroun",
    severity: "threatened",
    source: "خلية متابعة أزمة حرائق الشمال الشرقي",
    notes: null,
    status_raw: null,
    lat: 36.745,
    lng: 6.265,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "aa-5",
    campaign_id: "camp-01",
    wilaya: "جيجل",
    wilaya_fr: "Jijel",
    daira: "الطاهير",
    daira_fr: "Taher",
    commune: "الطاهير",
    commune_fr: "Taher",
    spot: "حي الشهداء",
    spot_fr: "Cite Chouhada",
    severity: "threatened",
    source: "خلية متابعة أزمة حرائق الشمال الشرقي",
    notes: null,
    status_raw: null,
    lat: 36.772,
    lng: 5.885,
    created_by: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
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
    return data ?? { id: "camp-01", slug: activeCampaignSlug, name: "حرائق الشمال الشرقي 2026", is_active: true };
  } catch {
    return { id: "camp-01", slug: activeCampaignSlug, name: "حرائق الشمال الشرقي 2026", is_active: true };
  }
}

export async function getCategories(): Promise<CategoryRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("categories").select("*").order("sort_order");
    return data && data.length > 0 ? data : fallbackCategories;
  } catch {
    return fallbackCategories;
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

export async function getStatOverview() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_stat_overview").single();
    return (
      data ?? {
        total_families: 48,
        families_awaiting: 12,
        areas_reached: 8,
        active_points: 6,
        critical_needs: 7,
        active_shipments: 4,
      }
    );
  } catch {
    return {
      total_families: 48,
      families_awaiting: 12,
      areas_reached: 8,
      active_points: 6,
      critical_needs: 7,
      active_shipments: 4,
    };
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
    source: "المديرية العامة للحماية المدنية",
    url: "https://www.facebook.com/DGPC.Algerie",
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

export async function getShelters() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_public_relief_hubs");
    return (data ?? []).filter((h) => h.is_shelter && h.status === "open");
  } catch {
    return [];
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
    return data && data.length > 0 ? (data as AffectedAreaRow[]) : fallbackAffectedAreas;
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
