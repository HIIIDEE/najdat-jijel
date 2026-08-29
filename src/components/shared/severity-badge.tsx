import { cn } from "@/lib/utils";
import { severityIcon, severityLabels, type AffectedSeverity } from "@/lib/constants";

const styles: Record<AffectedSeverity, string> = {
  ravaged: "bg-priority-critical/10 text-priority-critical border-priority-critical/30",
  evacuated: "bg-priority-high/10 text-priority-high border-priority-high/30",
  threatened: "bg-priority-medium/10 text-priority-medium border-priority-medium/30",
  burning: "bg-priority-critical/5 text-priority-critical/90 border-priority-critical/20",
  unconfirmed: "bg-muted text-muted-foreground border-border",
};

export function SeverityBadge({
  severity,
  className,
}: {
  severity: AffectedSeverity;
  className?: string;
}) {
  const Icon = severityIcon[severity];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        styles[severity],
        className,
      )}
    >
      <Icon className="size-2.5" fill="currentColor" aria-hidden />
      {severityLabels[severity]}
    </span>
  );
}
