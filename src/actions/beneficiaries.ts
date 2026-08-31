"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import type { RequestStatus, VerificationLevel, PriorityLevel } from "@/lib/constants";

export async function updateBeneficiaryStatus(id: string, status: RequestStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("beneficiary_requests").update({ status }).eq("id", id);
  if (error) {
    // رسالة Postgres تكشف أسماء الجداول والقيود: تبقى في السجلّ لا عند العميل.
    console.error("[action] updateBeneficiaryStatus:", error);
    return { success: false, error: "تعذّر تنفيذ العملية. حاول مرة أخرى." };
  }

  await logActivity(supabase, {
    actorId: user?.id,
    action: `غيّر حالة طلب مساعدة إلى ${status}`,
    entityType: "beneficiary_request",
    entityId: id,
  });

  revalidatePath("/admin/beneficiaries");
  revalidatePath("/transparency");
  revalidatePath("/");
  return { success: true };
}

export async function updateBeneficiaryPriority(id: string, priority: PriorityLevel) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("beneficiary_requests").update({ priority }).eq("id", id);
  if (error) {
    // رسالة Postgres تكشف أسماء الجداول والقيود: تبقى في السجلّ لا عند العميل.
    console.error("[action] updateBeneficiaryPriority:", error);
    return { success: false, error: "تعذّر تنفيذ العملية. حاول مرة أخرى." };
  }

  await logActivity(supabase, {
    actorId: user?.id,
    action: `غيّر أولوية طلب مساعدة إلى ${priority}`,
    entityType: "beneficiary_request",
    entityId: id,
  });

  revalidatePath("/admin/beneficiaries");
  return { success: true };
}

export async function updateBeneficiaryVerification(id: string, level: VerificationLevel) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("beneficiary_requests")
    .update({ verification_level: level, verified_by: user?.id, verified_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    // رسالة Postgres تكشف أسماء الجداول والقيود: تبقى في السجلّ لا عند العميل.
    console.error("[action] updateBeneficiaryVerification:", error);
    return { success: false, error: "تعذّر تنفيذ العملية. حاول مرة أخرى." };
  }

  await supabase.from("verification_records").insert({
    entity_type: "beneficiary_request",
    entity_id: id,
    level,
    verified_by: user?.id,
  });

  revalidatePath("/admin/beneficiaries");
  return { success: true };
}
