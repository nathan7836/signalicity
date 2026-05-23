"use client";

import { useState } from "react";
import { Calendar, Plus, MapPin, Clock, Users, Tag } from "lucide-react";

const CATEGORY_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  culture: { bg: "#EDE9FE", text: "#7C3AED", label: "Culture" },
  sport: { bg: "#DCFCE7", text: "#16A34A", label: "Sport" },
  enfance: { bg: "#FEF3C7", text: "#D97706", label: "Enfance" },
  seniors: { bg: "#FCE7F3", text: "#DB2777", label: "Seniors" },
  general: { bg: "#F3F4F6", text: "#4B5563", label: "General" },
  conseil_municipal: { bg: "#DBEAFE", text: "#2563EB", label: "Conseil" },
  solidarite: { bg: "#FEE2E2", text: "#DC2626", label: "Solidarite" },
  environnement: { bg: "#D1FAE5", text: "#059669", label: "Environnement" },
};

const MOCK_EVENTS = [
  { id: "e1", title: "Fete de la musique", description: "Concert gratuit sur les berges de Seine.", category: "culture", location: "Berges de Seine", date: "20 juin 2026", time: "18h - 00h", image: "https://placehold.co/400x200/7C3AED/white?text=Fete+Musique" },
  { id: "e2", title: "Brocante du centre-ville", description: "Grande brocante annuelle. Plus de 100 exposants.", category: "general", location: "Place de la Mairie", date: "5 juin 2026", time: "Toute la journee", image: "https://placehold.co/400x200/4B5563/white?text=Brocante" },
  { id: "e3", title: "Conseil municipal", description: "Ordre du jour : budget 2026, amenagement berges.", category: "conseil_municipal", location: "Salle du conseil", date: "27 mai 2026", time: "20h30", image: "https://placehold.co/400x200/2563EB/white?text=Conseil" },
  { id: "e4", title: "Stage multisport enfants", description: "Stage vacances 6-12 ans. 5 euros/jour.", category: "sport", location: "Gymnase municipal", date: "7-11 juil. 2026", time: "9h - 17h", image: "https://placehold.co/400x200/16A34A/white?text=Multisport" },
  { id: "e5", title: "Atelier seniors numerique", description: "Initiation tablette et smartphone.", category: "seniors", location: "Espace Marcel Pagnol", date: "30 mai 2026", time: "14h - 16h", image: "https://placehold.co/400x200/DB2777/white?text=Atelier" },
];

export default function AgendaPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? MOCK_EVENTS : MOCK_EVENTS.filter((e) => e.category === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Agenda</h1>
          <p className="text-sm text-gray-500 mt-1">Evenements municipaux</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Nouvel evenement
        </button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === "all" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
          Tous
        </button>
        {Object.entries(CATEGORY_COLORS).map(([key, val]) => (
          <button key={key} onClick={() => setFilter(key)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${filter === key ? "ring-2 ring-offset-1" : ""}`} style={{ backgroundColor: val.bg, color: val.text }}>
            {val.label}
          </button>
        ))}
      </div>

      {/* Events grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((event) => {
          const cat = CATEGORY_COLORS[event.category] ?? CATEGORY_COLORS.general;
          return (
            <div key={event.id} className="card p-0 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <img src={event.image} alt="" className="w-full h-36 object-cover" />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: cat.bg, color: cat.text }}>
                    {cat.label}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{event.title}</h3>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{event.description}</p>
                <div className="space-y-1 text-xs text-gray-400">
                  <div className="flex items-center gap-1.5"><Calendar className="w-3 h-3" />{event.date}</div>
                  <div className="flex items-center gap-1.5"><Clock className="w-3 h-3" />{event.time}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3" />{event.location}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
