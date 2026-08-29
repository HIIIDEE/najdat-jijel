import { cn } from "@/lib/utils";
import { pointStatusLabels, type PointStatus } from "@/lib/constants";

const styles: Record<PointStatus, string> = {
  open: "bg-status-open/10 text-status-open border-status-open/30",
  full: "bg-status-full/10 text-status-full border-status-full/30",
  paused: "bg-status-paused/10 text-status-paused border-status-paused/30",
  closed: "bg-status-closed/10 text-status-closed border-status-closed/30",
};

const dotStyles: Record<PointStatus, string> = {
  open: "bg-status-open",
  full: "bg-status-full",
  paused: "bg-status-paused",
  closed: "bg-status-closed",
};

export function PointStatusBadge({ status, className }: { status: PointStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        styles[status],
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", dotStyles[status])} aria-hidden />
      {pointStatusLabels[status]}
    </span>
  );
}
