import type { AvailableLocale } from "@/i18n/locales";

export function MapLegend({ locale = "ar" }: { locale?: AvailableLocale }) {
  const isFr = locale === "fr";
  const items = [
    { color: "#00843D", label: isFr ? "Point de collecte" : "نقطة تجميع" },
    { color: "#1d4ed8", label: isFr ? "Centre d'accueil" : "مركز استقبال" },
    { color: "#7c3aed", label: isFr ? "Centre d'hébergement" : "مركز إيواء" },
  ];

  return (
    <div className="mb-3 flex flex-wrap justify-center gap-3 text-sm">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5">
          <span className="size-3 rounded-full" style={{ background: i.color }} />
          {i.label}
        </span>
      ))}
    </div>
  );
}
