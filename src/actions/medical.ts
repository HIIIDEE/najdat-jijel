"use server";

import { createClient } from "@/lib/supabase/server";
import { medicalVolunteerSchema, MedicalVolunteerInput } from "@/schemas/medical-volunteer";
import { revalidatePath } from "next/cache";

export type MedicalActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function submitMedicalVolunteer(
  data: MedicalVolunteerInput
): Promise<MedicalActionState> {
  const result = medicalVolunteerSchema.safeParse(data);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await (supabase as any).from("medical_volunteers").insert({
    full_name: result.data.full_name,
    phone: result.data.phone,
    email: result.data.email || null,
    specialty: result.data.specialty,
    license_number: result.data.license_number || null,
    wilaya_code: result.data.wilaya_code,
    commune_id: result.data.commune_id,
    current_workplace: result.data.current_workplace || null,
    can_teleconsult: result.data.can_teleconsult,
    can_field_intervene: result.data.can_field_intervene,
    has_emergency_kit: result.data.has_emergency_kit,
    notes: result.data.notes || null,
    status: "pending",
  });

  if (error) {
    console.error("Medical volunteer insert error:", error);
    return {
      success: false,
      message: "حدث خطأ أثناء حفظ البيانات، يرجى المحاولة لاحقاً.",
    };
  }

  revalidatePath("/admin/medical");
  return {
    success: true,
    message: "تم تسجيل انضمامكم إلى الفريق الطبي بنجاح. شكراً لتطوعكم!",
  };
}