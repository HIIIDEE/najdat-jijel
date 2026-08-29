import { formatQuantity } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface BarChartItem {
  key: string;
  label: string;
  value: number;
  /** Full Tailwind class, e.g. "bg-priority-critical". Defaults to the brand color. */
  barClassName?: string;
}

/**
 * Horizontal bar chart for a single magnitude measure across categories.
 * One hue by default (no legend needed — see dataviz skill: "a single series
 * needs no legend box"). Pass barClassName per item only for a reserved status
 * palette (e.g. priority) where each bar already carries its own text label,
 * so color is never the sole identity channel. Pass the class as a literal
 * string at the call site (never build it dynamically) so Tailwind's scanner
 * can see it.
 */
export function HorizontalBarChart({
  items,
  maxItems = 8,
  otherLabel = "أخرى",
  sortByValue = true,
}: {
  items: BarChartItem[];
  maxItems?: number;
  otherLabel?: string;
  /** Set to false when `items` is already in a meaningful order (a status
   * pipeline, a severity scale) that shouldn't be overridden by count. */
  sortByValue?: boolean;
}) {
  const sorted = sortByValue ? [...items].sort((a, b) => b.value - a.value) : items;
  const shown = sorted.slice(0, maxItems);
  const rest = sorted.slice(maxItems);
  const restTotal = rest.reduce((sum, i) => sum + i.value, 0);
  const rows = restTotal > 0 ? [...shown, { key: "__other", label: otherLabel, value: restTotal }] : shown;
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="space-y-2.5">
      {rows.map((row) => (
        <div key={row.key} className="flex items-center gap-3">
          <span className="w-28 shrink-0 truncate text-sm text-muted-foreground sm:w-36">{row.label}</span>
          <div className="h-5 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-s-none rounded-e-[4px]", row.barClassName ?? "bg-algeria-green")}
              style={{ width: `${Math.max((row.value / max) * 100, 3)}%` }}
            />
          </div>
          <span className="w-10 shrink-0 text-end text-sm font-bold tabular-nums">
            {formatQuantity(row.value)}
          </span>
        </div>
      ))}
    </div>
  );
}
