"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import { createDistribution } from "@/services/distributions";
import { activeCampaignSlug } from "@/config/site";

const schema = z.object({
  hub_id: z.string().uuid("اختر المركز"),
  category_id: z.string().uuid("اختر المادة"),
  quantity: z.coerce.number().positive("يجب أن تكون أكبر من صفر"),
  unit: z.enum(["piece", "box", "portion", "carton", "liter", "kg", "ton", "bundle", "person"]),
  beneficiary_family_count: z.coerce.number().int().min(0),
  distribution_date: z.string().optional(),
  responsible_name: z.string().trim().min(2, "اسم المسؤول مطلوب"),
  notes: z.string().trim().optional(),
});

export async function createDistributionAction(formData: FormData) {
  const parsed = schema.safeParse({
    hub_id: formData.get("hub_id"),
    category_id: formData.get("category_id"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit"),
    beneficiary_family_count: formData.get("beneficiary_family_count"),
    distribution_date: formData.get("distribution_date") || undefined,
    responsible_name: formData.get("responsible_name"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة." };
  }
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

  let proofFilePath: string | undefined;
  const proofFile = formData.get("proof_file");
  if (proofFile instanceof File && proofFile.size > 0) {
    const ext = proofFile.name.split(".").pop() || "jpg";
    const path = `${data.hub_id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("distribution-proofs")
      .upload(path, proofFile);
    if (!uploadError) proofFilePath = path;
  }

  const { error } = await createDistribution(supabase, {
    campaignId: campaign.id,
    hubId: data.hub_id,
    categoryId: data.category_id,
    quantity: data.quantity,
    unit: data.unit,
    beneficiaryFamilyCount: data.beneficiary_family_count,
    distributionDate: data.distribution_date,
    responsibleName: data.responsible_name,
    responsibleId: user?.id,
    proofFilePath,
    notes: data.notes,
  });

  if (error) return { success: false, error: "حدث خطأ أثناء تسجيل عملية التوزيع." };

  await logActivity(supabase, {
    actorId: user?.id,
    action: `سجّل عملية توزيع لـ ${data.beneficiary_family_count} أسرة`,
    entityType: "distribution",
  });

  revalidatePath("/admin/distributions");
  revalidatePath("/admin/inventory");
  revalidatePath("/transparency");
  return { success: true };
}
