"use client";

import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft,
  MapPin,
  Sparkles,
  Clock,
  Check,
  ArrowRight,
} from "lucide-react";
import { MOCK_SIGNALEMENTS, MOCK_STATUS_HISTORY, getCategoryById } from "@/lib/mock-data";
import { STATUS_LABELS, STATUS_COLORS } from "@signalicity/shared";
import SecureImage from "@/components/SecureImage";

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export default function SuiviDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const signalement = MOCK_SIGNALEMENTS.find((s) => s.id === id);

  if (!signalement) {
    return (
      <div className="max-w-lg mx-auto px-5 pt-20 text-center">
        <p className="text-gray-500">Signalement introuvable</p>
        <button
          onClick={() => router.push("/citoyen")}
          className="text-accent text-sm mt-3 font-medium"
        >
          Retour
        </button>
      </div>
    );
  }

  const category = getCategoryById(signalement.category_id);
  const history = MOCK_STATUS_HISTORY.filter(
    (h) => h.signalement_id === signalement.id
  ).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const statusColor = STATUS_COLORS[signalement.status] ?? "#6B7280";

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white pb-12">
      {/* Photo header */}
      <div className="relative">
        <SecureImage
          src={signalement.photo_url}
          alt={signalement.title}
          className="w-full h-64 object-cover"
        />
        <div className="absolute top-0 left-0 right-0 pt-14 px-5 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
        </div>
        {/* Status pill on photo */}
        <div className="absolute bottom-4 left-5">
          <span
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-md"
            style={{
              backgroundColor: `${statusColor}dd`,
              color: "#fff",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-white/80" />
            {STATUS_LABELS[signalement.status] ?? signalement.status}
          </span>
        </div>
      </div>

      <div className="px-5 pt-5">
        {/* Title */}
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          {signalement.title}
        </h1>
        <div className="flex items-center gap-2 mb-5">
          {category && (
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-lg"
              style={{
                backgroundColor: `${category.color}15`,
                color: category.color,
              }}
            >
              {category.name}
            </span>
          )}
          <span className="text-xs text-gray-400">
            {formatDate(signalement.created_at)}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 mb-5 bg-gray-50 rounded-xl p-3.5">
          <MapPin className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-700">
            {signalement.address ?? `${signalement.latitude}, ${signalement.longitude}`}
          </p>
        </div>

        {/* Description */}
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            Description
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {signalement.description}
          </p>
          {signalement.ai_description && (
            <div className="mt-3 bg-blue-50 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span className="text-xs font-semibold text-accent">
                  Analyse IA
                </span>
              </div>
              <p className="text-sm text-gray-700">
                {signalement.ai_description}
              </p>
            </div>
          )}
        </div>

        {/* Photo after */}
        {signalement.photo_after_url && (
          <div className="mb-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Apres intervention
            </h3>
            <SecureImage
              src={signalement.photo_after_url}
              alt="Apres"
              className="w-full h-44 object-cover rounded-xl"
            />
          </div>
        )}

        {/* Timeline */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Suivi
          </h3>
          <div className="space-y-0">
            {history.map((entry, i) => {
              const color = STATUS_COLORS[entry.new_status] ?? "#6B7280";
              const isLast = i === history.length - 1;
              const isResolved = entry.new_status === "resolved";

              return (
                <div key={entry.id} className="flex gap-3">
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
                    {!isLast && <div className="w-0.5 h-6 bg-gray-100" />}
                  </div>
                  <div className="pb-5">
                    <p className="text-sm font-semibold text-gray-900">
                      {STATUS_LABELS[entry.new_status] ?? entry.new_status}
                    </p>
                    {entry.note && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {entry.note}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(entry.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-center text-xs text-gray-300 mt-6 font-mono">
          {signalement.id}
        </p>
      </div>
    </div>
  );
}
