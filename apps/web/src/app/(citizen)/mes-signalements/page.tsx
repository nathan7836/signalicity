"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ClipboardList } from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { MOCK_SIGNALEMENTS } from "@/lib/mock-data";

export default function MesSignalementsPage() {
  const router = useRouter();
  // In production: filter by user_id or guest_email
  const mySignalements = MOCK_SIGNALEMENTS.slice(0, 4);

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white pb-24">
      {/* Header */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-lg z-10 px-5 pt-14 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/citoyen")}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-bold text-gray-900">
            Mes signalements
          </h1>
        </div>
      </header>

      <div className="px-5 py-4">
        {mySignalements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-lg font-semibold text-gray-900">
              Aucun signalement
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Vos signalements apparaitront ici.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {mySignalements.map((s) => (
              <Link
                key={s.id}
                href={`/suivi/${s.id}`}
                className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 hover:bg-gray-100 transition-colors"
              >
                <img
                  src={s.photo_url}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {s.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate mt-0.5">
                    {s.address}
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={s.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
