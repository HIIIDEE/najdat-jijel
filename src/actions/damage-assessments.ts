"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { damageAssessmentSchema } from "@/schemas/damage-assessment";
import { estimateDamageMaterials } from "@/services/damage-estimation";
import { logActivity } from "@/services/activity-log";
import { activeCampaignSlug } from "@/config/site";
import type { DamageAssessmentStatus } from "@/lib/constants";

/** حدود رفع الصور — تُطبَّق على الخادم، ويُكرّرها قيد على الحاوية في الهجرة 0030. */
const MAX_PHOTOS = 6;
const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type DamageAssessmentActionState = { success: boolean; error?: string };

export async function submitDamageAssessment(
  _prevState: DamageAssessmentActionState,
  formData: FormData,
): Promise<DamageAssessmentActionState> {
  const parsed = damageAssessmentSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
    wilaya: formData.get("wilaya"),
    commune: formData.get("commune"),
    address_note: formData.get("address_note") || undefined,
    needs_paint: formData.get("needs_paint") === "on",
    paint_area_sqm: formData.get("paint_area_sqm") || undefined,
    needs_flooring: formData.get("needs_flooring") === "on",
    needs_roofing: formData.get("needs_roofing") === "on",
    needs_plumbing: formData.get("needs_plumbing") === "on",
    needs_electrical: formData.get("needs_electrical") === "on",
    finishing_notes: formData.get("finishing_notes") || undefined,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة." };
  }
  const data = parsed.data;

  const supabase = await createClient();

  // رفع الصور (أول رفع ملفات عام في المنصة) — الحاوية خاصة، القراءة للطاقم فقط.
  //
  // `accept="image/*"` في النموذج تلميح للمتصفّح لا حاجز: هذا المسار مفتوح بلا
  // حساب، ويُستدعى مباشرة كما يُستدعى أي server action. لذلك يُفحص كل ملف هنا:
  // النوع من قائمة مسموحة، والحجم والعدد بحدّ أعلى.
  const photoPaths: string[] = [];
  const photos = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)
    .slice(0, MAX_PHOTOS);

  for (const [index, file] of photos.entries()) {
    const extension = ALLOWED_PHOTO_TYPES[file.type];

    // الامتداد يُشتقّ من نوع المحتوى لا من اسم الملف الذي يختاره المُرسِل.
    if (!extension) continue;
    if (file.size > MAX_PHOTO_BYTES) continue;

    const path = `${data.wilaya}/${Date.now()}-${index}.${extension}`;
    const { error: uploadError } = await supabase.storage
      .from("damage-photos")
      .upload(path, file, { contentType: file.type });

    if (uploadError) {
      console.error("[action] submitDamageAssessment upload:", uploadError);
      continue;
    }
    photoPaths.push(path);
  }

  const estimate = estimateDamageMaterials({
    needsPaint: data.needs_paint,
    paintAreaSqm: data.paint_area_sqm ?? null,
    needsFlooring: data.needs_flooring,
    needsRoofing: data.needs_roofing,
    needsPlumbing: data.needs_plumbing,
    needsElectrical: data.needs_electrical,
  });

  const hasAnyMaterialNeed =
    data.needs_paint || data.needs_flooring || data.needs_roofing || data.needs_plumbing || data.needs_electrical;

  // ننشئ احتياجًا قياسيًا (مواد بناء) يدخل تلقائيًا في دورة المطابقة الحالية
  // (donations -> matching.ts -> transport) دون أي كود مطابقة إضافي.
  let linkedNeedId: string | null = null;
  if (hasAnyMaterialNeed) {
    const { data: campaign } = await supabase
      .from("campaigns")
      .select("id")
      .eq("slug", activeCampaignSlug)
      .maybeSingle();

    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", "construction_materials")
      .maybeSingle();

    if (campaign && category) {
      const { data: need } = await supabase
        .from("needs")
        .insert({
          campaign_id: campaign.id,
          category_id: category.id,
          wilaya: data.wilaya,
          commune: data.commune,
          title: `مواد ترميم — ${data.full_name}`,
          quantity_needed: estimate.paintCans > 0 ? estimate.paintCans : 1,
          quantity_available: 0,
          unit: "piece",
          priority: "medium",
          notes: data.finishing_notes || null,
          source_type: "public_report",
        })
        .select("id")
        .maybeSingle();
      linkedNeedId = need?.id ?? null;
    }
  }

  const { error } = await supabase.from("damage_assessments").insert({
    full_name: data.full_name,
    phone: data.phone,
    wilaya: data.wilaya,
    commune: data.commune,
    address_note: data.address_note || null,
    needs_paint: data.needs_paint,
    paint_area_sqm: data.paint_area_sqm ?? null,
    needs_flooring: data.needs_flooring,
    needs_roofing: data.needs_roofing,
    needs_plumbing: data.needs_plumbing,
    needs_electrical: data.needs_electrical,
    finishing_notes: data.finishing_notes || null,
    photo_paths: photoPaths,
    status: "estimated",
    estimated_paint_liters: estimate.paintLiters || null,
    estimated_paint_cans: estimate.paintCans || null,
    required_specialties: estimate.requiredSpecialties,
    linked_need_id: linkedNeedId,
  });

  if (error) {
    console.error("Damage assessment insert error:", error);
    return { success: false, error: "حدث خطأ أثناء تسجيل التقييم. حاول مرة أخرى." };
  }

  await logActivity(supabase, {
    action: `طلب تقييم أضرار جديد من ${data.full_name} (${data.commune})`,
    entityType: "damage_assessment",
  });

  revalidatePath("/admin/damage-assessments");
  revalidatePath("/admin/needs");
  revalidatePath("/needs");
  return { success: true };
}

export async function updateDamageAssessmentStatus(id: string, status: DamageAssessmentStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("damage_assessments").update({ status }).eq("id", id);
  if (error) return { success: false, error: "ليست لديك صلاحية تغيير الحالة (الأدمن فقط)." };

  await logActivity(supabase, {
    actorId: user?.id,
    action: `غيّر حالة تقييم أضرار إلى ${status}`,
    entityType: "damage_assessment",
    entityId: id,
  });

  revalidatePath("/admin/damage-assessments");
  return { success: true };
}

export async function assignArtisanToAssessment(assessmentId: string, artisanId: string | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("damage_assessments")
    .update({ assigned_artisan_id: artisanId })
    .eq("id", assessmentId);
  if (error) return { success: false, error: "ليست لديك صلاحية إسناد حرفي (الأدمن فقط)." };

  await logActivity(supabase, {
    actorId: user?.id,
    action: artisanId ? "أسند حرفيًا لتقييم أضرار" : "ألغى إسناد الحرفي عن تقييم أضرار",
    entityType: "damage_assessment",
    entityId: assessmentId,
  });

  revalidatePath("/admin/damage-assessments");
  return { success: true };
}

export async function getSignedDamagePhotoUrl(path: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from("damage-photos").createSignedUrl(path, 60 * 10);
  if (error || !data) return null;
  return data.signedUrl;
}
