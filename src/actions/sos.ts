"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function submitSosSignal(data: {
  full_name?: string;
  phone: string;
  latitude: number;
  longitude: number;
}) {
  if (!data.phone || !data.latitude || !data.longitude) {
    return { success: false, message: "رقم الهاتف وتحديد الموقع مطلوبان." };
  }

  try {
    const supabase = await createClient();
    const { error } = await (supabase as any).from("emergency_sos").insert({
      full_name: data.full_name || "شخص في حالة خطر",
      phone: data.phone,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    if (error) {
      console.error("SOS insert error:", error);
      return { success: false, message: `خطأ أثناء الحفظ: ${error.message}` };
    }

    revalidatePath("/");
    return { success: true };
  } catch (err) {
    console.error("Server error:", err);
    return { success: false, message: "حدث خطأ غير متوقع." };
  }
}