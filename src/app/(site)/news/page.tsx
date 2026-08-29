import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { relativeTimeAr } from "@/lib/constants";
import { getPublishedPosts } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "الأخبار",
  description: "مستجدات فرق التنسيق وتقارير الميدان من منصة هبة الجزائر.",
};

export default async function NewsPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 text-center sm:text-right">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-extrabold sm:justify-start">
          <Newspaper className="size-7 text-algeria-green" />
          الأخبار
        </h1>
        <p className="mt-2 text-muted-foreground">
          مستجدات فرق التنسيق وتقارير من الميدان، ينشرها فريق المنصة.
        </p>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title="لا توجد أخبار منشورة بعد"
          description="سيتم نشر مستجدات التنسيق والتقارير الميدانية هنا."
        />
      ) : (
        <div className="space-y-4">
          {posts.map((p) => (
            <Link key={p.id} href={`/news/${p.slug}`} className="group block">
              <Card className="transition-all group-hover:-translate-y-0.5 group-hover:border-algeria-green/50 group-hover:shadow-md">
                <CardContent className="space-y-2 px-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-lg font-bold leading-snug">{p.title}</h2>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {relativeTimeAr(p.published_at)}
                    </span>
                  </div>
                  {p.excerpt && (
                    <p className="text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
                  )}
                  <p className="flex items-center gap-1 text-sm font-medium text-algeria-green">
                    اقرأ المزيد <ArrowLeft className="size-3.5" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
