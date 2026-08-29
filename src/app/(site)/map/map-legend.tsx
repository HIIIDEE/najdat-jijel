const items = [
  { color: "#00843D", label: "نقطة تجميع" },
  { color: "#1d4ed8", label: "مركز استقبال" },
  { color: "#7c3aed", label: "مركز إيواء" },
];

export function MapLegend() {
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
