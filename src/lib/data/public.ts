import "server-only";
import { createClient } from "@/lib/supabase/server";
import { activeCampaignSlug } from "@/config/site";

export async function getActiveCampaign() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("campaigns")
    .select("*")
    .eq("slug", activeCampaignSlug)
    .maybeSingle();
  return data;
}

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("sort_order");
  return data ?? [];
}

export async function getCriticalNeeds(limit = 6) {
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
}

export async function getAllActiveNeeds() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("needs")
    .select("*, categories(slug, name_ar, default_unit)")
    .eq("status", "active")
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function getStatOverview() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_stat_overview").single();
  return (
    data ?? {
      total_families: 0,
      families_awaiting: 0,
      areas_reached: 0,
      active_points: 0,
      critical_needs: 0,
      active_shipments: 0,
    }
  );
}

export async function getStatDonationsByCategory() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_stat_donations_by_category");
  return data ?? [];
}

export async function getStatDistributionsByCategory() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_stat_distributions_by_category");
  return data ?? [];
}

export async function getPublicCollectionPoints() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_public_collection_points");
  return data ?? [];
}

export async function getPublicReliefHubs() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_public_relief_hubs");
  return data ?? [];
}

export async function getOfficialUpdates(limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("official_updates")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getShelters() {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_public_relief_hubs");
  return (data ?? []).filter((h) => h.is_shelter && h.status === "open");
}

/** البلديات التي لديها احتياجات نشطة، مرتبة حسب عدد الاحتياجات الحرجة. */
export async function getAffectedCommunes() {
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
}

export async function getAffectedAreas() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("affected_areas")
    .select("*")
    .order("wilaya")
    .order("daira")
    .order("commune");
  return data ?? [];
}
