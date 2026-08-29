"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  priorityEmoji,
  priorityLabels,
  requestStatusLabels,
  type PriorityLevel,
  type RequestStatus,
} from "@/lib/constants";
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

export function BeneficiariesFilters({
  wilayas,
  statuses,
  priorities,
}: {
  wilayas: string[];
  statuses: RequestStatus[];
  priorities: PriorityLevel[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentWilaya = searchParams.get("wilaya");
  const currentStatus = searchParams.get("status");
  const currentPriority = searchParams.get("priority");
  const hasFilters = Boolean(currentWilaya || currentStatus || currentPriority);

  function toggle(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (params.get(key) === value) params.delete(key);
    else params.set(key, value);
    router.push(params.toString() ? `${pathname}?${params}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-1.5 text-xs font-semibold text-muted-foreground">الولاية</p>
        <div className="flex flex-wrap gap-2">
          {wilayas.map((w) => (
            <Chip key={w} active={currentWilaya === w} onClick={() => toggle("wilaya", w)}>
              {w}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-muted-foreground">الأولوية</p>
        <div className="flex flex-wrap gap-2">
          {priorities.map((p) => (
            <Chip key={p} active={currentPriority === p} onClick={() => toggle("priority", p)}>
              {priorityEmoji[p]} {priorityLabels[p]}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-semibold text-muted-foreground">حالة الطلب</p>
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => (
            <Chip key={s} active={currentStatus === s} onClick={() => toggle("status", s)}>
              {requestStatusLabels[s]}
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
