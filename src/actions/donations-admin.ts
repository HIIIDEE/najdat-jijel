"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import type { DonationStatus } from "@/lib/constants";

export async function updateDonationStatus(id: string, status: DonationStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("donations").update({ status }).eq("id", id);
  if (error) return { success: false, error: error.message };

  await logActivity(supabase, {
    actorId: user?.id,
    action: `غيّر حالة مساعدة إلى ${status}`,
    entityType: "donation",
    entityId: id,
  });

  revalidatePath("/admin/donations");
  return { success: true };
}
