"use client";

import { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { pointStatusLabels, verificationLabels } from "@/lib/constants";
import type { PointCardData } from "@/components/shared/point-card";

const colorByKind: Record<PointCardData["kind"], string> = {
  collection_point: "#00843D",
  relief_hub: "#1d4ed8",
  shelter: "#7c3aed",
};

const labelByKind: Record<PointCardData["kind"], string> = {
  collection_point: "🟢 نقطة تجميع",
  relief_hub: "🔵 مركز استقبال",
  shelter: "🟣 مركز إيواء",
};

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

export function ReliefMap({ points }: { points: PointCardData[] }) {
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
      center: [5.9, 36.75],
      zoom: 8.5,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-left");
    map.addControl(new maplibregl.GeolocateControl({ trackUserLocation: false }), "top-left");
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
      const bounds = new maplibregl.LngLatBounds();
      let any = false;

      for (const point of points) {
        if (point.lat === null || point.lng === null) continue;
        any = true;
        bounds.extend([point.lng, point.lat]);

        const el = document.createElement("div");
        el.style.cssText = `width:20px;height:20px;border-radius:50%;border:2.5px solid #fff;
          box-shadow:0 1px 5px rgba(0,0,0,.45);cursor:pointer;background:${colorByKind[point.kind]};
          transition:transform .15s`;
        el.onmouseenter = () => (el.style.transform = "scale(1.25)");
        el.onmouseleave = () => (el.style.transform = "scale(1)");

        const tel = point.phone ? point.phone.replace(/\s/g, "") : null;
        const dir = `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;

        const popupHtml = `
          <div style="font-family:inherit;direction:rtl;text-align:right;min-width:210px">
            <p style="margin:0 0 4px;font-size:11px;color:#666">${labelByKind[point.kind]}</p>
            <p style="margin:0 0 3px;font-weight:700;font-size:14px">${esc(point.name)}</p>
            <p style="margin:0 0 3px;color:#666;font-size:12px">${esc(point.commune)}، ولاية ${esc(point.wilaya)}</p>
            ${point.address ? `<p style="margin:0 0 3px;font-size:12px">${esc(point.address)}</p>` : ""}
            ${point.openingHours ? `<p style="margin:0 0 3px;font-size:12px">🕐 ${esc(point.openingHours)}</p>` : ""}
            <p style="margin:4px 0 0;font-size:12px">الحالة: ${pointStatusLabels[point.status] ?? point.status}</p>
            <p style="margin:2px 0 8px;font-size:12px">التحقق: ${verificationLabels[point.verificationLevel] ?? point.verificationLevel}</p>
            <div style="display:flex;gap:6px">
              ${
                tel
                  ? `<a href="tel:${esc(tel)}" style="flex:1;text-align:center;background:#00843D;color:#fff;
                       padding:7px 10px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600">📞 اتصال</a>`
                  : ""
              }
              <a href="${dir}" target="_blank" rel="noopener noreferrer"
                 style="flex:1;text-align:center;border:1px solid #ddd;color:#111;padding:7px 10px;
                        border-radius:8px;text-decoration:none;font-size:12px;font-weight:600">🧭 الاتجاهات</a>
            </div>
          </div>`;

        markers.push(
          new maplibregl.Marker({ element: el })
            .setLngLat([point.lng, point.lat])
            .setPopup(new maplibregl.Popup({ offset: 14, maxWidth: "280px" }).setHTML(popupHtml))
            .addTo(map),
        );
      }

      if (any) map.fitBounds(bounds, { padding: 60, maxZoom: 11, duration: 600 });
    };

    if (map.isStyleLoaded()) addMarkers();
    else map.once("load", addMarkers);

    return () => {
      markers.forEach((m) => m.remove());
    };
  }, [points]);

  return <div ref={containerRef} className="h-full w-full" />;
}
