"use client";

import { useState } from "react";
import { Search, Filter, Download } from "lucide-react";
import SignalementRow from "@/components/SignalementRow";
import { MOCK_SIGNALEMENTS, MOCK_CATEGORIES, getCategoryById } from "@/lib/mock-data";
import type { SignalementStatus } from "@signalicity/shared";

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Tous" },
  { value: "received", label: "Recus" },
  { value: "in_progress", label: "En cours" },
  { value: "resolved", label: "Resolus" },
];

export default function SignalementsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = MOCK_SIGNALEMENTS.filter((s) => {
    if (statusFilter !== "all" && s.status !== statusFilter) return false;
    if (categoryFilter !== "all" && s.category_id !== categoryFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.address?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Signalements</h1>
          <p className="text-sm text-gray-500 mt-1">
            {filtered.length} signalement{filtered.length > 1 ? "s" : ""}
          </p>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-sm">
          <Download className="w-4 h-4" />
          Exporter CSV
        </button>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un signalement..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === f.value
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input w-auto"
          >
            <option value="all">Toutes categories</option>
            {MOCK_CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      <div className="card p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Filter className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Aucun signalement trouve</p>
          </div>
        ) : (
          filtered.map((s) => (
            <SignalementRow
              key={s.id}
              signalement={s}
              category={getCategoryById(s.category_id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
