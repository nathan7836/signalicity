import { SEVERITY_LABELS, SEVERITY_COLORS } from "@signalicity/shared";
import type { SeverityLevel } from "@signalicity/shared";

export default function SeverityBadge({ severity }: { severity: SeverityLevel }) {
  const color = SEVERITY_COLORS[severity] ?? "#6B7280";
  const label = SEVERITY_LABELS[severity] ?? severity;

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium"
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      {label}
    </span>
  );
}
