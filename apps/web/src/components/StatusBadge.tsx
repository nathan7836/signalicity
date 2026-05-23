import { STATUS_LABELS, STATUS_COLORS } from "@signalicity/shared";
import type { SignalementStatus } from "@signalicity/shared";

export default function StatusBadge({ status }: { status: SignalementStatus }) {
  const color = STATUS_COLORS[status] ?? "#6B7280";
  const label = STATUS_LABELS[status] ?? status;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: `${color}15`,
        color: color,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}
