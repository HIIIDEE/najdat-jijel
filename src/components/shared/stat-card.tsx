import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatQuantity } from "@/lib/constants";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  hint,
}: {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  tone?: "default" | "critical" | "success";
  hint?: string;
}) {
  const toneClasses = {
    default: "text-foreground",
    critical: "text-priority-critical",
    success: "text-algeria-green",
  } as const;

  return (
    <Card className="gap-2 py-5">
      <CardContent className="flex items-center justify-between gap-3 px-5">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className={cn("text-2xl font-bold tabular-nums", toneClasses[tone])}>
            {typeof value === "number" ? formatQuantity(value) : value}
          </p>
          {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
        </div>
        {Icon ? (
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted">
            <Icon className="size-5 text-muted-foreground" />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
