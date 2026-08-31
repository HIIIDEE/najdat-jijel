"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import { activeCampaignSlug } from "@/config/site";
import type { AffectedSeverity } from "@/lib/constants";

export interface CreateAffectedAreaInput {
  wilaya: string;
  wilaya_fr?: string;
  daira: string;
  daira_fr?: string;
  commune: string;
  commune_fr?: string;
  spot: string;
  spot_fr?: string;
  severity: AffectedSeverity;
  notes?: string;
  source?: string;
}

export async function createAffectedArea(input: CreateAffectedAreaInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id")
    .eq("slug", activeCampaignSlug)
    .maybeSingle();

  if (!campaign) return { success: false, error: "الحملة غير موجودة" };

  const { data, error } = await supabase
    .from("affected_areas")
    .insert({
      campaign_id: campaign.id,
      wilaya: input.wilaya,
      wilaya_fr: input.wilaya_fr || null,
      daira: input.daira,
      daira_fr: input.daira_fr || null,
      commune: input.commune,
      commune_fr: input.commune_fr || null,
      spot: input.spot,
      spot_fr: input.spot_fr || null,
      severity: input.severity,
      notes: input.notes || null,
      source: input.source || "إدارة المنصة",
      created_by: user?.id || null,
    })
    .select()
    .single();

  if (error) {
    // رسالة Postgres تكشف أسماء الجداول والقيود: تبقى في السجلّ لا عند العميل.
    console.error("[action] createAffectedArea:", error);
    return { success: false, error: "تعذّر تنفيذ العملية. حاول مرة أخرى." };
  }

  await logActivity(supabase, {
    actorId: user?.id,
    action: `أضاف بؤرة متضررة جديدة: ${input.spot} (${input.commune}، ${input.wilaya})`,
    entityType: "affected_area",
    entityId: data.id,
  });

  revalidatePath("/admin/affected-areas");
  revalidatePath("/affected-areas");
  revalidatePath("/");
  return { success: true };
}

export async function deleteAffectedArea(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("affected_areas").delete().eq("id", id);
  if (error) {
    // رسالة Postgres تكشف أسماء الجداول والقيود: تبقى في السجلّ لا عند العميل.
    console.error("[action] deleteAffectedArea:", error);
    return { success: false, error: "تعذّر تنفيذ العملية. حاول مرة أخرى." };
  }

  await logActivity(supabase, {
    actorId: user?.id,
    action: `حذف منطقة متضررة`,
    entityType: "affected_area",
    entityId: id,
  });

  revalidatePath("/admin/affected-areas");
  revalidatePath("/affected-areas");
  revalidatePath("/");
  return { success: true };
}

export async function updateAreaSeverity(id: string, severity: AffectedSeverity) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("affected_areas").update({ severity }).eq("id", id);
  if (error) {
    // رسالة Postgres تكشف أسماء الجداول والقيود: تبقى في السجلّ لا عند العميل.
    console.error("[action] updateAreaSeverity:", error);
    return { success: false, error: "تعذّر تنفيذ العملية. حاول مرة أخرى." };
  }

  await logActivity(supabase, {
    actorId: user?.id,
    action: `غيّر حالة منطقة متضررة إلى ${severity}`,
    entityType: "affected_area",
    entityId: id,
  });

  revalidatePath("/admin/affected-areas");
  revalidatePath("/affected-areas");
  revalidatePath("/");
  return { success: true };
}
