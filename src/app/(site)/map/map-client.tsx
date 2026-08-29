"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { PointCardData } from "@/components/shared/point-card";

const ReliefMap = dynamic(() => import("@/components/map/relief-map").then((m) => m.ReliefMap), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export function MapClient({ points }: { points: PointCardData[] }) {
  return <ReliefMap points={points} />;
}
