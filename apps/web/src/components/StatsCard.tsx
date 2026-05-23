import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export default function StatsCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = "#2563EB",
}: StatsCardProps) {
  return (
    <div className="card flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
        {trend && (
          <p
            className={`text-xs mt-2 font-medium ${
              trendUp ? "text-green-600" : "text-red-500"
            }`}
          >
            {trendUp ? "+" : ""}{trend}
          </p>
        )}
      </div>
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
    </div>
  );
}
