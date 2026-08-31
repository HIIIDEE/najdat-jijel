"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import { activeCampaignSlug } from "@/config/site";
import { z } from "zod";

/**
 * البيان الرسمي يُنشر على صفحة عامة، و`url` يُعرض رابطًا قابلًا للنقر لكل زائر.
 * رابط بصيغة `javascript:` أو `data:` ينفّذ شيفرة عند النقر، فيتحوّل خطأ لصق
 * أو حساب إداري مخترَق إلى XSS مخزَّن يصيب كل من يفتح الصفحة.
 */
const officialUpdateSchema = z.object({
  title: z.string().trim().min(3, "العنوان قصير جدًا").max(200),
  body: z.string().max(10000).optional(),
  source: z.string().trim().min(1, "المصدر مطلوب").max(200),
  url: z
    .string()
    .url("رابط غير صحيح")
    .max(2000)
    .refine((value) => /^https?:$/.test(new URL(value).protocol), "الرابط يجب أن يبدأ بـ http أو https")
    .optional()
    .or(z.literal("")),
  update_type: z.string().trim().min(1).max(50),
});

export type CreateOfficialUpdateInput = z.input<typeof officialUpdateSchema>;

export async function createOfficialUpdate(input: CreateOfficialUpdateInput) {
  const parsed = officialUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة" };
  }
  const data_in = parsed.data;

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
      title: data_in.title,
      body: data_in.body || null,
      source: data_in.source,
      url: data_in.url || null,
      update_type: data_in.update_type,
      published_at: new Date().toISOString(),
      created_by: user?.id || null,
    })
    .select()
    .single();

  if (error) {
    console.error("[action] createOfficialUpdate:", error);
    return { success: false, error: "تعذّر نشر البيان. حاول مرة أخرى." };
  }

  await logActivity(supabase, {
    actorId: user?.id,
    action: `نشر بيانًا رسميًا موثقًا: ${data_in.title}`,
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
  if (error) {
    // رسالة Postgres تكشف أسماء الجداول والقيود: تبقى في السجلّ لا عند العميل.
    console.error("[action] deleteOfficialUpdate:", error);
    return { success: false, error: "تعذّر تنفيذ العملية. حاول مرة أخرى." };
  }

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
