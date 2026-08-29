import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { categoryEmoji, formatQuantity, relativeTimeAr, unitLabels } from "@/lib/constants";
import { DonationStatusSelect } from "./donation-status-select";

export const metadata: Metadata = { title: "المساعدات", robots: { index: false } };

export default async function AdminDonationsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("donations")
    .select("*, donation_items(quantity, unit, categories(slug, name_ar)), collection_points(name)")
    .order("created_at", { ascending: false });

  const rows = data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">المساعدات المسجَّلة</h1>
        <p className="text-sm text-muted-foreground">ما سجّله المتبرعون من مواد، وحالة كل عملية.</p>
      </div>

      {rows.length === 0 ? (
        <EmptyState title="لا توجد مساعدات مسجَّلة بعد" />
      ) : (
        <div className="space-y-3">
          {rows.map((d) => (
            <Card key={d.id}>
              <CardContent className="space-y-2 px-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold">{d.donor_name}</p>
                    <p className="text-sm text-muted-foreground" dir="ltr">
                      {d.donor_phone}
                    </p>
                  </div>
                  <DonationStatusSelect id={d.id} status={d.status} />
                </div>
                <p className="text-sm text-muted-foreground">
                  {d.current_commune ? `${d.current_commune}، ` : ""}
                  ولاية {d.current_wilaya}
                  {d.needs_transport ? " · يحتاج نقلًا" : ""}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {d.donation_items?.map((it, i) => (
                    <span key={i} className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {categoryEmoji[it.categories?.slug ?? ""] ?? "📦"} {formatQuantity(Number(it.quantity))}{" "}
                      {unitLabels[it.unit]}
                    </span>
                  ))}
                </div>
                {d.collection_points?.name && (
                  <p className="text-xs text-muted-foreground">نقطة التسليم المقترحة: {d.collection_points.name}</p>
                )}
                <p className="text-xs text-muted-foreground">{relativeTimeAr(d.created_at)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
