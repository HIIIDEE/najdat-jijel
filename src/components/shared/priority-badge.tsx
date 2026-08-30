import { cn } from "@/lib/utils";
import { priorityIcon, getPriorityLabel, type PriorityLevel } from "@/lib/constants";
import type { AvailableLocale } from "@/i18n/locales";

const styles: Record<PriorityLevel, string> = {
  critical: "bg-priority-critical/10 text-priority-critical border-priority-critical/30",
  high: "bg-priority-high/10 text-priority-high border-priority-high/30",
  medium: "bg-priority-medium/10 text-priority-medium border-priority-medium/30",
  low: "bg-priority-low/10 text-priority-low border-priority-low/30",
};

export function PriorityBadge({
  priority,
  locale = "ar",
  label,
  className,
}: {
  priority: PriorityLevel;
  locale?: AvailableLocale;
  label?: string;
  className?: string;
}) {
  const Icon = priorityIcon[priority];
  const displayLabel = label ?? getPriorityLabel(priority, locale);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        styles[priority],
        className,
      )}
    >
      <Icon className="size-2.5" fill="currentColor" aria-hidden />
      {displayLabel}
    </span>
  );
}
