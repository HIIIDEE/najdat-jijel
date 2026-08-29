"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import { activeCampaignSlug } from "@/config/site";

const schema = z.object({
  message: z.string().trim().min(3, "نص الرسالة مطلوب").max(300, "الرسالة طويلة جدًا"),
  sort_order: z.number().int().min(0).default(0),
});

export async function createAnnouncement(input: z.infer<typeof schema>) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: campaign } = await supabase
    .from("campaigns").select("id").eq("slug", activeCampaignSlug).maybeSingle();

  const { error } = await supabase.from("announcements").insert({
    campaign_id: campaign?.id ?? null,
    message: parsed.data.message,
    sort_order: parsed.data.sort_order,
    created_by: user?.id,
  });
  if (error) return { success: false, error: "تعذر إضافة الرسالة." };

  await logActivity(supabase, {
    actorId: user?.id,
    action: "أضاف رسالة إلى شريط الأخبار",
    entityType: "announcement",
  });

  revalidatePath("/admin/announcements");
  revalidatePath("/");
  return { success: true };
}

export async function toggleAnnouncement(id: string, isActive: boolean) {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").update({ is_active: isActive }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/announcements");
  revalidatePath("/");
  return { success: true };
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("announcements").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/announcements");
  revalidatePath("/");
  return { success: true };
}
