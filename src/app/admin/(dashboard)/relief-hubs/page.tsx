import type { Metadata } from "next";
import { Phone, Clock, MapPinned, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { PointStatusBadge } from "@/components/shared/status-badge";
import { VerificationBadge } from "@/components/shared/verification-badge";
import { relativeTimeAr } from "@/lib/constants";
import { getAllReliefHubs } from "@/lib/data/admin";
import { CreateHubDialog } from "./create-hub-dialog";
import { HubActions } from "./hub-actions";

export const metadata: Metadata = { title: "مراكز الاستقبال", robots: { index: false } };

export default async function AdminReliefHubsPage() {
  const hubs = await getAllReliefHubs();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">مراكز الاستقبال</h1>
          <p className="text-sm text-muted-foreground">مراكز داخل جيجل، ولكل مركز مخزونه الخاص.</p>
        </div>
        <CreateHubDialog />
      </div>

      {hubs.length === 0 ? (
        <EmptyState title="لا توجد مراكز استقبال مسجَّلة بعد" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {hubs.map((h) => (
            <Card key={h.id}>
              <CardContent className="space-y-2 px-5">
                <p className="flex items-center gap-1.5 font-bold">
                  {h.is_shelter && <Home className="size-3.5 text-[#7c3aed]" />}
                  {h.name}
                </p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPinned className="size-3.5 shrink-0" />
                  {h.commune}، ولاية {h.wilaya}
                </p>
                {h.opening_hours && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-3.5 shrink-0" /> {h.opening_hours}
                  </p>
                )}
                {h.phone && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground" dir="ltr">
                    <Phone className="size-3.5 shrink-0" /> {h.phone}
                  </p>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <VerificationBadge level={h.verification_level} />
                  <PointStatusBadge status={h.status} />
                </div>
                <HubActions id={h.id} status={h.status} verificationLevel={h.verification_level} />
                <p className="text-xs text-muted-foreground">آخر تحديث: {relativeTimeAr(h.updated_at)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
