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

const nameByKind: Record<PointCardData["kind"], string> = {
  collection_point: "نقطة تجميع",
  relief_hub: "مركز استقبال",
  shelter: "مركز إيواء",
};

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  );
}

// أيقونات SVG مضمَّنة يدويًا (نسخ دقيق لمسارات Lucide) — الـ popup هنا HTML خام وليس JSX،
// فلا يمكن استخدام مكوّنات lucide-react مباشرة فيه.
function dotSvg(color: string) {
  return `<svg width="10" height="10" viewBox="0 0 24 24" style="display:inline-block;vertical-align:-1px"><circle cx="12" cy="12" r="10" fill="${color}"/></svg>`;
}
function clockSvg(color = "currentColor") {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`;
}
function compassSvg(color = "currentColor") {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px"><circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"/></svg>`;
}
function phoneSvg(color = "currentColor") {
  return `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:-2px"><path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/></svg>`;
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
      minZoom: 5,
      // يقتصر عرض الخريطة على شمال الجزائر (نطاق عمل المنصة الحالي والمتوقع)
      // لتفادي الاعتماد على رسم الحدود المتنازع عليها جنوب غرب المغرب في بلاطات
      // OpenStreetMap العامة، والتي لا تتحكم فيها هذه المنصة.
      maxBounds: [
        [-2.5, 28],
        [12, 39],
      ],
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
            <p style="margin:0 0 4px;font-size:11px;color:#666">${dotSvg(colorByKind[point.kind])} ${nameByKind[point.kind]}</p>
            <p style="margin:0 0 3px;font-weight:700;font-size:14px">${esc(point.name)}</p>
            <p style="margin:0 0 3px;color:#666;font-size:12px">${esc(point.commune)}، ولاية ${esc(point.wilaya)}</p>
            ${point.address ? `<p style="margin:0 0 3px;font-size:12px">${esc(point.address)}</p>` : ""}
            ${point.openingHours ? `<p style="margin:0 0 3px;font-size:12px;color:#666">${clockSvg("#666")} ${esc(point.openingHours)}</p>` : ""}
            <p style="margin:4px 0 0;font-size:12px">الحالة: ${pointStatusLabels[point.status] ?? point.status}</p>
            <p style="margin:2px 0 8px;font-size:12px">التحقق: ${verificationLabels[point.verificationLevel] ?? point.verificationLevel}</p>
            <div style="display:flex;gap:6px">
              ${
                tel
                  ? `<a href="tel:${esc(tel)}" style="flex:1;text-align:center;background:#00843D;color:#fff;
                       padding:7px 10px;border-radius:8px;text-decoration:none;font-size:12px;font-weight:600">${phoneSvg("#fff")} اتصال</a>`
                  : ""
              }
              <a href="${dir}" target="_blank" rel="noopener noreferrer"
                 style="flex:1;text-align:center;border:1px solid #ddd;color:#111;padding:7px 10px;
                        border-radius:8px;text-decoration:none;font-size:12px;font-weight:600">${compassSvg("#111")} الاتجاهات</a>
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
