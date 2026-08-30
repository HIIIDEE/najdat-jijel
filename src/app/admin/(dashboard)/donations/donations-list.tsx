"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatQuantity, relativeTimeAr, unitLabels, donationStatusLabels } from "@/lib/constants";
import { CategoryIcon } from "@/components/shared/category-icon";
import { AdminListFilter } from "@/components/admin/list-filter";
import { DonationStatusSelect } from "./donation-status-select";
import type { Database } from "@/types/database";

type Donation = Database["public"]["Tables"]["donations"]["Row"] & {
  donation_items: {
    quantity: number;
    unit: Database["public"]["Enums"]["unit_type"];
    categories: { slug: string; name_ar: string } | null;
  }[];
  collection_points: { name: string } | null;
};

const STATUS_OPTIONS = Object.entries(donationStatusLabels).map(([value, label]) => ({ value, label }));

export function DonationsList({ rows }: { rows: Donation[] }) {
  return (
    <AdminListFilter
      rows={rows}
      searchPlaceholder="ابحث بالاسم، الهاتف، أو الولاية..."
      searchMatch={(d, q) =>
        (d.donor_name ?? "").toLowerCase().includes(q) ||
        (d.donor_phone ?? "").includes(q) ||
        (d.current_wilaya ?? "").toLowerCase().includes(q) ||
        (d.current_commune ?? "").toLowerCase().includes(q)
      }
      filters={[{ label: "الحالة", options: STATUS_OPTIONS, match: (d, v) => d.status === v }]}
      emptyTitle="لا توجد مساعدات مسجَّلة بعد"
      renderRow={(d) => (
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
                  <CategoryIcon slug={it.categories?.slug} className="inline size-3.5" />{" "}
                  {formatQuantity(Number(it.quantity))} {unitLabels[it.unit]}
                </span>
              ))}
            </div>
            {d.collection_points?.name && (
              <p className="text-xs text-muted-foreground">نقطة التسليم المقترحة: {d.collection_points.name}</p>
            )}
            <p className="text-xs text-muted-foreground">{relativeTimeAr(d.created_at)}</p>
          </CardContent>
        </Card>
      )}
    />
  );
}
