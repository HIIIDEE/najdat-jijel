import type { Metadata } from "next";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { formatQuantity, unitLabels } from "@/lib/constants";
import { CategoryIcon } from "@/components/shared/category-icon";
import {
  getStatDistributionsByCategory,
  getStatDonationsByCategory,
  getStatOverview,
} from "@/lib/data/public";

export const metadata: Metadata = {
  title: "الشفافية",
  description: "أرقام إجمالية حول ما تم تسجيله وتوزيعه من مساعدات، دون كشف أي بيانات شخصية.",
};

export default async function TransparencyPage() {
  const [stats, donationsByCategory, distributionsByCategory] = await Promise.all([
    getStatOverview(),
    getStatDonationsByCategory(),
    getStatDistributionsByCategory(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold">أين ذهبت المساعدات؟</h1>
        <p className="mt-2 text-muted-foreground">
          أرقام إجمالية من قاعدة البيانات مباشرة — لا تُعرض أي بيانات شخصية عن الأسر أو المتبرعين.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="الأسر المتضررة المسجَّلة" value={stats.total_families ?? 0} />
        <StatCard label="عدد المناطق التي تم الوصول إليها" value={stats.areas_reached ?? 0} tone="success" />
      </div>

      <h2 className="mt-10 mb-4 text-xl font-bold">كمية المساعدات المسجَّلة (حسب النوع والوحدة)</h2>
      {donationsByCategory.length === 0 ? (
        <EmptyState title="لا توجد مساعدات مسجَّلة بعد" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {donationsByCategory.map((row) => (
            <Card key={`${row.slug}-${row.unit}`}>
              <CardContent className="flex items-center justify-between px-5">
                <span className="flex items-center gap-2 font-medium">
                  <CategoryIcon slug={row.slug} className="size-4" />
                  {row.name_ar}
                </span>
                <span className="font-bold tabular-nums">
                  {formatQuantity(Number(row.total_quantity))} {unitLabels[row.unit!]}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        لا يتم جمع كميات بوحدات مختلفة معًا (مثال: لا نجمع لترات الماء مع عدد البطانيات).
      </p>

      <h2 className="mt-10 mb-4 text-xl font-bold">كمية المساعدات الموزَّعة على الأسر</h2>
      {distributionsByCategory.length === 0 ? (
        <EmptyState
          title="لا توجد عمليات توزيع مسجَّلة بعد"
          description="ستظهر هنا فور تسجيل أول عملية توزيع ميدانية."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {distributionsByCategory.map((row) => (
            <Card key={`${row.slug}-${row.unit}`}>
              <CardContent className="px-5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-medium">
                    <CategoryIcon slug={row.slug} className="size-4" />
                    {row.name_ar}
                  </span>
                  <span className="font-bold tabular-nums">
                    {formatQuantity(Number(row.total_quantity))} {unitLabels[row.unit!]}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  استفادت منها {formatQuantity(Number(row.total_families))} أسرة تقريبًا
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
