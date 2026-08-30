"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { PointCardData } from "@/components/shared/point-card";
import type { AvailableLocale } from "@/i18n/locales";

const ReliefMap = dynamic(() => import("@/components/map/relief-map").then((m) => m.ReliefMap), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export function MapClient({
  points,
  locale = "ar",
}: {
  points: PointCardData[];
  locale?: AvailableLocale;
}) {
  return <ReliefMap points={points} locale={locale} />;
}

