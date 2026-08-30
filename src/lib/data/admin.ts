import "server-only";
import { createClient } from "@/lib/supabase/server";
import { activeCampaignSlug } from "@/config/site";

export async function getAdminDashboardStats() {
  const supabase = await createClient();

  const [
    { count: totalFamilies },
    { count: familiesAwaiting },
    { count: donationsCount },
    { count: activeShipments },
    { count: openCollectionPoints },
    { count: openReliefHubs },
    { count: criticalNeeds },
  ] = await Promise.all([
    supabase.from("beneficiary_requests").select("*", { count: "exact", head: true }),
    supabase
      .from("beneficiary_requests")
      .select("*", { count: "exact", head: true })
      .not("status", "in", "(helped,closed,rejected)"),
    supabase.from("donations").select("*", { count: "exact", head: true }),
    supabase
      .from("transport_offers")
      .select("*", { count: "exact", head: true })
      .in("status", ["requested", "matched", "confirmed", "in_transit"]),
    supabase.from("collection_points").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("relief_hubs").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase
      .from("needs")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")
      .eq("priority", "critical"),
  ]);

  return {
    totalFamilies: totalFamilies ?? 0,
    familiesAwaiting: familiesAwaiting ?? 0,
    donationsCount: donationsCount ?? 0,
    activeShipments: activeShipments ?? 0,
    activePoints: (openCollectionPoints ?? 0) + (openReliefHubs ?? 0),
    criticalNeeds: criticalNeeds ?? 0,
  };
}

export async function getActiveCampaignId() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("campaigns")
    .select("id")
    .eq("slug", activeCampaignSlug)
    .maybeSingle();
  return data?.id ?? null;
}

export async function getRecentActivity(limit = 10) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("activity_logs")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getAllCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return data ?? [];
}

export async function getAllReliefHubs() {
  const supabase = await createClient();
  const { data } = await supabase.from("relief_hubs").select("*").order("name");
  return data ?? [];
}

export async function getAllCollectionPoints() {
  const supabase = await createClient();
  const { data } = await supabase.from("collection_points").select("*").order("name");
  return data ?? [];
}

/**
 * عدد الاحتياجات النشطة موزّعة حسب الأولوية — لرسم بياني بالألوان الدلالية
 * الموحّدة نفسها المستخدمة في PriorityBadge عبر المنصة (لا ألوان جديدة).
 */
export async function getNeedsByPriority() {
  const supabase = await createClient();
  const { data } = await supabase.from("needs").select("priority").eq("status", "active");

  const counts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const row of data ?? []) {
    counts[row.priority] = (counts[row.priority] ?? 0) + 1;
  }
  return counts;
}

/**
 * سجل يومي (آخر N يومًا) لعدد الاحتياجات المسجَّلة مقابل المساعدات المسجَّلة —
 * تجميع في الذاكرة (لا RPC) لأن حجم البيانات الحالي صغير، بنفس منطق باقي
 * صفحات الإدارة التي تجلب كل السجلات دون Pagination.
 */
export async function getActivityTrend(days = 14) {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const [{ data: needs }, { data: donations }] = await Promise.all([
    supabase.from("needs").select("created_at").gte("created_at", since.toISOString()),
    supabase.from("donations").select("created_at").gte("created_at", since.toISOString()),
  ]);

  const buckets = new Map<string, { needs: number; donations: number }>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), { needs: 0, donations: 0 });
  }

  for (const row of needs ?? []) {
    const key = row.created_at.slice(0, 10);
    const bucket = buckets.get(key);
    if (bucket) bucket.needs += 1;
  }
  for (const row of donations ?? []) {
    const key = row.created_at.slice(0, 10);
    const bucket = buckets.get(key);
    if (bucket) bucket.donations += 1;
  }

  return [...buckets.entries()].map(([date, v]) => ({ date, ...v }));
}

/** فرق نسبة مئوية بين قيمتين، مع التعامل مع حالة الصفر السابق دون قسمة على صفر. */
function pctDelta(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

/**
 * وتيرة التسجيل الأسبوعية (هذا الأسبوع مقابل الأسبوع الماضي) للمساعدات
 * والاحتياجات — تُستخدم كسهم اتجاه (▲/▼) بجانب بطاقات KPI الرئيسية.
 */
export async function getWeekOverWeekDelta() {
  const supabase = await createClient();
  const now = new Date();
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const [
    { count: donationsThisWeek },
    { count: donationsLastWeek },
    { count: needsThisWeek },
    { count: needsLastWeek },
  ] = await Promise.all([
    supabase
      .from("donations")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString()),
    supabase
      .from("donations")
      .select("*", { count: "exact", head: true })
      .gte("created_at", twoWeeksAgo.toISOString())
      .lt("created_at", weekAgo.toISOString()),
    supabase
      .from("needs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString()),
    supabase
      .from("needs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", twoWeeksAgo.toISOString())
      .lt("created_at", weekAgo.toISOString()),
  ]);

  return {
    donationsDeltaPct: pctDelta(donationsThisWeek ?? 0, donationsLastWeek ?? 0),
    needsDeltaPct: pctDelta(needsThisWeek ?? 0, needsLastWeek ?? 0),
  };
}

/**
 * عدّادات "قيد الانتظار" لكل قسم — تُعرض كشارات حيّة في القائمة الجانبية.
 * استعلامات count فقط (head: true) لتبقى خفيفة.
 */
export async function getPendingCounts() {
  const supabase = await createClient();
  const [
    { count: pendingVerification },
    { count: pendingDamageAssessments },
    { count: pendingArtisans },
    { count: pendingMedical },
  ] = await Promise.all([
    supabase
      .from("beneficiary_requests")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "under_review"]),
    supabase
      .from("damage_assessments")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("artisan_volunteers")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("medical_volunteers")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);

  return {
    "/admin/verification": pendingVerification ?? 0,
    "/admin/damage-assessments": pendingDamageAssessments ?? 0,
    "/admin/artisans": pendingArtisans ?? 0,
    "/admin/medical": pendingMedical ?? 0,
  } as Record<string, number>;
}
