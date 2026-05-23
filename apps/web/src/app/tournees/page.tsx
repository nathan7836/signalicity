"use client";

import { useState } from "react";
import { Route, Plus, MapPin, Clock, User, Camera, CheckCircle2, Circle, ChevronRight } from "lucide-react";

const MOCK_TOURS = [
  {
    id: "t1", name: "Tournee voirie centre", date: "20 mai 2026", agent: "J. Martin", status: "in_progress", stops: 5, completed: 2, duration: "2h15",
    stopList: [
      { id: "ts1", label: "Nid de poule - Rue de Paris", status: "completed", time: "09:15" },
      { id: "ts2", label: "Trottoir degrade - Rue de Seine", status: "completed", time: "09:45" },
      { id: "ts3", label: "Marquage efface - Av. de Verdun", status: "arrived", time: "10:10" },
      { id: "ts4", label: "Bouche d'egout - Rue du Bac", status: "pending", time: null },
      { id: "ts5", label: "Eclairage - Rue Jean Jaures", status: "pending", time: null },
    ],
  },
  {
    id: "t2", name: "Tournee espaces verts", date: "21 mai 2026", agent: "P. Durand", status: "planned", stops: 4, completed: 0, duration: "~3h",
    stopList: [
      { id: "ts6", label: "Arbre dangereux - Parc Chanorier", status: "pending", time: null },
      { id: "ts7", label: "Haie debordante - Rue des Lilas", status: "pending", time: null },
      { id: "ts8", label: "Jeux casses - Square Monet", status: "pending", time: null },
      { id: "ts9", label: "Berges - Chemin de halage", status: "pending", time: null },
    ],
  },
];

const STATUS_STYLE: Record<string, { color: string; label: string }> = {
  planned: { color: "#9CA3AF", label: "Planifiee" },
  in_progress: { color: "#3B82F6", label: "En cours" },
  completed: { color: "#10B981", label: "Terminee" },
};

const STOP_ICON: Record<string, typeof Circle> = {
  pending: Circle,
  arrived: Clock,
  completed: CheckCircle2,
  skipped: Circle,
};

export default function TourneesPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedTour = MOCK_TOURS.find((t) => t.id === selected);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tournees agents</h1>
          <p className="text-sm text-gray-500 mt-1">Planification et suivi des interventions terrain</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Nouvelle tournee
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tour list */}
        <div className="space-y-3">
          {MOCK_TOURS.map((tour) => {
            const st = STATUS_STYLE[tour.status] ?? STATUS_STYLE.planned;
            return (
              <button key={tour.id} onClick={() => setSelected(tour.id)} className={`card w-full text-left transition-all ${selected === tour.id ? "ring-2 ring-accent" : "hover:shadow-md"}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">{tour.name}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${st.color}15`, color: st.color }}>{st.label}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><User className="w-3 h-3" />{tour.agent}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{tour.duration}</span>
                  <span>{tour.completed}/{tour.stops} etapes</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${(tour.completed / tour.stops) * 100}%` }} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Tour detail */}
        <div className="lg:col-span-2">
          {selectedTour ? (
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{selectedTour.name}</h2>
                  <p className="text-sm text-gray-500">{selectedTour.date} - {selectedTour.agent}</p>
                </div>
                <button className="btn-secondary text-sm flex items-center gap-1">
                  <Route className="w-4 h-4" /> Optimiser l&apos;itineraire
                </button>
              </div>

              <div className="space-y-0">
                {selectedTour.stopList.map((stop, i) => {
                  const Icon = STOP_ICON[stop.status] ?? Circle;
                  const isCompleted = stop.status === "completed";
                  const isActive = stop.status === "arrived";
                  return (
                    <div key={stop.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isCompleted ? "bg-green-100" : isActive ? "bg-blue-100" : "bg-gray-100"}`}>
                          <Icon className={`w-4 h-4 ${isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-400"}`} />
                        </div>
                        {i < selectedTour.stopList.length - 1 && <div className="w-0.5 h-8 bg-gray-100" />}
                      </div>
                      <div className={`flex-1 pb-6 ${isActive ? "bg-blue-50 -mx-2 px-3 py-2 rounded-xl" : ""}`}>
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${isCompleted ? "text-gray-400 line-through" : "text-gray-900"}`}>{stop.label}</p>
                          {stop.time && <span className="text-xs text-gray-400">{stop.time}</span>}
                        </div>
                        {isActive && (
                          <div className="flex gap-2 mt-2">
                            <button className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1"><Camera className="w-3 h-3" /> Photo avant</button>
                            <button className="text-xs bg-accent text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Terminer</button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="card flex items-center justify-center h-96 text-gray-400">
              <div className="text-center">
                <Route className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p className="text-sm">Selectionnez une tournee</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
