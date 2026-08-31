"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import type { TransportStatus } from "@/lib/constants";

export async function updateTransportOfferStatus(id: string, status: TransportStatus) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("transport_offers").update({ status }).eq("id", id);
  if (error) {
    // رسالة Postgres تكشف أسماء الجداول والقيود: تبقى في السجلّ لا عند العميل.
    console.error("[action] updateTransportOfferStatus:", error);
    return { success: false, error: "تعذّر تنفيذ العملية. حاول مرة أخرى." };
  }

  await logActivity(supabase, {
    actorId: user?.id,
    action: `غيّر حالة عرض نقل إلى ${status}`,
    entityType: "transport_offer",
    entityId: id,
  });

  revalidatePath("/admin/transport");
  return { success: true };
}
