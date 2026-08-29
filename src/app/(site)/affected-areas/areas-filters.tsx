"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { severityEmoji, severityLabels, type AffectedSeverity } from "@/lib/constants";
import { cn } from "@/lib/utils";

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-all",
        active
          ? "border-algeria-green bg-algeria-green font-semibold text-algeria-green-foreground"
          : "border-border bg-card hover:border-algeria-green/50 hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

export function AreasFilters({
  wilayas,
  severities,
}: {
  wilayas: string[];
  severities: AffectedSeverity[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentWilaya = searchParams.get("wilaya");
  const currentSeverity = searchParams.get("severity");
  const hasFilters = Boolean(currentWilaya || currentSeverity);

  function toggle(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) params.delete(key);
    else params.set(key, value);
    router.push(params.toString() ? `${pathname}?${params}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">الولاية</p>
        <div className="flex flex-wrap gap-2">
          {wilayas.map((w) => (
            <Chip key={w} active={currentWilaya === w} onClick={() => toggle("wilaya", w)}>
              {w}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold text-muted-foreground">الحالة</p>
        <div className="flex flex-wrap gap-2">
          {severities.map((s) => (
            <Chip key={s} active={currentSeverity === s} onClick={() => toggle("severity", s)}>
              {severityEmoji[s]} {severityLabels[s]}
            </Chip>
          ))}
        </div>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={() => router.push(pathname, { scroll: false })}>
          <X className="size-4" /> مسح الفلاتر
        </Button>
      )}
    </div>
  );
}
