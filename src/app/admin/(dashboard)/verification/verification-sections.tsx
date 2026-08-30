"use client";

import { Card, CardContent } from "@/components/ui/card";
import { VerificationBadge } from "@/components/shared/verification-badge";
import { AdminListFilter } from "@/components/admin/list-filter";
import { PointActions } from "../collection-points/point-actions";
import { HubActions } from "../relief-hubs/hub-actions";
import { BeneficiaryActions } from "../beneficiaries/beneficiary-actions";
import type { Database } from "@/types/database";

type Point = Database["public"]["Tables"]["collection_points"]["Row"];
type Hub = Database["public"]["Tables"]["relief_hubs"]["Row"];
type Request = Database["public"]["Tables"]["beneficiary_requests"]["Row"];

export function PointsVerificationList({ points }: { points: Point[] }) {
  return (
    <AdminListFilter
      rows={points}
      searchPlaceholder="ابحث بالاسم، البلدية، أو الولاية..."
      searchMatch={(p, q) =>
        p.name.toLowerCase().includes(q) || p.commune.toLowerCase().includes(q) || p.wilaya.toLowerCase().includes(q)
      }
      emptyTitle="لا توجد نقاط بانتظار التحقق"
      listClassName="space-y-2"
      renderRow={(p) => (
        <Card key={p.id}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5">
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.commune}، {p.wilaya}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <VerificationBadge level={p.verification_level} />
              <PointActions id={p.id} status={p.status} verificationLevel={p.verification_level} />
            </div>
          </CardContent>
        </Card>
      )}
    />
  );
}

export function HubsVerificationList({ hubs }: { hubs: Hub[] }) {
  return (
    <AdminListFilter
      rows={hubs}
      searchPlaceholder="ابحث بالاسم، البلدية، أو الولاية..."
      searchMatch={(h, q) =>
        h.name.toLowerCase().includes(q) || h.commune.toLowerCase().includes(q) || h.wilaya.toLowerCase().includes(q)
      }
      emptyTitle="لا توجد مراكز بانتظار التحقق"
      listClassName="space-y-2"
      renderRow={(h) => (
        <Card key={h.id}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5">
            <div>
              <p className="font-medium">{h.name}</p>
              <p className="text-xs text-muted-foreground">
                {h.commune}، {h.wilaya}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <VerificationBadge level={h.verification_level} />
              <HubActions id={h.id} status={h.status} verificationLevel={h.verification_level} />
            </div>
          </CardContent>
        </Card>
      )}
    />
  );
}

export function RequestsVerificationList({ requests }: { requests: Request[] }) {
  return (
    <AdminListFilter
      rows={requests}
      searchPlaceholder="ابحث بالاسم، البلدية، أو الولاية..."
      searchMatch={(r, q) =>
        r.full_name.toLowerCase().includes(q) || r.commune.toLowerCase().includes(q) || r.wilaya.toLowerCase().includes(q)
      }
      emptyTitle="لا توجد طلبات بانتظار التحقق"
      listClassName="space-y-2"
      renderRow={(r) => (
        <Card key={r.id}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 px-5">
            <div>
              <p className="font-medium">{r.full_name}</p>
              <p className="text-xs text-muted-foreground">
                {r.commune}، {r.wilaya}
              </p>
            </div>
            <BeneficiaryActions
              id={r.id}
              status={r.status}
              priority={r.priority}
              verificationLevel={r.verification_level}
            />
          </CardContent>
        </Card>
      )}
    />
  );
}
