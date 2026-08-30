import "server-only";
import { createClient } from "@/lib/supabase/server";
import { activeCampaignSlug } from "@/config/site";
import { query, type DataResult } from "@/lib/data/query";
import type { Database } from "@/types/database";

type AffectedAreaRow = Database["public"]["Tables"]["affected_areas"]["Row"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
type CampaignRow = Database["public"]["Tables"]["campaigns"]["Row"];
type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type CollectionPointRow =
  Database["public"]["Functions"]["get_public_collection_points"]["Returns"][number];
type ReliefHubRow = Database["public"]["Functions"]["get_public_relief_hubs"]["Returns"][number];
type ActiveNeedRow = NonNullable<Awaited<ReturnType<typeof activeNeedsQuery>>["data"]>[number];

export async function getActiveCampaign() {
  const { data } = await query<CampaignRow | null>(
    "getActiveCampaign",
    (sb) => sb.from("campaigns").select("*").eq("slug", activeCampaignSlug).maybeSingle(),
    null,
  );
  return data;
}

export async function getCategories(): Promise<CategoryRow[]> {
  const { data } = await query(
    "getCategories",
    (sb) => sb.from("categories").select("*").order("sort_order"),
    [] as CategoryRow[],
  );
  return data;
}

// نوع `priority_level` معرَّف بالترتيب 'critical','high','medium','low'، وPostgres
// يرتّب قيم enum حسب ترتيب التعريف لا حسب الأبجدية — فالفرز بالأولوية يتم في
// قاعدة البيانات مباشرة، قبل أي `limit`، لا في الذاكرة بعده.
function activeNeedsQuery(supabase: Awaited<ReturnType<typeof createClient>>) {
  return supabase
    .from("needs")
    .select("*, categories(slug, name_ar, default_unit)")
    .eq("status", "active")
    .order("priority", { ascending: true })
    .order("updated_at", { ascending: false });
}

export async function getCriticalNeeds(limit = 6): Promise<ActiveNeedRow[]> {
  const { data } = await query(
    "getCriticalNeeds",
    (sb) => activeNeedsQuery(sb).limit(limit),
    [] as ActiveNeedRow[],
  );
  return data;
}

export async function getAllActiveNeeds(): Promise<DataResult<ActiveNeedRow[]>> {
  return query("getAllActiveNeeds", activeNeedsQuery, [] as ActiveNeedRow[]);
}

const emptyStatOverview = {
  total_families: 0,
  families_awaiting: 0,
  areas_reached: 0,
  active_points: 0,
  critical_needs: 0,
  active_shipments: 0,
};

export async function getStatOverview(): Promise<DataResult<typeof emptyStatOverview>> {
  return query("getStatOverview", (sb) => sb.rpc("get_stat_overview").single(), emptyStatOverview);
}

export async function getStatDonationsByCategory() {
  const { data } = await query(
    "getStatDonationsByCategory",
    (sb) => sb.rpc("get_stat_donations_by_category"),
    [],
  );
  return data;
}

export async function getStatDistributionsByCategory() {
  const { data } = await query(
    "getStatDistributionsByCategory",
    (sb) => sb.rpc("get_stat_distributions_by_category"),
    [],
  );
  return data;
}

export async function getPublicCollectionPoints(): Promise<DataResult<CollectionPointRow[]>> {
  return query(
    "getPublicCollectionPoints",
    (sb) => sb.rpc("get_public_collection_points"),
    [] as CollectionPointRow[],
  );
}

export async function getPublicReliefHubs(): Promise<DataResult<ReliefHubRow[]>> {
  return query("getPublicReliefHubs", (sb) => sb.rpc("get_public_relief_hubs"), [] as ReliefHubRow[]);
}

export async function getOfficialUpdates(limit = 5) {
  const { data } = await query(
    "getOfficialUpdates",
    (sb) =>
      sb
        .from("official_updates")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(limit),
    [],
  );
  return data;
}

export async function getShelters(): Promise<DataResult<ReliefHubRow[]>> {
  const result = await query(
    "getShelters",
    (sb) => sb.rpc("get_public_relief_hubs"),
    [] as ReliefHubRow[],
  );
  return {
    ...result,
    data: result.data.filter((h) => h.is_shelter && h.status === "open"),
  };
}

export async function getAffectedCommunes() {
  const { data } = await query(
    "getAffectedCommunes",
    (sb) => sb.from("needs").select("commune, priority").eq("status", "active"),
    [] as { commune: string; priority: string }[],
  );

  const map = new Map<string, { commune: string; total: number; critical: number }>();
  for (const n of data) {
    const row = map.get(n.commune) ?? { commune: n.commune, total: 0, critical: 0 };
    row.total += 1;
    if (n.priority === "critical" || n.priority === "high") row.critical += 1;
    map.set(n.commune, row);
  }
  return [...map.values()].sort((a, b) => b.critical - a.critical || b.total - a.total);
}

export async function getAffectedAreas(): Promise<AffectedAreaRow[]> {
  const { data } = await query(
    "getAffectedAreas",
    (sb) => sb.from("affected_areas").select("*").order("wilaya").order("daira").order("commune"),
    [] as AffectedAreaRow[],
  );
  return data;
}

export async function getPublishedPosts(limit = 50) {
  const { data } = await query(
    "getPublishedPosts",
    (sb) =>
      sb
        .from("posts")
        .select("id, slug, title, excerpt, published_at, author_name")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(limit),
    [],
  );
  return data;
}

export async function getPostBySlug(slug: string) {
  const { data } = await query<PostRow | null>(
    "getPostBySlug",
    (sb) => sb.from("posts").select("*").eq("slug", slug).eq("is_published", true).maybeSingle(),
    null,
  );
  return data;
}

export async function getPublicMedicalVolunteers() {
  const { data } = await query(
    "getPublicMedicalVolunteers",
    (sb) => sb.rpc("get_public_medical_volunteers"),
    [],
  );
  return data;
}
