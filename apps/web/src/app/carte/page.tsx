"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/StatusBadge";
import { MOCK_SIGNALEMENTS, getCategoryById } from "@/lib/mock-data";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] skeleton rounded-xl" />
  ),
});

export default function CartePage() {
  const router = useRouter();
  const signalements = MOCK_SIGNALEMENTS;
  const [filter, setFilter] = useState("all");

  const filtered =
    filter === "all"
      ? signalements
      : signalements.filter((s) => s.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Carte</h1>
          <p className="text-sm text-gray-500 mt-1">
            Cartographie des signalements - Croissy-sur-Seine
          </p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {[
            { value: "all", label: "Tous" },
            { value: "received", label: "Recus" },
            { value: "in_progress", label: "En cours" },
            { value: "resolved", label: "Resolus" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 card p-0 overflow-hidden">
          <MapView
            signalements={filtered}
            height="600px"
            onMarkerClick={(id) => router.push(`/signalements/${id}`)}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Legende
            </h3>
            <div className="space-y-2">
              {[
                { color: "#9CA3AF", label: "Recu" },
                { color: "#3B82F6", label: "En cours" },
                { color: "#10B981", label: "Resolu" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2 text-sm">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Signalements ({filtered.length})
            </h3>
            <div className="space-y-3 max-h-[440px] overflow-y-auto">
              {filtered.map((s) => (
                <button
                  key={s.id}
                  onClick={() => router.push(`/signalements/${s.id}`)}
                  className="flex items-center gap-3 text-sm w-full text-left hover:bg-gray-50 rounded-lg p-2 -mx-2 transition-colors"
                >
                  <img
                    src={s.photo_url}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-700 truncate font-medium">
                      {s.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {s.address}
                    </p>
                  </div>
                  <StatusBadge status={s.status} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
