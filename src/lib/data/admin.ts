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
