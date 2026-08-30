import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatRelativeTime } from "@/lib/constants";
import { getPublishedPosts } from "@/lib/data/public";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.nav.news,
    description: t.news.pageSubtitle,
  };
}

export default async function NewsPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const isFr = locale === "fr";
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 text-center sm:text-start">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-extrabold sm:justify-start">
          <Newspaper className="size-7 text-algeria-green" />
          {t.news.pageTitle}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {t.news.pageSubtitle}
        </p>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          title={isFr ? "Aucun article publié pour le moment" : "لا توجد أخبار منشورة بعد"}
          description={isFr ? "Les points de situation et rapports seront publiés ici." : "سيتم نشر مستجدات التنسيق والتقارير الميدانية هنا."}
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
                      {formatRelativeTime(p.published_at, locale)}
                    </span>
                  </div>
                  {p.excerpt && (
                    <p className="text-sm leading-relaxed text-muted-foreground">{p.excerpt}</p>
                  )}
                  <p className="flex items-center gap-1 text-sm font-medium text-algeria-green">
                    {isFr ? "Lire la suite" : "اقرأ المزيد"} <ArrowLeft className="size-3.5" />
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
