"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import { activeCampaignSlug } from "@/config/site";

export interface CreateOfficialUpdateInput {
  title: string;
  body?: string;
  source: string;
  url?: string;
  update_type: string;
}

export async function createOfficialUpdate(input: CreateOfficialUpdateInput) {
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
    .from("official_updates")
    .insert({
      campaign_id: campaign.id,
      title: input.title,
      body: input.body || null,
      source: input.source,
      url: input.url || null,
      update_type: input.update_type,
      published_at: new Date().toISOString(),
      created_by: user?.id || null,
    })
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  await logActivity(supabase, {
    actorId: user?.id,
    action: `نشر بيانًا رسميًا موثقًا: ${input.title}`,
    entityType: "official_update",
    entityId: data.id,
  });

  revalidatePath("/admin/news");
  revalidatePath("/official-information");
  revalidatePath("/");
  return { success: true };
}

export async function deleteOfficialUpdate(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("official_updates").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  await logActivity(supabase, {
    actorId: user?.id,
    action: `حذف بيانًا رسميًا`,
    entityType: "official_update",
    entityId: id,
  });

  revalidatePath("/admin/news");
  revalidatePath("/official-information");
  revalidatePath("/");
  return { success: true };
}
