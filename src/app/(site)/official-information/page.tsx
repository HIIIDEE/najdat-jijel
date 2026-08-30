import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatRelativeTime } from "@/lib/constants";
import { getOfficialUpdates } from "@/lib/data/public";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.nav.officialInformation,
    description: t.officialInformation.pageSubtitle,
  };
}

const typeLabelsAr: Record<string, string> = {
  news: "خبر",
  statement: "بيان",
  advisory: "تنبيه",
  report: "تقرير",
};

const typeLabelsFr: Record<string, string> = {
  news: "Actualité",
  statement: "Communiqué",
  advisory: "Alerte",
  report: "Rapport",
};

export default async function OfficialInformationPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const isFr = locale === "fr";
  const updates = await getOfficialUpdates(50);
  const typeLabels = isFr ? typeLabelsFr : typeLabelsAr;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold">{t.officialInformation.pageTitle}</h1>
        <p className="mt-2 text-muted-foreground">
          {t.officialInformation.pageSubtitle}
        </p>
      </div>

      {updates.length === 0 ? (
        <EmptyState
          title={isFr ? "Aucune information officielle pour le moment" : "لا توجد معلومات رسمية منشورة بعد"}
          description={isFr ? "Les communiqués vérifiés seront publiés ici." : "سيتم نشر أي معلومة موثقة من مصدر موثوق هنا فور توفرها."}
        />
      ) : (
        <div className="space-y-4">
          {updates.map((u) => (
            <Card key={u.id}>
              <CardContent className="space-y-2 px-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-semibold">
                    {typeLabels[u.update_type] ?? u.update_type}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {formatRelativeTime(u.published_at, locale)}
                  </span>
                </div>
                <p className="text-lg font-bold">{u.title}</p>
                {u.body && <p className="text-sm text-muted-foreground">{u.body}</p>}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{isFr ? "Source : " : "المصدر: "}{u.source}</span>
                  {u.url && (
                    <a href={u.url} target="_blank" rel="noopener noreferrer" className="text-algeria-green hover:underline">
                      {isFr ? "Lien officiel" : "الرابط الأصلي"}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
