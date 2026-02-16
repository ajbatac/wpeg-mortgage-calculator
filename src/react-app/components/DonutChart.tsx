import { formatCurrency } from "@/shared/formatters";

export default function DonutChart({ data }: { data: { label: string; value: number; color: string }[] }) {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    let currentOffset = 0;

    return (
        <div className="relative w-64 h-64 mx-auto mb-8 group">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {data.map((item, i) => {
                    const dashArray = (item.value / total) * circumference;
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
                            <title>{item.label}: {formatCurrency(item.value)}</title>
                        </circle>
                    );
                })}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Monthly</span>
                <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">{formatCurrency(total)}</span>
            </div>
        </div>
    );
}
