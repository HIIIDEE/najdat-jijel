import type { Metadata } from "next";
import { Phone, Clock, MapPinned } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PointStatusBadge } from "@/components/shared/status-badge";
import { VerificationBadge } from "@/components/shared/verification-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { getPublicCollectionPoints, getPublicReliefHubs } from "@/lib/data/public";
import { MapClient } from "./map-client";
import type { MapPoint } from "@/components/map/relief-map";

export const metadata: Metadata = {
  title: "خريطة الإغاثة",
  description: "نقاط التجميع ومراكز الاستقبال ومراكز الإيواء المعتمدة في حملة هبة الجزائر.",
};

export default async function MapPage() {
  const [collectionPoints, reliefHubs] = await Promise.all([
    getPublicCollectionPoints(),
    getPublicReliefHubs(),
  ]);

  const points: MapPoint[] = [
    ...collectionPoints.map((p) => ({
      id: p.id,
      kind: "collection_point" as const,
      name: p.name,
      wilaya: p.wilaya,
      commune: p.commune,
      address: p.address,
      lat: p.lat,
      lng: p.lng,
      phone: p.phone,
      openingHours: p.opening_hours,
      status: p.status,
      verificationLevel: p.verification_level,
      notes: p.notes,
    })),
    ...reliefHubs.map((h) => ({
      id: h.id,
      kind: h.is_shelter ? ("shelter" as const) : ("relief_hub" as const),
      name: h.name,
      wilaya: h.wilaya,
      commune: h.commune,
      address: h.address,
      lat: h.lat,
      lng: h.lng,
      phone: h.phone,
      openingHours: h.opening_hours,
      status: h.status,
      verificationLevel: h.verification_level,
      notes: h.notes,
    })),
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">خريطة الإغاثة</h1>
        <p className="mt-2 text-muted-foreground">
          لا تُعرض أي نقطة كنقطة رسمية إلا إذا كانت &quot;موثقة&quot; أو &quot;موثقة ميدانيًا&quot; — تحقّق دائمًا من
          شارة التحقق قبل التحرك.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3 text-sm">
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#00843D]" /> نقطة تجميع
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#1d4ed8]" /> مركز استقبال
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#7c3aed]" /> مركز إيواء
        </span>
      </div>

      <div className="h-[420px] overflow-hidden rounded-xl border border-border sm:h-[520px]">
        <MapClient points={points} />
      </div>

      <h2 className="mt-10 mb-4 text-xl font-bold">كل النقاط</h2>
      {points.length === 0 ? (
        <EmptyState
          title="لا توجد نقاط مسجَّلة بعد"
          description="سيتم عرض نقاط التجميع ومراكز الاستقبال هنا فور إضافتها من الإدارة."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p) => (
            <Card key={`${p.kind}-${p.id}`}>
              <CardContent className="space-y-2 px-5">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-bold">{p.name}</p>
                  <PointStatusBadge status={p.status as never} />
                </div>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPinned className="size-3.5 shrink-0" />
                  {p.address ?? `${p.commune}، ولاية ${p.wilaya}`}
                </p>
                {p.openingHours && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-3.5 shrink-0" />
                    {p.openingHours}
                  </p>
                )}
                {p.phone && (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground" dir="ltr">
                    <Phone className="size-3.5 shrink-0" />
                    {p.phone}
                  </p>
                )}
                <VerificationBadge level={p.verificationLevel as never} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
