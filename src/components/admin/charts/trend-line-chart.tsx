export interface TrendPoint {
  /** ISO date (yyyy-mm-dd) */
  date: string;
  value: number;
  /** Arabic label shown in the hover tooltip and, for a few points, under the axis */
  dateLabel: string;
}

const WIDTH = 600;
const HEIGHT = 160;
const PAD_X = 8;
const PAD_TOP = 12;
const PAD_BOTTOM = 20;

/**
 * A single-series trend line with a soft area fill, on the brand hue.
 * Native <title> elements give every point a hover tooltip at zero JS cost —
 * appropriate for an internal reporting page rather than a public-facing one.
 */
export function TrendLineChart({ points }: { points: TrendPoint[] }) {
  if (points.length === 0) return null;

  const max = Math.max(...points.map((p) => p.value), 1);
  const plotWidth = WIDTH - PAD_X * 2;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const x = (i: number) => PAD_X + (points.length === 1 ? plotWidth / 2 : (i / (points.length - 1)) * plotWidth);
  const y = (v: number) => PAD_TOP + plotHeight - (v / max) * plotHeight;

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(p.value)}`).join(" ");
  const areaPath = `${linePath} L ${x(points.length - 1)} ${PAD_TOP + plotHeight} L ${x(0)} ${PAD_TOP + plotHeight} Z`;

  // Show only a handful of x-axis labels (start, middle, end) to avoid clutter.
  const labelIndexes = new Set(
    [0, Math.floor((points.length - 1) / 2), points.length - 1].filter((i) => i >= 0),
  );

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="w-full text-algeria-green"
      role="img"
      aria-label="عدد الطلبات الجديدة يوميًا خلال آخر 30 يومًا"
    >
      <line
        x1={PAD_X}
        y1={PAD_TOP + plotHeight}
        x2={WIDTH - PAD_X}
        y2={PAD_TOP + plotHeight}
        className="stroke-border"
        strokeWidth={1}
      />

      <path d={areaPath} fill="currentColor" opacity={0.1} />
      <path d={linePath} fill="none" stroke="currentColor" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

      {points.map((p, i) => (
        <g key={p.date}>
          <circle cx={x(i)} cy={y(p.value)} r={4} fill="currentColor" stroke="var(--card)" strokeWidth={2} />
          <title>
            {p.dateLabel} — {p.value} طلب
          </title>
        </g>
      ))}

      {points.map(
        (p, i) =>
          labelIndexes.has(i) && (
            <text
              key={p.date}
              x={x(i)}
              y={HEIGHT - 4}
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              {p.dateLabel}
            </text>
          ),
      )}
    </svg>
  );
}
