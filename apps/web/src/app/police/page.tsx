"use client";

import { useState } from "react";
import { Siren, Plus, FileText, MapPin, Clock, User, AlertTriangle, Car, Eye, ChevronRight } from "lucide-react";

const TYPE_CONFIG: Record<string, { icon: typeof FileText; color: string; label: string }> = {
  constat: { icon: FileText, color: "#3B82F6", label: "Constat" },
  intervention: { icon: AlertTriangle, color: "#F59E0B", label: "Intervention" },
  ronde: { icon: Eye, color: "#10B981", label: "Ronde" },
  pv: { icon: Car, color: "#EF4444", label: "PV" },
  info: { icon: FileText, color: "#6B7280", label: "Information" },
};

const MOCK_MC = [
  { id: "mc1", type: "pv", title: "Stationnement genant - Rue de Paris", description: "Vehicule immatricule AB-123-CD stationne sur trottoir. PV n°2026-0542.", agent: "Agent Moreau", time: "10:30", date: "20 mai 2026", severity: "normal", plate: "AB-123-CD", pv: "2026-0542" },
  { id: "mc2", type: "intervention", title: "Tapage nocturne - Av. de Verdun", description: "Intervention suite a plainte riverains. Musique forte apres 22h. Rappel a l'ordre.", agent: "Agent Moreau", time: "23:15", date: "19 mai 2026", severity: "normal" },
  { id: "mc3", type: "ronde", title: "Ronde secteur ecoles", description: "Ronde de surveillance periscolaire. RAS.", agent: "Agent Petit", time: "16:30", date: "20 mai 2026", severity: "low" },
  { id: "mc4", type: "constat", title: "Depot sauvage - Rue des Gabillons", description: "Constat de depot d'encombrants. Photos prises. Signalement transmis aux ST pour enlevement. Recherche auteur.", agent: "Agent Moreau", time: "11:00", date: "20 mai 2026", severity: "normal", linked_signalement: "sig-006" },
  { id: "mc5", type: "pv", title: "Vehicule epave - Impasse des Fleurs", description: "Vehicule visiblement abandonne depuis +30 jours. Pneus creves, pare-brise casse. Procedure de mise en fourriere initiee.", agent: "Agent Petit", time: "09:00", date: "18 mai 2026", severity: "high", plate: "XX-000-XX" },
];

const MOCK_PATROLS = [
  { id: "pa1", name: "Ronde matin centre", date: "20 mai 2026", agents: ["Moreau", "Petit"], status: "completed", incidents: 1 },
  { id: "pa2", name: "Surveillance periscolaire", date: "20 mai 2026", agents: ["Petit"], status: "completed", incidents: 0 },
  { id: "pa3", name: "Ronde soir berges", date: "20 mai 2026", agents: ["Moreau"], status: "planned", incidents: 0 },
];

export default function PolicePage() {
  const [tab, setTab] = useState<"courante" | "rondes">("courante");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Police municipale</h1>
          <p className="text-sm text-gray-500 mt-1">Main courante et rondes</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Nouvelle entree
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        <button onClick={() => setTab("courante")} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "courante" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Main courante</button>
        <button onClick={() => setTab("rondes")} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === "rondes" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Rondes</button>
      </div>

      {tab === "courante" && (
        <div className="space-y-3">
          {MOCK_MC.map((entry) => {
            const tc = TYPE_CONFIG[entry.type] ?? TYPE_CONFIG.info;
            const Icon = tc.icon;
            return (
              <div key={entry.id} className="card hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${tc.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: tc.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900">{entry.title}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${tc.color}15`, color: tc.color }}>{tc.label}</span>
                      {entry.severity === "high" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600">URGENT</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{entry.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{entry.agent}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{entry.date} a {entry.time}</span>
                      {(entry as any).plate && <span className="flex items-center gap-1"><Car className="w-3 h-3" />{(entry as any).plate}</span>}
                      {(entry as any).pv && <span className="font-mono">PV {(entry as any).pv}</span>}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "rondes" && (
        <div className="space-y-3">
          {MOCK_PATROLS.map((patrol) => (
            <div key={patrol.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">{patrol.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>{patrol.date}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{patrol.agents.join(", ")}</span>
                    {patrol.incidents > 0 && <span className="text-orange-500 font-medium">{patrol.incidents} incident(s)</span>}
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  patrol.status === "completed" ? "bg-green-50 text-green-700" :
                  patrol.status === "in_progress" ? "bg-blue-50 text-blue-700" :
                  "bg-gray-100 text-gray-500"
                }`}>
                  {patrol.status === "completed" ? "Terminee" : patrol.status === "in_progress" ? "En cours" : "Planifiee"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
