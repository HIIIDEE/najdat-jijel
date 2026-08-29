"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import type { AffectedSeverity } from "@/lib/constants";

export async function updateAreaSeverity(id: string, severity: AffectedSeverity) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("affected_areas").update({ severity }).eq("id", id);
  if (error) return { success: false, error: error.message };

  await logActivity(supabase, {
    actorId: user?.id,
    action: `غيّر حالة منطقة متضررة إلى ${severity}`,
    entityType: "affected_area",
    entityId: id,
  });

  revalidatePath("/admin/affected-areas");
  revalidatePath("/affected-areas");
  revalidatePath("/");
  return { success: true };
}
