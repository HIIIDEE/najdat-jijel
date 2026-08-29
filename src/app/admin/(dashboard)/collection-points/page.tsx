import type { Metadata } from "next";
import { Phone, Clock, MapPinned } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { PointStatusBadge } from "@/components/shared/status-badge";
import { VerificationBadge } from "@/components/shared/verification-badge";
import { categoryEmoji, relativeTimeAr } from "@/lib/constants";
import { getAllCategories, getAllCollectionPoints } from "@/lib/data/admin";
import { CreatePointDialog } from "./create-point-dialog";
import { PointActions } from "./point-actions";

export const metadata: Metadata = { title: "نقاط التجميع", robots: { index: false } };

export default async function AdminCollectionPointsPage() {
  const [points, categories] = await Promise.all([getAllCollectionPoints(), getAllCategories()]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">نقاط التجميع</h1>
          <p className="text-sm text-muted-foreground">
            حيث يسلّم المتبرعون مساعداتهم قبل نقلها إلى ولايات الحملة.
          </p>
        </div>
        <CreatePointDialog categories={categories} />
      </div>

      {points.length === 0 ? (
        <EmptyState title="لا توجد نقاط تجميع مسجَّلة بعد" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p) => (
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
                      <span key={slug}>{categoryEmoji[slug] ?? "📦"}</span>
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
          ))}
        </div>
      )}
    </div>
  );
}
