"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import type { MapPoint } from "@/components/map/relief-map";

const ReliefMap = dynamic(() => import("@/components/map/relief-map").then((m) => m.ReliefMap), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

export function MapClient({ points }: { points: MapPoint[] }) {
  return <ReliefMap points={points} />;
}
