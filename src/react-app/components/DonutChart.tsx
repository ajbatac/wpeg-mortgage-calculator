import { formatCurrency } from "@/shared/formatters";

export interface ChartSegment {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: ChartSegment[];
}

export default function DonutChart({ data }: DonutChartProps) {
  const total = data.reduce((acc, item) => acc + (Math.max(0, item.value) || 0), 0);
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let currentOffset = 0;

  return (
    <div className="relative w-64 h-64 mx-auto mb-8 group">
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
            stroke="#e5e7eb"
            strokeWidth="12"
            className="dark:stroke-gray-700"
          />
        ) : (
          data.map((item, i) => {
            const safeValue = Math.max(0, item.value);
            const dashArray = (safeValue / total) * circumference;
            const offset = currentOffset;
            currentOffset += dashArray;
            return (
              <circle
                key={i}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth="12"
                strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                strokeDashoffset={-offset}
                className="transition-all duration-700 ease-out hover:stroke-[14] cursor-pointer"
              >
                <title>
                  {item.label}: {formatCurrency(safeValue)}
                </title>
              </circle>
            );
          })
        )}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Monthly</span>
        <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}
