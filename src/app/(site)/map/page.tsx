import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { DataUnavailable } from "@/components/shared/data-unavailable";
import { PointCard, type PointCardData } from "@/components/shared/point-card";
import { getPublicCollectionPoints, getPublicReliefHubs } from "@/lib/data/public";
import { MapClient } from "./map-client";
import { MapLegend } from "./map-legend";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  return {
    title: t.nav.map,
    description: t.map.pageSubtitle,
  };
}

export default async function MapPage() {
  const locale = await getLocale();
  const t = await getDictionary(locale);
  const isFr = locale === "fr";

  const [collectionPointsResult, reliefHubsResult] = await Promise.all([
    getPublicCollectionPoints(),
    getPublicReliefHubs(),
  ]);

  // يكفي فشل أحد الاستعلامين حتى تكون الخريطة ناقصة: مركز إيواء غائب عن
  // القائمة أخطر من قائمة غير مكتملة معلَنة.
  const pointsUnavailable = collectionPointsResult.failed || reliefHubsResult.failed;

  const points: PointCardData[] = [
    ...collectionPointsResult.data.map((p) => ({
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
    ...reliefHubsResult.data.map((h) => ({
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

  // على قائمة فارغة لا نعرف سببها، لا عدّاد ولا قائمة: «كل النقاط (0)» تُقرأ
  // كخبر مؤكَّد بأن لا نقاط، وهو بالضبط ما لا نعرفه في هذه الحالة.
  const showPointsList = points.length > 0 || !pointsUnavailable;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold">{t.map.pageTitle}</h1>
        <p className="mx-auto mt-2 max-w-2xl text-muted-foreground">
          {t.map.pageSubtitle}
        </p>
      </div>

      {pointsUnavailable ? <DataUnavailable className="mb-6" /> : null}

      <div className="mb-4 grid grid-cols-3 gap-2 sm:max-w-md sm:mx-auto">
        <Card className="py-3">
          <CardContent className="px-3 text-center">
            <p className="text-xl font-bold tabular-nums text-[#00843D]">{collect}</p>
            <p className="text-xs font-medium text-muted-foreground">{t.map.legendCollection}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-3 text-center">
            <p className="text-xl font-bold tabular-nums text-[#1d4ed8]">{hubs}</p>
            <p className="text-xs font-medium text-muted-foreground">{t.map.legendRelief}</p>
          </CardContent>
        </Card>
        <Card className="py-3">
          <CardContent className="px-3 text-center">
            <p className="text-xl font-bold tabular-nums text-[#7c3aed]">{shelters}</p>
            <p className="text-xs font-medium text-muted-foreground">{t.map.legendShelter}</p>
          </CardContent>
        </Card>
      </div>

      <MapLegend locale={locale} />

      <div className="h-[420px] overflow-hidden rounded-xl border border-border sm:h-[520px]">
        <MapClient points={points} locale={locale} />
      </div>

      {showPointsList ? (
        <>
          <h2 className="mt-10 mb-4 text-xl font-bold">
            {isFr ? `Tous les points (${points.length})` : `كل النقاط (${points.length})`}
          </h2>
          {points.length === 0 ? (
            <EmptyState
              title={isFr ? "Aucun point enregistré pour le moment" : "لا توجد نقاط مسجَّلة بعد"}
              description={
                isFr
                  ? "Les points de collecte et centres d'accueil apparaîtront ici dès leur validation."
                  : "سيتم عرض نقاط التجميع ومراكز الاستقبال هنا فور إضافتها من الإدارة."
              }
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {points.map((p) => (
                <PointCard key={`${p.kind}-${p.id}`} point={p} locale={locale} />
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
