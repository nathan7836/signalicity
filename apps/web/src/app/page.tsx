"use client";

import {
  ClipboardList,
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";
import dynamic from "next/dynamic";

const RechartsBarChart = dynamic(
  () => import("recharts").then((mod) => {
    const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } = mod;
    const Chart = ({ data }: { data: typeof import("@/lib/mock-data").MOCK_CHART_DATA }) => (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barGap={8}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #F3F4F6", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }} />
          <Legend wrapperStyle={{ fontSize: "12px" }} iconType="circle" iconSize={8} />
          <Bar dataKey="received" name="Recus" fill="#2563EB" radius={[6, 6, 0, 0]} maxBarSize={32} />
          <Bar dataKey="resolved" name="Resolus" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    );
    Chart.displayName = "Chart";
    return Chart;
  }),
  { ssr: false, loading: () => <div className="h-72 skeleton" /> }
);
import StatsCard from "@/components/StatsCard";
import SignalementRow from "@/components/SignalementRow";
import {
  MOCK_STATS,
  MOCK_SIGNALEMENTS,
  MOCK_CATEGORIES,
  MOCK_CHART_DATA,
  getCategoryById,
} from "@/lib/mock-data";

export default function DashboardPage() {
  const recentSignalements = MOCK_SIGNALEMENTS.slice(0, 5);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Vue d&apos;ensemble des signalements - Croissy-sur-Seine
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatsCard
          label="Total signalements"
          value={MOCK_STATS.total_signalements}
          icon={ClipboardList}
          trend="12% vs mois dernier"
          trendUp={true}
          color="#2563EB"
        />
        <StatsCard
          label="Taux de resolution"
          value={`${MOCK_STATS.resolution_rate}%`}
          icon={CheckCircle2}
          trend="5% vs mois dernier"
          trendUp={true}
          color="#10B981"
        />
        <StatsCard
          label="Delai moyen"
          value={`${MOCK_STATS.avg_resolution_hours}h`}
          icon={Clock}
          trend="8h vs mois dernier"
          trendUp={false}
          color="#F59E0B"
        />
        <StatsCard
          label="En attente"
          value={MOCK_STATS.received_count}
          icon={TrendingUp}
          trend="3 de moins qu'hier"
          trendUp={true}
          color="#8B5CF6"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Signalements cette semaine
          </h2>
          <div className="h-72">
            <RechartsBarChart data={MOCK_CHART_DATA} />
          </div>
        </div>

        {/* Categories breakdown */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            Par categorie
          </h2>
          <div className="space-y-3">
            {MOCK_CATEGORIES.slice(0, 6).map((cat, i) => {
              const count = [12, 9, 7, 6, 5, 4][i];
              const pct = Math.round((count / 47) * 100);
              return (
                <div key={cat.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{cat.name}</span>
                    <span className="text-gray-400">{count}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent signalements */}
      <div className="card mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-900">
            Derniers signalements
          </h2>
          <a
            href="/signalements"
            className="text-sm text-accent font-medium hover:underline"
          >
            Voir tout
          </a>
        </div>
        <div className="-mx-6">
          {recentSignalements.map((s) => (
            <SignalementRow
              key={s.id}
              signalement={s}
              category={getCategoryById(s.category_id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
