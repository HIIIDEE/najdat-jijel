import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  categoryEmoji,
  formatQuantity,
  requestStatusLabels,
  unitLabels,
} from "@/lib/constants";
import { getStatDistributionsByCategory, getStatDonationsByCategory } from "@/lib/data/public";

export const metadata: Metadata = { title: "التقارير", robots: { index: false } };

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const [donationsByCategory, distributionsByCategory, { data: requests }] = await Promise.all([
    getStatDonationsByCategory(),
    getStatDistributionsByCategory(),
    supabase.from("beneficiary_requests").select("status, commune"),
  ]);

  const byStatus = new Map<string, number>();
  const byCommune = new Map<string, number>();
  for (const r of requests ?? []) {
    byStatus.set(r.status, (byStatus.get(r.status) ?? 0) + 1);
    byCommune.set(r.commune, (byCommune.get(r.commune) ?? 0) + 1);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">التقارير</h1>
        <p className="text-sm text-muted-foreground">تفصيل أدق من صفحة الشفافية العامة، لفريق التنسيق فقط.</p>
      </div>

      <section>
        <h2 className="mb-3 font-bold">طلبات المساعدة حسب الحالة</h2>
        {byStatus.size === 0 ? (
          <EmptyState title="لا توجد بيانات بعد" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {[...byStatus.entries()].map(([status, count]) => (
              <Card key={status}>
                <CardContent className="flex items-center justify-between px-5">
                  <span className="text-sm">{requestStatusLabels[status as keyof typeof requestStatusLabels]}</span>
                  <span className="font-bold tabular-nums">{formatQuantity(count)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-bold">طلبات المساعدة حسب البلدية</h2>
        {byCommune.size === 0 ? (
          <EmptyState title="لا توجد بيانات بعد" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {[...byCommune.entries()].map(([commune, count]) => (
              <Card key={commune}>
                <CardContent className="flex items-center justify-between px-5">
                  <span className="text-sm">{commune}</span>
                  <span className="font-bold tabular-nums">{formatQuantity(count)}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-bold">المساعدات المسجَّلة حسب النوع</h2>
        {donationsByCategory.length === 0 ? (
          <EmptyState title="لا توجد بيانات بعد" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {donationsByCategory.map((row) => (
              <Card key={`${row.slug}-${row.unit}`}>
                <CardContent className="flex items-center justify-between px-5">
                  <span className="text-sm">
                    {categoryEmoji[row.slug ?? ""] ?? "📦"} {row.name_ar}
                  </span>
                  <span className="font-bold tabular-nums">
                    {formatQuantity(Number(row.total_quantity))} {unitLabels[row.unit!]}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-bold">التوزيع الفعلي حسب النوع</h2>
        {distributionsByCategory.length === 0 ? (
          <EmptyState title="لا توجد بيانات بعد" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-3">
            {distributionsByCategory.map((row) => (
              <Card key={`${row.slug}-${row.unit}`}>
                <CardContent className="flex items-center justify-between px-5">
                  <span className="text-sm">
                    {categoryEmoji[row.slug ?? ""] ?? "📦"} {row.name_ar}
                  </span>
                  <span className="font-bold tabular-nums">
                    {formatQuantity(Number(row.total_quantity))} {unitLabels[row.unit!]}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
