import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getAllCategories } from "@/lib/data/admin";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { categoryEmoji, formatQuantity, relativeTimeAr, unitLabels } from "@/lib/constants";
import { CreateNeedDialog } from "./create-need-dialog";
import { NeedActions } from "./need-actions";

export const metadata: Metadata = { title: "الاحتياجات", robots: { index: false } };

export default async function AdminNeedsPage() {
  const supabase = await createClient();
  const [{ data: needs }, categories] = await Promise.all([
    supabase
      .from("needs")
      .select("*, categories(slug, name_ar)")
      .order("created_at", { ascending: false }),
    getAllCategories(),
  ]);

  const rows = needs ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">الاحتياجات</h1>
          <p className="text-sm text-muted-foreground">
            الاحتياجات المُعلَّمة (auto) أُنشئت تلقائيًا من انخفاض المخزون تحت الحد الأدنى.
          </p>
        </div>
        <CreateNeedDialog categories={categories} />
      </div>

      {rows.length === 0 ? (
        <EmptyState title="لا توجد احتياجات مسجَّلة بعد" />
      ) : (
        <div className="space-y-3">
          {rows.map((n) => (
            <Card key={n.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span aria-hidden>{categoryEmoji[n.categories?.slug ?? ""] ?? "📦"}</span>
                    <p className="font-bold">{n.title || n.categories?.name_ar}</p>
                    {n.is_auto_generated && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                        auto
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {n.commune}، ولاية {n.wilaya} — {formatQuantity(Number(n.quantity_available))}/
                    {formatQuantity(Number(n.quantity_needed))} {unitLabels[n.unit]}
                  </p>
                  <p className="text-xs text-muted-foreground">آخر تحديث: {relativeTimeAr(n.updated_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <PriorityBadge priority={n.priority} />
                  <NeedActions id={n.id} priority={n.priority} status={n.status} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
