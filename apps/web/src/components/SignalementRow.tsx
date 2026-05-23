import Link from "next/link";
import type { Signalement, Category } from "@signalicity/shared";
import StatusBadge from "./StatusBadge";
import SeverityBadge from "./SeverityBadge";
import { MapPin, Clock } from "lucide-react";

function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 3600) return `${Math.floor(seconds / 60)}min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}j`;
}

interface Props {
  signalement: Signalement;
  category?: Category;
}

export default function SignalementRow({ signalement, category }: Props) {
  return (
    <Link
      href={`/signalements/${signalement.id}`}
      className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0"
    >
      {/* Photo thumbnail */}
      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
        <img
          src={signalement.photo_url}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {signalement.title}
        </p>
        <div className="flex items-center gap-3 mt-1">
          {signalement.address && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[200px]">{signalement.address}</span>
            </span>
          )}
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {timeAgo(signalement.created_at)}
          </span>
        </div>
      </div>

      {/* Category */}
      {category && (
        <span
          className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium"
          style={{
            backgroundColor: `${category.color}15`,
            color: category.color,
          }}
        >
          {category.name}
        </span>
      )}

      {/* Severity */}
      <div className="hidden md:block">
        <SeverityBadge severity={signalement.severity} />
      </div>

      {/* Status */}
      <StatusBadge status={signalement.status} />
    </Link>
  );
}
