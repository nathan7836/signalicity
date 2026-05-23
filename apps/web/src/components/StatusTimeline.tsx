import type { StatusHistory } from "@signalicity/shared";
import { STATUS_LABELS, STATUS_COLORS } from "@signalicity/shared";
import { Check, Clock, ArrowRight } from "lucide-react";

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function StatusTimeline({ history }: { history: StatusHistory[] }) {
  const sorted = [...history].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-0">
      {sorted.map((entry, i) => {
        const color = STATUS_COLORS[entry.new_status] ?? "#6B7280";
        const isLast = i === sorted.length - 1;
        const isResolved = entry.new_status === "resolved";

        return (
          <div key={entry.id} className="flex gap-4">
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${color}20` }}
              >
                {isResolved ? (
                  <Check className="w-4 h-4" style={{ color }} />
                ) : entry.new_status === "in_progress" ? (
                  <ArrowRight className="w-4 h-4" style={{ color }} />
                ) : (
                  <Clock className="w-4 h-4" style={{ color }} />
                )}
              </div>
              {!isLast && (
                <div className="w-0.5 h-8 bg-gray-100" />
              )}
            </div>

            {/* Content */}
            <div className="pb-6">
              <p className="text-sm font-medium text-gray-900">
                {STATUS_LABELS[entry.new_status] ?? entry.new_status}
              </p>
              {entry.note && (
                <p className="text-sm text-gray-500 mt-0.5">{entry.note}</p>
              )}
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(entry.created_at)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
