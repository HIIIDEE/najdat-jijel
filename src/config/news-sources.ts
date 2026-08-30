export interface OfficialSourceConfig {
  id: string;
  name: string;
  authority: "protection_civile" | "gendarmerie" | "police" | "forets" | "wilaya" | "aps";
  badgeNameAr: string;
  avatarColor: string;
  feedUrl?: string;
  sourceUrl: string;
  scrapeSelector?: string;
  enabled: boolean;
}

export interface IngestedNewsItem {
  id?: string;
  title: string;
  body?: string | null;
  source: string;
  authority?: OfficialSourceConfig["authority"];
  url?: string | null;
  update_type?: "fire_alert" | "road_status" | "weather_warning" | "safety_guidelines" | "statement" | "news";
  wilaya?: string;
  is_urgent?: boolean;
  published_at: string;
  external_id?: string;
}

export const OFFICIAL_ALGERIAN_SOURCES: OfficialSourceConfig[] = [
  {
    id: "dgpc_jijel",
    name: "مديرية الحماية المدنية لولاية جيجل",
    authority: "protection_civile",
    badgeNameAr: "الحماية المدنية - جيجل",
    avatarColor: "bg-red-500/15 text-red-600 border-red-500/30",
    sourceUrl: "https://www.facebook.com/DGPC0018",
    enabled: true,
  },
  {
    id: "dgpc_national",
    name: "المديرية العامة للحماية المدنية",
    authority: "protection_civile",
    badgeNameAr: "الحماية المدنية (الوطنية)",
    avatarColor: "bg-red-500/15 text-red-600 border-red-500/30",
    sourceUrl: "https://www.facebook.com/DGPC.Algerie",
    enabled: true,
  },
  {
    id: "tariki",
    name: "طريقي - مركز الإعلام وتنسيق المرور للدرك الوطني",
    authority: "gendarmerie",
    badgeNameAr: "الدرك الوطني / طريقي",
    avatarColor: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
    sourceUrl: "https://www.facebook.com/tariki.gendarmerie.algerie",
    enabled: true,
  },
  {
    id: "dgf",
    name: "المديرية العامة للغابات",
    authority: "forets",
    badgeNameAr: "محافظة الغابات",
    avatarColor: "bg-green-600/15 text-green-700 border-green-600/30",
    sourceUrl: "https://www.facebook.com/forets.algerie",
    enabled: true,
  },
  {
    id: "dgsn",
    name: "المديرية العامة للأمن الوطني",
    authority: "police",
    badgeNameAr: "الأمن الوطني",
    avatarColor: "bg-blue-600/15 text-blue-700 border-blue-600/30",
    sourceUrl: "https://www.facebook.com/algeriepolice.dz",
    enabled: true,
  },
  {
    id: "wilaya_jijel",
    name: "خلية الأزمة ومتابعة الطوارئ - ولاية جيجل",
    authority: "wilaya",
    badgeNameAr: "خلية الأزمة - جيجل",
    avatarColor: "bg-amber-500/15 text-amber-700 border-amber-500/30",
    sourceUrl: "https://www.facebook.com/WilayadeJijel",
    enabled: true,
  },
];

/**
 * Heuristic classifier for news content based on keywords
 */
export function classifyNewsItem(text: string): {
  update_type: IngestedNewsItem["update_type"];
  wilaya?: string;
  is_urgent: boolean;
} {
  const normalized = text.toLowerCase();

  // 1. Detect Urgency
  const is_urgent =
    normalized.includes("عاجل") ||
    normalized.includes("إنذار") ||
    normalized.includes("تحذير عالي") ||
    normalized.includes("إخلاء فوري") ||
    normalized.includes("طريق مقطوع") ||
    normalized.includes("غلق تام");

  // 2. Detect Wilaya
  let wilaya: string | undefined = undefined;
  if (normalized.includes("جيجل") || normalized.includes("العوانة") || normalized.includes("زيامة") || normalized.includes("الميلية") || normalized.includes("الطاهير")) {
    wilaya = "جيجل";
  } else if (normalized.includes("بجاية") || normalized.includes("تيشي") || normalized.includes("أوقاس") || normalized.includes("خراطة")) {
    wilaya = "بجاية";
  } else if (normalized.includes("سكيكدة") || normalized.includes("القل") || normalized.includes("تمالوس")) {
    wilaya = "سكيكدة";
  } else if (normalized.includes("ميلة") || normalized.includes("فرجيوة") || normalized.includes("شلغوم العيد")) {
    wilaya = "ميلة";
  }

  // 3. Detect Category Type
  let update_type: IngestedNewsItem["update_type"] = "statement";
  if (
    normalized.includes("طريق") ||
    normalized.includes("مرور") ||
    normalized.includes("مسلك") ||
    normalized.includes("شاحنات") ||
    normalized.includes("حركة السير")
  ) {
    update_type = "road_status";
  } else if (
    normalized.includes("حريق") ||
    normalized.includes("بؤرة") ||
    normalized.includes("إخماد") ||
    normalized.includes("إطفاء") ||
    normalized.includes("رتل متحرك") ||
    normalized.includes("طائرة إطفاء")
  ) {
    update_type = "fire_alert";
  } else if (
    normalized.includes("نشرية") ||
    normalized.includes("أرصاد") ||
    normalized.includes("رياح") ||
    normalized.includes("سيروكو") ||
    normalized.includes("حرارة") ||
    normalized.includes("طقس")
  ) {
    update_type = "weather_warning";
  } else if (
    normalized.includes("توجيهات") ||
    normalized.includes("إرشادات") ||
    normalized.includes("سلامة") ||
    normalized.includes("وقاية")
  ) {
    update_type = "safety_guidelines";
  }

  return { update_type, wilaya, is_urgent };
}
