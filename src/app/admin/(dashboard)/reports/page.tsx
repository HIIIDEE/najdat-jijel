import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  categoryEmoji,
  formatQuantity,
  priorityEmoji,
  priorityLabels,
  requestStatusLabels,
  unitLabels,
  type PriorityLevel,
  type RequestStatus,
} from "@/lib/constants";
import { getStatDistributionsByCategory, getStatDonationsByCategory } from "@/lib/data/public";
import { HorizontalBarChart } from "@/components/admin/charts/horizontal-bar-chart";
import { TrendLineChart, type TrendPoint } from "@/components/admin/charts/trend-line-chart";

export const metadata: Metadata = { title: "التقارير", robots: { index: false } };

const priorityBarClass: Record<PriorityLevel, string> = {
  critical: "bg-priority-critical",
  high: "bg-priority-high",
  medium: "bg-priority-medium",
  low: "bg-priority-low",
};

const TREND_DAYS = 30;

export default async function AdminReportsPage() {
  const supabase = await createClient();
  const [donationsByCategory, distributionsByCategory, { data: requests }] = await Promise.all([
    getStatDonationsByCategory(),
    getStatDistributionsByCategory(),
    supabase.from("beneficiary_requests").select("status, commune, priority, created_at"),
  ]);

  const rows = requests ?? [];

  const byStatus = new Map<RequestStatus, number>();
  const byCommune = new Map<string, number>();
  const byPriority = new Map<PriorityLevel, number>();
  for (const r of rows) {
    byStatus.set(r.status, (byStatus.get(r.status) ?? 0) + 1);
    byCommune.set(r.commune, (byCommune.get(r.commune) ?? 0) + 1);
    byPriority.set(r.priority, (byPriority.get(r.priority) ?? 0) + 1);
  }

  // Daily count of new requests over the last 30 days, oldest first.
  const dayCounts = new Map<string, number>();
  for (const r of rows) {
    const day = r.created_at.slice(0, 10);
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1);
  }
  const trend: TrendPoint[] = Array.from({ length: TREND_DAYS }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (TREND_DAYS - 1 - i));
    const iso = date.toISOString().slice(0, 10);
    return {
      date: iso,
      value: dayCounts.get(iso) ?? 0,
      dateLabel: `${date.getDate()}/${date.getMonth() + 1}`,
    };
  });
  const hasTrendData = rows.length > 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">التقارير</h1>
        <p className="text-sm text-muted-foreground">تفصيل أدق من صفحة الشفافية العامة، لفريق التنسيق فقط.</p>
      </div>

      <section>
        <h2 className="mb-3 font-bold">الطلبات الجديدة يوميًا (آخر 30 يومًا)</h2>
        {!hasTrendData ? (
          <EmptyState title="لا توجد بيانات بعد" />
        ) : (
          <Card>
            <CardContent className="px-5">
              <TrendLineChart points={trend} />
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-bold">طلبات المساعدة حسب الأولوية</h2>
        {byPriority.size === 0 ? (
          <EmptyState title="لا توجد بيانات بعد" />
        ) : (
          <Card>
            <CardContent className="px-5">
              <HorizontalBarChart
                sortByValue={false}
                items={(Object.keys(priorityLabels) as PriorityLevel[])
                  .filter((p) => byPriority.has(p))
                  .map((p) => ({
                    key: p,
                    label: `${priorityEmoji[p]} ${priorityLabels[p]}`,
                    value: byPriority.get(p) ?? 0,
                    barClassName: priorityBarClass[p],
                  }))}
              />
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-bold">طلبات المساعدة حسب الحالة</h2>
        {byStatus.size === 0 ? (
          <EmptyState title="لا توجد بيانات بعد" />
        ) : (
          <Card>
            <CardContent className="px-5">
              <HorizontalBarChart
                sortByValue={false}
                items={(Object.keys(requestStatusLabels) as RequestStatus[])
                  .filter((s) => byStatus.has(s))
                  .map((s) => ({ key: s, label: requestStatusLabels[s], value: byStatus.get(s) ?? 0 }))}
              />
            </CardContent>
          </Card>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-bold">طلبات المساعدة حسب البلدية</h2>
        {byCommune.size === 0 ? (
          <EmptyState title="لا توجد بيانات بعد" />
        ) : (
          <Card>
            <CardContent className="px-5">
              <HorizontalBarChart
                items={[...byCommune.entries()].map(([commune, count]) => ({
                  key: commune,
                  label: commune,
                  value: count,
                }))}
                maxItems={10}
              />
            </CardContent>
          </Card>
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
