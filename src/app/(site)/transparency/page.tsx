import type { Metadata } from "next";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { DataUnavailable } from "@/components/shared/data-unavailable";
import { Card, CardContent } from "@/components/ui/card";
import { formatQuantity, getCategoryName, getUnitLabel } from "@/lib/constants";
import { CategoryIcon } from "@/components/shared/category-icon";
import {
  getStatDistributionsByCategory,
  getStatDonationsByCategory,
  getStatOverview,
} from "@/lib/data/public";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.nav.transparency,
    description: t.transparency.pageSubtitle,
  };
}

export default async function TransparencyPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const isFr = locale === "fr";

  const [statsResult, donationsByCategory, distributionsByCategory] = await Promise.all([
    getStatOverview(),
    getStatDonationsByCategory(),
    getStatDistributionsByCategory(),
  ]);

  const stats = statsResult.data;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold">{t.transparency.pageTitle}</h1>
        <p className="mt-2 text-muted-foreground">
          {t.transparency.pageSubtitle}
        </p>
      </div>

      {statsResult.failed ? <DataUnavailable className="mb-6" /> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          label={isFr ? "Familles sinistrées enregistrées" : "الأسر المتضررة المسجَّلة"}
          value={stats.total_families ?? 0}
        />
        <StatCard
          label={isFr ? "Zones atteintes par les secours" : "عدد المناطق التي تم الوصول إليها"}
          value={stats.areas_reached ?? 0}
          tone="success"
        />
      </div>

      <h2 className="mt-10 mb-4 text-xl font-bold">
        {isFr ? "Dons matériels enregistrés (par type et unité)" : "كمية المساعدات المسجَّلة (حسب النوع والوحدة)"}
      </h2>
      {donationsByCategory.length === 0 ? (
        <EmptyState title={isFr ? "Aucun don enregistré pour le moment" : "لا توجد مساعدات مسجَّلة بعد"} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {donationsByCategory.map((row) => (
            <Card key={`${row.slug}-${row.unit}`}>
              <CardContent className="flex items-center justify-between px-5">
                <span className="flex items-center gap-2 font-medium">
                  <CategoryIcon slug={row.slug} className="size-4" />
                  {getCategoryName(row.slug, row.name_ar, locale)}
                </span>
                <span className="font-bold tabular-nums">
                  {formatQuantity(Number(row.total_quantity), locale)} {getUnitLabel(row.unit, locale)}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        {isFr
          ? "Les quantités d'unités différentes ne sont pas additionnées (ex: litres d'eau et couvertures ne se cumulent pas)."
          : "لا يتم جمع كميات بوحدات مختلفة معًا (مثال: لا نجمع لترات الماء مع عدد البطانيات)."}
      </p>

      <h2 className="mt-10 mb-4 text-xl font-bold">
        {isFr ? "Aides distribuées aux familles" : "كمية المساعدات الموزَّعة على الأسر"}
      </h2>
      {distributionsByCategory.length === 0 ? (
        <EmptyState
          title={isFr ? "Aucune distribution enregistrée pour le moment" : "لا توجد عمليات توزيع مسجَّلة بعد"}
          description={isFr ? "Les bilans apparaîtront dès la première distribution sur le terrain." : "ستظهر هنا فور تسجيل أول عملية توزيع ميدانية."}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {distributionsByCategory.map((row) => (
            <Card key={`${row.slug}-${row.unit}`}>
              <CardContent className="px-5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium">
                    <CategoryIcon slug={row.slug} className="size-4" />
                    {getCategoryName(row.slug, row.name_ar, locale)}
                  </span>
                  <span className="font-bold tabular-nums">
                    {formatQuantity(Number(row.total_quantity), locale)} {getUnitLabel(row.unit, locale)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {isFr
                    ? `Bénéficiant à environ ${formatQuantity(Number(row.total_families), locale)} familles`
                    : `استفادت منها ${formatQuantity(Number(row.total_families), locale)} أسرة تقريبًا`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
