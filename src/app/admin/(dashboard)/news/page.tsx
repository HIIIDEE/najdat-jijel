import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { NewsManager } from "./news-manager";

export const metadata: Metadata = { title: "الأخبار", robots: { index: false } };

export default async function AdminNewsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">مدونة الأخبار</h1>
        <p className="text-sm text-muted-foreground">
          مستجدات وتقارير ميدانية ينشرها فريق التنسيق على صفحة الأخبار العامة.
        </p>
      </div>
      <NewsManager posts={data ?? []} />
    </div>
  );
}
