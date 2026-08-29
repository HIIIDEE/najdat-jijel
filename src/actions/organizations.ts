"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import type { VerificationLevel } from "@/lib/constants";

const organizationSchema = z.object({
  name: z.string().trim().min(2, "الاسم مطلوب"),
  org_type: z.string().trim().max(100).optional().or(z.literal("")),
  contact_name: z.string().trim().max(100).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  wilaya: z.string().trim().max(50).optional().or(z.literal("")),
});
export type OrganizationInput = z.infer<typeof organizationSchema>;

function toRow(data: OrganizationInput) {
  return {
    name: data.name,
    org_type: data.org_type || null,
    contact_name: data.contact_name || null,
    phone: data.phone || null,
    wilaya: data.wilaya || null,
  };
}

export async function createOrganization(input: OrganizationInput) {
  const parsed = organizationSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "بيانات غير صحيحة." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: created, error } = await supabase
    .from("organizations")
    .insert({ ...toRow(parsed.data), created_by: user?.id })
    .select("id")
    .single();
  if (error) return { success: false, error: error.message };

  await logActivity(supabase, {
    actorId: user?.id,
    action: `أضاف جمعية جديدة: ${parsed.data.name}`,
    entityType: "organization",
    entityId: created.id,
  });

  revalidatePath("/admin/organizations");
  return { success: true };
}

export async function updateOrganization(id: string, input: OrganizationInput) {
  const parsed = organizationSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: "بيانات غير صحيحة." };

  const supabase = await createClient();
  const { error } = await supabase.from("organizations").update(toRow(parsed.data)).eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/organizations");
  return { success: true };
}

export async function updateOrganizationVerification(id: string, level: VerificationLevel) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("organizations")
    .update({ verification_level: level, verified_by: user?.id, verified_at: new Date().toISOString() })
    .eq("id", id);
  if (error) return { success: false, error: error.message };

  await supabase.from("verification_records").insert({
    entity_type: "organization",
    entity_id: id,
    level,
    verified_by: user?.id,
  });

  revalidatePath("/admin/organizations");
  return { success: true };
}

export async function deleteOrganization(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("organizations").delete().eq("id", id);
  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/organizations");
  return { success: true };
}
