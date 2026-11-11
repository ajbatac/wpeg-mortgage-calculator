import { formatCurrency } from "@/shared/formatters";

export interface ChartSegment {
  label: string;
  value: number;
  color?: string;
}

export interface DonutChartProps {
  data: ChartSegment[];
}

const DEFAULT_THEME_COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--accent))",
  "hsl(var(--primary) / 0.6)",
  "hsl(var(--foreground) / 0.4)",
];

export default function DonutChart({ data }: DonutChartProps) {
  const total = data.reduce((acc, item) => acc + (Math.max(0, item.value) || 0), 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <figure className="relative w-60 h-60 mx-auto my-4 group">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full transform -rotate-90"
        aria-label="Monthly payment distribution breakdown"
        role="img"
      >
        {total <= 0 ? (
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="11"
            className="text-border"
          />
        ) : (
          data.map((item, i) => {
            const safeValue = Math.max(0, item.value);
            const dashArray = (safeValue / total) * circumference;
            const offset = currentOffset;
            currentOffset += dashArray;
            const strokeColor = item.color || DEFAULT_THEME_COLORS[i % DEFAULT_THEME_COLORS.length];

            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={strokeColor}
                strokeWidth="11"
                strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                strokeDashoffset={-offset}
                className="transition-all duration-500 ease-out hover:stroke-[13] cursor-pointer"
              >
                <title>
                  {item.label}: {formatCurrency(safeValue)}
                </title>
              </circle>
            );
          })
        )}
      </svg>

      <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none text-center">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Monthly Total</span>
        <span className="text-2xl font-bold font-serif text-foreground mt-0.5">
          {formatCurrency(total)}
        </span>
      </div>

      <figcaption className="sr-only">
        Monthly expense distribution: {data.map((d) => `${d.label}: ${formatCurrency(d.value)}`).join(", ")}
      </figcaption>
    </figure>
  );
}
