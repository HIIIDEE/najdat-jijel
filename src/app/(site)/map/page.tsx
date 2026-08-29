import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { PointCard, type PointCardData } from "@/components/shared/point-card";
import { getPublicCollectionPoints, getPublicReliefHubs } from "@/lib/data/public";
import { MapClient } from "./map-client";
import { MapLegend } from "./map-legend";

export const metadata: Metadata = {
  title: "خريطة الإغاثة",
  description: "نقاط التجميع ومراكز الاستقبال ومراكز الإيواء المعتمدة في حملة هبة الجزائر.",
};

export default async function MapPage() {
  const [collectionPoints, reliefHubs] = await Promise.all([
    getPublicCollectionPoints(),
    getPublicReliefHubs(),
  ]);

  const points: PointCardData[] = [
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
      capacityNote: p.capacity_note,
      acceptedCategories: p.accepted_categories ?? [],
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
      capacityNote: h.capacity_note,
      status: h.status,
      verificationLevel: h.verification_level,
      notes: h.notes,
    })),
  ];

  const shelters = points.filter((p) => p.kind === "shelter").length;
  const hubs = points.filter((p) => p.kind === "relief_hub").length;
  const collect = points.filter((p) => p.kind === "collection_point").length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">خريطة الإغاثة</h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          تحقّق دائمًا من شارة التحقق قبل التحرك. اضغط على أي نقطة للاتصال أو فتح الاتجاهات.
        </p>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 sm:max-w-md sm:mx-auto">
        <Card className="py-3">
          <CardContent className="px-3 text-center">
            <p className="text-xl font-bold tabular-nums text-[#00843D]">{collect}</p>
            <p className="text-[11px] text-muted-foreground">نقطة تجميع</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-3 text-center">
            <p className="text-xl font-bold tabular-nums text-[#1d4ed8]">{hubs}</p>
            <p className="text-[11px] text-muted-foreground">مركز استقبال</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-3 text-center">
            <p className="text-xl font-bold tabular-nums text-[#7c3aed]">{shelters}</p>
            <p className="text-[11px] text-muted-foreground">مركز إيواء</p>
          </CardContent>
        </Card>
      </div>

      <MapLegend />

      <div className="h-[420px] overflow-hidden rounded-xl border border-border sm:h-[520px]">
        <MapClient points={points} />
      </div>

      <h2 className="mt-10 mb-4 text-xl font-bold">كل النقاط ({points.length})</h2>
      {points.length === 0 ? (
        <EmptyState
          title="لا توجد نقاط مسجَّلة بعد"
          description="سيتم عرض نقاط التجميع ومراكز الاستقبال هنا فور إضافتها من الإدارة."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p) => (
            <PointCard key={`${p.kind}-${p.id}`} point={p} />
          ))}
        </div>
      )}
    </div>
  );
}
