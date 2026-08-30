"use client";

import { Phone, Clock, MapPinned } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PointStatusBadge } from "@/components/shared/status-badge";
import { VerificationBadge } from "@/components/shared/verification-badge";
import { relativeTimeAr, pointStatusLabels, verificationLabels } from "@/lib/constants";
import { CategoryIcon } from "@/components/shared/category-icon";
import { AdminListFilter } from "@/components/admin/list-filter";
import { PointActions } from "./point-actions";
import type { Database } from "@/types/database";

type Point = Database["public"]["Tables"]["collection_points"]["Row"];

const STATUS_OPTIONS = Object.entries(pointStatusLabels).map(([value, label]) => ({ value, label }));
const VERIFICATION_OPTIONS = Object.entries(verificationLabels).map(([value, label]) => ({ value, label }));

export function CollectionPointsList({ points }: { points: Point[] }) {
  return (
    <AdminListFilter
      rows={points}
      searchPlaceholder="ابحث بالاسم، البلدية، أو الولاية..."
      searchMatch={(p, q) =>
        p.name.toLowerCase().includes(q) || p.commune.toLowerCase().includes(q) || p.wilaya.toLowerCase().includes(q)
      }
      filters={[
        { label: "الحالة", options: STATUS_OPTIONS, match: (p, v) => p.status === v },
        { label: "التحقق", options: VERIFICATION_OPTIONS, match: (p, v) => p.verification_level === v },
      ]}
      emptyTitle="لا توجد نقاط تجميع مسجَّلة بعد"
      listClassName="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      renderRow={(p) => (
        <Card key={p.id}>
          <CardContent className="space-y-2 px-5">
            <p className="font-bold">{p.name}</p>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPinned className="size-3.5 shrink-0" />
              {p.commune}، ولاية {p.wilaya}
            </p>
            {p.opening_hours && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="size-3.5 shrink-0" /> {p.opening_hours}
              </p>
            )}
            {p.phone && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground" dir="ltr">
                <Phone className="size-3.5 shrink-0" /> {p.phone}
              </p>
            )}
            {p.accepted_categories.length > 0 && (
              <p className="flex flex-wrap gap-1 text-sm">
                {p.accepted_categories.map((slug) => (
                  <CategoryIcon key={slug} slug={slug} className="size-4" />
                ))}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <VerificationBadge level={p.verification_level} />
              <PointStatusBadge status={p.status} />
            </div>
            <PointActions id={p.id} status={p.status} verificationLevel={p.verification_level} />
            <p className="text-xs text-muted-foreground">آخر تحديث: {relativeTimeAr(p.updated_at)}</p>
          </CardContent>
        </Card>
      )}
    />
  );
}
