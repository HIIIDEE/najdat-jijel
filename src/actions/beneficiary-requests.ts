"use server";

import { createClient } from "@/lib/supabase/server";
import {
  beneficiaryRequestSchema,
  type BeneficiaryRequestInput,
} from "@/schemas/beneficiary-request";
import { activeCampaignSlug } from "@/config/site";
import { generateRequestReference } from "@/lib/reference";

export interface SubmitBeneficiaryRequestResult {
  success: boolean;
  /** المرجع العلني للطلب — يُعرض للمتضرّر ليتابع به طلبه لاحقًا. */
  reference?: string;
  error?: string;
  fieldErrors?: Record<string, string[] | undefined>;
}

/** رمز خطأ Postgres لخرق قيد التفرّد. */
const UNIQUE_VIOLATION = "23505";

/** محاولات إضافية عند تصادم مرجعين — احتمال بعيد، وتكلفته إعادة توليد فقط. */
const MAX_REFERENCE_ATTEMPTS = 3;

export async function submitBeneficiaryRequest(
  input: BeneficiaryRequestInput,
): Promise<SubmitBeneficiaryRequestResult> {
  const parsed = beneficiaryRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "الرجاء التحقق من الحقول المدخلة.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }
  const data = parsed.data;
  const supabase = await createClient();

  const { data: campaign } = await supabase
    .from("campaigns")
    .select("id")
    .eq("slug", activeCampaignSlug)
    .maybeSingle();

  if (!campaign) {
    return { success: false, error: "تعذر تحديد الحملة النشطة حاليًا. حاول مرة أخرى لاحقًا." };
  }

  // المرجع يُولَّد هنا لا في قاعدة البيانات: سياسة RLS تمنح الزائر حق الإدراج
  // وحده دون القراءة، فلا سبيل لاسترجاع القيمة التي ولّدتها القاعدة بعد الإدراج.
  const row = {
    campaign_id: campaign.id,
    full_name: data.full_name,
    phone: data.phone,
    wilaya: data.wilaya,
    commune: data.commune,
    address_note: data.address_note || null,
    family_members_count: data.family_members_count,
    children_count: data.children_count,
    housing_status: data.housing_status || null,
    is_housing_habitable:
      data.is_housing_habitable === "unknown" ? null : data.is_housing_habitable === "yes",
    has_injuries: data.has_injuries,
    injuries_note: data.injuries_note || null,
    needs_medical: data.needs_medical,
    medical_note: data.medical_note || null,
    lost_livestock: data.lost_livestock,
    lost_income: data.lost_income,
    needed_categories: data.needed_categories,
    other_needs_note: data.other_needs_note || null,
  };

  for (let attempt = 1; attempt <= MAX_REFERENCE_ATTEMPTS; attempt++) {
    const reference = generateRequestReference();
    const { error } = await supabase
      .from("beneficiary_requests")
      .insert({ ...row, reference });

    if (!error) return { success: true, reference };

    // تصادم مرجعين يُعاد منه؛ أي خطأ آخر لا فائدة من تكراره.
    if (error.code !== UNIQUE_VIOLATION) {
      console.error("[action] submitBeneficiaryRequest:", error);
      break;
    }
  }

  return { success: false, error: "حدث خطأ أثناء تسجيل طلبك. حاول مرة أخرى." };
}
