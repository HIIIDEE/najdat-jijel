"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import { activeCampaignSlug } from "@/config/site";

const pointSchema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب"),
  wilaya: z.string().trim().min(1, "الولاية مطلوبة"),
  commune: z.string().trim().min(1, "البلدية مطلوبة"),
  address: z.string().trim().max(300).optional().or(z.literal("")),
  lat: z.number().optional(),
  lng: z.number().optional(),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  show_phone_publicly: z.boolean(),
  contact_name: z.string().trim().max(100).optional().or(z.literal("")),
  opening_hours: z.string().trim().max(200).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

const collectionPointSchema = pointSchema.extend({
  accepted_categories: z.array(z.string()),
});

export type CollectionPointInput = z.infer<typeof collectionPointSchema>;

export async function createCollectionPoint(input: CollectionPointInput) {
  const parsed = collectionPointSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "بيانات غير صحيحة." };
  const data = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id")
    .eq("slug", activeCampaignSlug)
    .maybeSingle();
  if (!campaign) return { success: false, error: "تعذر تحديد الحملة النشطة." };

  const { error } = await supabase.from("collection_points").insert({
    campaign_id: campaign.id,
    name: data.name,
    wilaya: data.wilaya,
    commune: data.commune,
    address: data.address || null,
    lat: data.lat,
    lng: data.lng,
    phone: data.phone || null,
    show_phone_publicly: data.show_phone_publicly,
    contact_name: data.contact_name || null,
    accepted_categories: data.accepted_categories,
    opening_hours: data.opening_hours || null,
    notes: data.notes || null,
    created_by: user?.id,
  });

  if (error) return { success: false, error: "حدث خطأ أثناء إضافة نقطة التجميع." };

  await logActivity(supabase, {
    actorId: user?.id,
    action: `أضاف نقطة تجميع جديدة: ${data.name}`,
    entityType: "collection_point",
  });

  revalidatePath("/admin/collection-points");
  revalidatePath("/map");
  return { success: true };
}

export async function updateCollectionPointStatus(
  id: string,
  status: "open" | "full" | "paused" | "closed",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("collection_points").update({ status }).eq("id", id);
  if (error) {
    // رسالة Postgres تكشف أسماء الجداول والقيود: تبقى في السجلّ لا عند العميل.
    console.error("[action] updateCollectionPointStatus:", error);
    return { success: false, error: "تعذّر تنفيذ العملية. حاول مرة أخرى." };
  }

  await logActivity(supabase, {
    actorId: user?.id,
    action: `غيّر حالة نقطة تجميع إلى ${status}`,
    entityType: "collection_point",
    entityId: id,
  });

  revalidatePath("/admin/collection-points");
  revalidatePath("/map");
  return { success: true };
}

export async function updateCollectionPointVerification(
  id: string,
  level: "unverified" | "pending" | "verified" | "field_verified",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("collection_points")
    .update({ verification_level: level, verified_by: user?.id, verified_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    // رسالة Postgres تكشف أسماء الجداول والقيود: تبقى في السجلّ لا عند العميل.
    console.error("[action] updateCollectionPointVerification:", error);
    return { success: false, error: "تعذّر تنفيذ العملية. حاول مرة أخرى." };
  }

  await supabase.from("verification_records").insert({
    entity_type: "collection_point",
    entity_id: id,
    level,
    verified_by: user?.id,
  });

  revalidatePath("/admin/collection-points");
  revalidatePath("/map");
  return { success: true };
}

const reliefHubSchema = pointSchema.extend({
  is_shelter: z.boolean(),
});
export type ReliefHubInput = z.infer<typeof reliefHubSchema>;

export async function createReliefHub(input: ReliefHubInput) {
  const parsed = reliefHubSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "بيانات غير صحيحة." };
  const data = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id")
    .eq("slug", activeCampaignSlug)
    .maybeSingle();
  if (!campaign) return { success: false, error: "تعذر تحديد الحملة النشطة." };

  const { error } = await supabase.from("relief_hubs").insert({
    campaign_id: campaign.id,
    name: data.name,
    wilaya: data.wilaya,
    commune: data.commune,
    address: data.address || null,
    lat: data.lat,
    lng: data.lng,
    phone: data.phone || null,
    show_phone_publicly: data.show_phone_publicly,
    contact_name: data.contact_name || null,
    opening_hours: data.opening_hours || null,
    is_shelter: data.is_shelter,
    notes: data.notes || null,
    created_by: user?.id,
  });

  if (error) return { success: false, error: "حدث خطأ أثناء إضافة مركز الاستقبال." };

  await logActivity(supabase, {
    actorId: user?.id,
    action: `أضاف مركز استقبال جديدًا: ${data.name}`,
    entityType: "relief_hub",
  });

  revalidatePath("/admin/relief-hubs");
  revalidatePath("/admin/inventory");
  revalidatePath("/map");
  return { success: true };
}

export async function updateReliefHubStatus(
  id: string,
  status: "open" | "full" | "paused" | "closed",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("relief_hubs").update({ status }).eq("id", id);
  if (error) {
    // رسالة Postgres تكشف أسماء الجداول والقيود: تبقى في السجلّ لا عند العميل.
    console.error("[action] updateReliefHubStatus:", error);
    return { success: false, error: "تعذّر تنفيذ العملية. حاول مرة أخرى." };
  }

  await logActivity(supabase, {
    actorId: user?.id,
    action: `غيّر حالة مركز استقبال إلى ${status}`,
    entityType: "relief_hub",
    entityId: id,
  });

  revalidatePath("/admin/relief-hubs");
  revalidatePath("/map");
  return { success: true };
}

export async function updateReliefHubVerification(
  id: string,
  level: "unverified" | "pending" | "verified" | "field_verified",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("relief_hubs")
    .update({ verification_level: level, verified_by: user?.id, verified_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    // رسالة Postgres تكشف أسماء الجداول والقيود: تبقى في السجلّ لا عند العميل.
    console.error("[action] updateReliefHubVerification:", error);
    return { success: false, error: "تعذّر تنفيذ العملية. حاول مرة أخرى." };
  }

  await supabase.from("verification_records").insert({
    entity_type: "relief_hub",
    entity_id: id,
    level,
    verified_by: user?.id,
  });

  revalidatePath("/admin/relief-hubs");
  revalidatePath("/map");
  return { success: true };
}
