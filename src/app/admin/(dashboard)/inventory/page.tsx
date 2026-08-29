import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getAllCategories, getAllReliefHubs } from "@/lib/data/admin";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { categoryEmoji, formatQuantity, unitLabels } from "@/lib/constants";
import { RecordTransactionDialog } from "./record-transaction-dialog";
import { ThresholdInput } from "./threshold-input";

export const metadata: Metadata = { title: "المخزون", robots: { index: false } };

export default async function AdminInventoryPage() {
  const supabase = await createClient();
  const [{ data: items }, hubs, categories] = await Promise.all([
    supabase
      .from("inventory_items")
      .select("*, categories(slug, name_ar), relief_hubs(name)")
      .order("updated_at", { ascending: false }),
    getAllReliefHubs(),
    getAllCategories(),
  ]);

  const rows = items ?? [];
  const byHub = new Map<string, typeof rows>();
  for (const row of rows) {
    const list = byHub.get(row.hub_id) ?? [];
    list.push(row);
    byHub.set(row.hub_id, list);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">المخزون</h1>
          <p className="text-sm text-muted-foreground">
            كل تغيير في الكمية يُسجَّل كحركة، ويولّد احتياجًا تلقائيًا عند النزول تحت الحد الأدنى.
          </p>
        </div>
        <RecordTransactionDialog hubs={hubs} categories={categories} />
      </div>

      {hubs.length === 0 ? (
        <EmptyState title="لا توجد مراكز استقبال بعد" description="أضف مركز استقبال أولًا من قسم مراكز الاستقبال." />
      ) : (
        <div className="space-y-6">
          {hubs.map((hub) => {
            const hubItems = byHub.get(hub.id) ?? [];
            return (
              <div key={hub.id}>
                <h2 className="mb-2 font-bold">{hub.name}</h2>
                {hubItems.length === 0 ? (
                  <EmptyState title="لا يوجد مخزون مسجَّل في هذا المركز بعد" />
                ) : (
                  <Card>
                    <CardContent className="divide-y divide-border px-0">
                      {hubItems.map((item) => {
                        const low = item.min_threshold > 0 && Number(item.quantity) < item.min_threshold;
                        return (
                          <div
                            key={item.id}
                            className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
                          >
                            <span className="flex items-center gap-2 text-sm font-medium">
                              {categoryEmoji[item.categories?.slug ?? ""] ?? "📦"}
                              {item.categories?.name_ar}
                            </span>
                            <span className={low ? "text-sm font-bold text-priority-critical" : "text-sm font-bold"}>
                              {formatQuantity(Number(item.quantity))} {unitLabels[item.unit]}
                            </span>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              الحد الأدنى:
                              <ThresholdInput
                                hubId={item.hub_id}
                                categoryId={item.category_id}
                                defaultValue={item.min_threshold}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
