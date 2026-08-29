import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { VerificationBadge } from "@/components/shared/verification-badge";
import { PointActions } from "../collection-points/point-actions";
import { HubActions } from "../relief-hubs/hub-actions";
import { BeneficiaryActions } from "../beneficiaries/beneficiary-actions";

export const metadata: Metadata = { title: "التحقق", robots: { index: false } };

export default async function AdminVerificationPage() {
  const supabase = await createClient();
  const pendingLevels = ["unverified", "pending"] as const;

  const [{ data: points }, { data: hubs }, { data: requests }] = await Promise.all([
    supabase.from("collection_points").select("*").in("verification_level", pendingLevels),
    supabase.from("relief_hubs").select("*").in("verification_level", pendingLevels),
    supabase.from("beneficiary_requests").select("*").in("verification_level", pendingLevels),
  ]);

  const totalPending = (points?.length ?? 0) + (hubs?.length ?? 0) + (requests?.length ?? 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">التحقق</h1>
        <p className="text-sm text-muted-foreground">
          {totalPending === 0
            ? "لا يوجد عناصر بانتظار التحقق حاليًا."
            : `${totalPending} عنصرًا بانتظار المراجعة والتحقق.`}
        </p>
      </div>

      <section>
        <h2 className="mb-3 font-bold">نقاط التجميع ({points?.length ?? 0})</h2>
        {!points || points.length === 0 ? (
          <EmptyState title="لا توجد نقاط بانتظار التحقق" />
        ) : (
          <div className="space-y-2">
            {points.map((p) => (
              <Card key={p.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5">
                  <div>
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.commune}، {p.wilaya}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <VerificationBadge level={p.verification_level} />
                    <PointActions id={p.id} status={p.status} verificationLevel={p.verification_level} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-bold">مراكز الاستقبال ({hubs?.length ?? 0})</h2>
        {!hubs || hubs.length === 0 ? (
          <EmptyState title="لا توجد مراكز بانتظار التحقق" />
        ) : (
          <div className="space-y-2">
            {hubs.map((h) => (
              <Card key={h.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5">
                  <div>
                    <p className="font-medium">{h.name}</p>
                    <p className="text-xs text-muted-foreground">{h.commune}، {h.wilaya}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <VerificationBadge level={h.verification_level} />
                    <HubActions id={h.id} status={h.status} verificationLevel={h.verification_level} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-bold">طلبات المساعدة ({requests?.length ?? 0})</h2>
        {!requests || requests.length === 0 ? (
          <EmptyState title="لا توجد طلبات بانتظار التحقق" />
        ) : (
          <div className="space-y-2">
            {requests.map((r) => (
              <Card key={r.id}>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5">
                  <div>
                    <p className="font-medium">{r.full_name}</p>
                    <p className="text-xs text-muted-foreground">{r.commune}، {r.wilaya}</p>
                  </div>
                  <BeneficiaryActions
                    id={r.id}
                    status={r.status}
                    priority={r.priority}
                    verificationLevel={r.verification_level}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
