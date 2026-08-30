import type { LucideIcon } from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatQuantity } from "@/lib/constants";

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  hint,
  trend,
}: {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  tone?: "default" | "critical" | "success";
  hint?: string;
  /** فرق مقارنة بالفترة السابقة — موجب = ارتفاع (أخضر)، سالب = انخفاض (أحمر). */
  trend?: { delta: number; label: string };
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
          {trend ? (
            <p
              className={cn(
                "mt-1 flex items-center gap-1 text-xs font-semibold",
                trend.delta >= 0 ? "text-algeria-green" : "text-priority-critical",
              )}
            >
              {trend.delta >= 0 ? (
                <ArrowUp className="size-3" />
              ) : (
                <ArrowDown className="size-3" />
              )}
              {Math.abs(trend.delta)}% <span className="font-normal text-muted-foreground">{trend.label}</span>
            </p>
          ) : hint ? (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          ) : null}
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
