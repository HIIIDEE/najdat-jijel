"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/services/activity-log";
import { activeCampaignSlug } from "@/config/site";

const schema = z.object({
  title: z.string().trim().min(3, "العنوان مطلوب").max(200),
  excerpt: z.string().trim().max(400).optional().or(z.literal("")),
  body: z.string().trim().min(10, "نص الخبر مطلوب"),
  is_published: z.boolean(),
});

/** يولّد slug من العنوان العربي مع لاحقة قصيرة لتفادي التكرار. */
function slugify(title: string) {
  const base = title
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}

export async function createPost(input: z.infer<typeof schema>) {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صحيحة." };
  }
  const data = parsed.data;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: campaign }, { data: profile }] = await Promise.all([
    supabase.from("campaigns").select("id").eq("slug", activeCampaignSlug).maybeSingle(),
    user ? supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  const { error } = await supabase.from("posts").insert({
    campaign_id: campaign?.id ?? null,
    slug: slugify(data.title),
    title: data.title,
    excerpt: data.excerpt || null,
    body: data.body,
    is_published: data.is_published,
    published_at: data.is_published ? new Date().toISOString() : null,
    author_id: user?.id,
    author_name: profile?.full_name ?? null,
  });
  if (error) return { success: false, error: "تعذر نشر الخبر." };

  await logActivity(supabase, {
    actorId: user?.id,
    action: `${data.is_published ? "نشر" : "حفظ مسودة"} خبرًا: ${data.title}`,
    entityType: "post",
  });

  revalidatePath("/admin/news");
  revalidatePath("/news");
  return { success: true };
}

export async function togglePostPublished(id: string, isPublished: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({
      is_published: isPublished,
      published_at: isPublished ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/news");
  revalidatePath("/news");
  return { success: true };
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/admin/news");
  revalidatePath("/news");
  return { success: true };
}
