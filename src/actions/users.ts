"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import type { AppRole } from "@/lib/constants";

export async function updateUserRole(id: string, role: AppRole) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("profiles").update({ role }).eq("id", id);
  if (error) return { success: false, error: "ليست لديك صلاحية تغيير الأدوار (الأدمن فقط)." };

  await logActivity(supabase, {
    actorId: user?.id,
    action: `غيّر دور مستخدم إلى ${role}`,
    entityType: "profile",
    entityId: id,
  });

  revalidatePath("/admin/users");
  return { success: true };
}
