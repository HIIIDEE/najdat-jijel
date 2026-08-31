"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import { activeCampaignSlug } from "@/config/site";

const createNeedSchema = z.object({
  category_id: z.string().uuid(),
  wilaya: z.string().trim().min(1),
  commune: z.string().trim().min(1),
  title: z.string().trim().max(200).optional().or(z.literal("")),
  quantity_needed: z.number().positive(),
  quantity_available: z.number().min(0),
  unit: z.enum(["piece", "box", "portion", "carton", "liter", "kg", "ton", "bundle", "person"]),
  priority: z.enum(["critical", "high", "medium", "low"]),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type CreateNeedInput = z.infer<typeof createNeedSchema>;

export async function createNeed(input: CreateNeedInput) {
  const parsed = createNeedSchema.safeParse(input);
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

  const { error } = await supabase.from("needs").insert({
    campaign_id: campaign.id,
    category_id: data.category_id,
    wilaya: data.wilaya,
    commune: data.commune,
    title: data.title || null,
    quantity_needed: data.quantity_needed,
    quantity_available: data.quantity_available,
    unit: data.unit,
    priority: data.priority,
    notes: data.notes || null,
    source_type: "field_team",
    created_by: user?.id,
  });

  if (error) return { success: false, error: "حدث خطأ أثناء إضافة الاحتياج." };

  await logActivity(supabase, {
    actorId: user?.id,
    action: `أضاف احتياجًا جديدًا (${data.commune})`,
    entityType: "need",
  });

  revalidatePath("/admin/needs");
  revalidatePath("/needs");
  revalidatePath("/");
  return { success: true };
}

export async function updateNeedStatus(id: string, status: "active" | "resolved" | "expired") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("needs").update({ status }).eq("id", id);
  if (error) {
    // رسالة Postgres تكشف أسماء الجداول والقيود: تبقى في السجلّ لا عند العميل.
    console.error("[action] updateNeedStatus:", error);
    return { success: false, error: "تعذّر تنفيذ العملية. حاول مرة أخرى." };
  }

  await logActivity(supabase, {
    actorId: user?.id,
    action: `غيّر حالة احتياج إلى ${status}`,
    entityType: "need",
    entityId: id,
  });

  revalidatePath("/admin/needs");
  revalidatePath("/needs");
  revalidatePath("/");
  return { success: true };
}

export async function updateNeedPriority(
  id: string,
  priority: "critical" | "high" | "medium" | "low",
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("needs").update({ priority }).eq("id", id);
  if (error) {
    // رسالة Postgres تكشف أسماء الجداول والقيود: تبقى في السجلّ لا عند العميل.
    console.error("[action] updateNeedPriority:", error);
    return { success: false, error: "تعذّر تنفيذ العملية. حاول مرة أخرى." };
  }

  await logActivity(supabase, {
    actorId: user?.id,
    action: `غيّر أولوية احتياج إلى ${priority}`,
    entityType: "need",
    entityId: id,
  });

  revalidatePath("/admin/needs");
  revalidatePath("/needs");
  revalidatePath("/");
  return { success: true };
}
