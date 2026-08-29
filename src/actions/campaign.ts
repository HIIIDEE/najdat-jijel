"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const schema = z.object({
  id: z.string().uuid(),
  name: z.string().trim().min(2),
  description: z.string().trim().optional(),
  is_active: z.boolean(),
});

export async function updateCampaign(input: z.infer<typeof schema>) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { success: false, error: "بيانات غير صحيحة." };
  const data = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase
    .from("campaigns")
    .update({ name: data.name, description: data.description || null, is_active: data.is_active })
    .eq("id", data.id);

  if (error) return { success: false, error: "ليست لديك صلاحية تعديل الحملة (الأدمن فقط)." };

  revalidatePath("/admin/settings");
  revalidatePath("/");
  return { success: true };
}
