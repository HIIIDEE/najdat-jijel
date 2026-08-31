import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getActiveCampaign } from "@/lib/data/public";
import { classifyNewsItem } from "@/config/news-sources";
import { isApiRequestAuthorized } from "@/lib/api-auth";
import { z } from "zod";

/**
 * حمولة الـ webhook.
 *
 * كانت تُفكَّك من `body` كما وردت. المُرسِل موثوق بالسرّ، لكن ما يصله هو منشور
 * فيسبوك بمحتوى لا يتحكّم فيه أحد: الحدود هنا تمنع نصًّا بلا نهاية من ملء
 * الجدول، و`url` مقيَّد بـ http/https لأنه يُعرض رابطًا قابلًا للنقر — ورابط
 * بصيغة `javascript:` ينفّذ شيفرة عند نقر الزائر.
 */
const webhookPayloadSchema = z.object({
  title: z.string().max(5000).optional(),
  text: z.string().max(20000).optional(),
  message: z.string().max(20000).optional(),
  url: z
    .string()
    .url()
    .refine((value) => /^https?:$/.test(new URL(value).protocol), "رابط غير مسموح")
    .max(2000)
    .optional(),
  source: z.string().trim().min(1).max(200).default("مديرية الحماية المدنية لولاية جيجل"),
});

/**
 * Webhook endpoint to receive real-time posts from Facebook Pages (e.g. DGPC0018)
 * Triggered by Make.com, Pipedream, Zapier, or a Python script.
 */
export async function POST(req: Request) {
  if (!isApiRequestAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const parsed = webhookPayloadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const { title, text, message, url, source } = parsed.data;

    const postText = message || text || title || "";
    if (!postText.trim()) {
      return NextResponse.json({ error: "Missing text content" }, { status: 400 });
    }

    const { update_type, is_urgent } = classifyNewsItem(postText);
    const campaign = await getActiveCampaign();
    const supabase = await createClient();

    // Extract title (first line) and body (rest)
    const lines = postText.split("\n").filter((l: string) => l.trim().length > 0);
    const postTitle = lines[0]?.slice(0, 200) || "بيان من الحماية المدنية - جيجل";
    const postBody = lines.slice(1).join("\n") || postText;

    if (!campaign) {
      return NextResponse.json({ error: "Active campaign not found" }, { status: 404 });
    }

    const { data, error } = await supabase.from("official_updates").insert({
      campaign_id: campaign.id,
      title: postTitle,
      body: postBody,
      source: source,
      url: url || "https://www.facebook.com/DGPC0018",
      update_type: update_type,
      published_at: new Date().toISOString(),
    }).select().single();

    if (error) {
      // رسالة Postgres تكشف أسماء الجداول والقيود وسياسات RLS: تبقى في السجلّ.
      console.error("[api] news/webhook insert:", error);
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Post ingested successfully from DGPC0018",
      item: data,
      is_urgent,
    });
  } catch (err: unknown) {
    console.error("[api] news/webhook:", err);
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
