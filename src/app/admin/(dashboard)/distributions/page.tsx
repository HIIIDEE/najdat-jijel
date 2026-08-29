import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getAllCategories, getAllReliefHubs } from "@/lib/data/admin";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { categoryEmoji, formatQuantity, unitLabels } from "@/lib/constants";
import { CreateDistributionDialog } from "./create-distribution-dialog";

export const metadata: Metadata = { title: "عمليات التوزيع", robots: { index: false } };

export default async function AdminDistributionsPage() {
  const supabase = await createClient();
  const [{ data }, hubs, categories] = await Promise.all([
    supabase
      .from("distributions")
      .select("*, categories(slug, name_ar), relief_hubs(name)")
      .order("distribution_date", { ascending: false }),
    getAllReliefHubs(),
    getAllCategories(),
  ]);

  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">عمليات التوزيع</h1>
          <p className="text-sm text-muted-foreground">كل توزيع يخصم تلقائيًا من مخزون المركز.</p>
        </div>
        <CreateDistributionDialog hubs={hubs} categories={categories} />
      </div>

      {rows.length === 0 ? (
        <EmptyState title="لا توجد عمليات توزيع مسجَّلة بعد" />
      ) : (
        <div className="space-y-3">
          {rows.map((d) => (
            <Card key={d.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5">
                <div>
                  <p className="font-bold">
                    {categoryEmoji[d.categories?.slug ?? ""] ?? "📦"} {formatQuantity(Number(d.quantity))}{" "}
                    {unitLabels[d.unit]} — {d.categories?.name_ar}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {d.relief_hubs?.name} · {d.beneficiary_family_count} أسرة مستفيدة
                  </p>
                  <p className="text-xs text-muted-foreground">المسؤول: {d.responsible_name}</p>
                </div>
                <span className="text-xs text-muted-foreground">{d.distribution_date}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
