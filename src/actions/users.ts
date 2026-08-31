"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import type { AppRole } from "@/lib/constants";

const roleSchema = z.enum([
  "admin",
  "coordinator",
  "volunteer",
  "verified_organization",
  "donor",
  "driver",
  "beneficiary",
]);

const updateUserRoleSchema = z.object({
  id: z.string().uuid(),
  role: roleSchema,
});

/**
 * تغيير دور مستخدم.
 *
 * الحماية الحقيقية في قاعدة البيانات: سياسة `profiles_admin_all` وحاجز
 * `trg_guard_profile_role_change` (الهجرة 0023) الذي يمنع أي رفع ذاتي للرتبة.
 * لكن الاعتماد عليها وحدها ترك هنا ثقبين:
 *
 * - لا فحص للهوية والدور في التطبيق، خلافًا لـ `staff.ts` الذي يفعل ذلك لنفس
 *   العملية تمامًا. طبقة واحدة تكفي حتى تسقط.
 * - حين لا تطابق أي سياسة، PostgREST يعدّل صفرًا من الصفوف **دون خطأ**: كانت
 *   الدالة ترجع `{ success: true }` والمشرف يظنّ أن الدور تغيّر وهو لم يتغيّر.
 */
export async function updateUserRole(id: string, role: AppRole) {
  const parsed = updateUserRoleSchema.safeParse({ id, role });
  if (!parsed.success) {
    return { success: false, error: "بيانات غير صحيحة." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "يجب تسجيل الدخول." };
  }

  const { data: me } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (me?.role !== "admin") {
    return { success: false, error: "ليست لديك صلاحية تغيير الأدوار (الأدمن فقط)." };
  }

  const { data: updated, error } = await supabase
    .from("profiles")
    .update({ role: parsed.data.role })
    .eq("id", parsed.data.id)
    .select("id");

  if (error) {
    console.error("[action] updateUserRole:", error);
    return { success: false, error: "تعذّر تغيير الدور. حاول مرة أخرى." };
  }

  // صفر صف مُعدَّل = رفضت السياسة العملية بصمت، لا أنها نجحت.
  if (!updated || updated.length === 0) {
    return { success: false, error: "لم يتم تغيير الدور — تحقّق من الحساب ومن صلاحياتك." };
  }

  await logActivity(supabase, {
    actorId: user.id,
    action: `غيّر دور مستخدم إلى ${parsed.data.role}`,
    entityType: "profile",
    entityId: parsed.data.id,
  });

  revalidatePath("/admin/users");
  return { success: true };
}
