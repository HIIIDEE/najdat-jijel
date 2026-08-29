"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { pointStatusLabels, verificationLabels } from "@/lib/constants";

export interface MapPoint {
  id: string;
  kind: "collection_point" | "relief_hub" | "shelter";
  name: string;
  wilaya: string;
  commune: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  openingHours: string | null;
  status: string;
  verificationLevel: string;
  notes: string | null;
}

const colorByKind: Record<MapPoint["kind"], string> = {
  collection_point: "#00843D",
  relief_hub: "#1d4ed8",
  shelter: "#7c3aed",
};

const labelByKind: Record<MapPoint["kind"], string> = {
  collection_point: "🟢 نقطة تجميع",
  relief_hub: "🔵 مركز استقبال",
  shelter: "🟣 مركز إيواء",
};

export function ReliefMap({ points }: { points: MapPoint[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
          },
        },
        layers: [{ id: "osm", type: "raster", source: "osm" }],
      },
      center: [5.766, 36.819],
      zoom: 8,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-left");
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const markers: maplibregl.Marker[] = [];

    const addMarkers = () => {
      for (const point of points) {
        if (point.lat === null || point.lng === null) continue;

        const el = document.createElement("div");
        el.style.width = "18px";
        el.style.height = "18px";
        el.style.borderRadius = "50%";
        el.style.border = "2px solid white";
        el.style.boxShadow = "0 1px 4px rgba(0,0,0,.4)";
        el.style.background = colorByKind[point.kind];
        el.style.cursor = "pointer";

        const popupHtml = `
          <div style="font-family: inherit; direction: rtl; text-align: right; min-width: 180px;">
            <p style="font-weight: 700; margin: 0 0 4px;">${labelByKind[point.kind]}</p>
            <p style="font-weight: 700; margin: 0 0 2px;">${point.name}</p>
            <p style="margin: 0 0 2px; color: #666; font-size: 12px;">${point.commune}، ولاية ${point.wilaya}</p>
            ${point.address ? `<p style="margin: 0 0 2px; font-size: 12px;">${point.address}</p>` : ""}
            ${point.openingHours ? `<p style="margin: 0 0 2px; font-size: 12px;">🕐 ${point.openingHours}</p>` : ""}
            ${point.phone ? `<p style="margin: 0 0 2px; font-size: 12px;" dir="ltr">📞 ${point.phone}</p>` : ""}
            <p style="margin: 4px 0 0; font-size: 12px;">الحالة: ${pointStatusLabels[point.status as keyof typeof pointStatusLabels] ?? point.status}</p>
            <p style="margin: 2px 0 0; font-size: 12px;">التحقق: ${verificationLabels[point.verificationLevel as keyof typeof verificationLabels] ?? point.verificationLevel}</p>
          </div>
        `;

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([point.lng, point.lat])
          .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(popupHtml))
          .addTo(map);

        markers.push(marker);
      }
    };

    if (map.isStyleLoaded()) {
      addMarkers();
    } else {
      map.once("load", addMarkers);
    }

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [points]);

  return <div ref={containerRef} className="h-full w-full" />;
}
