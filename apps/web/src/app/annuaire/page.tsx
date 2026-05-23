"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Building2, Phone, Mail, Clock, MapPin, Globe } from "lucide-react";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false, loading: () => <div className="h-80 skeleton rounded-xl" /> });

const MOCK_SERVICES = [
  { id: "s1", name: "Mairie", category: "administratif", phone: "01 30 53 00 00", email: "mairie@croissy.fr", address: "Place de la Mairie", hours: "Lun 8h30-12h, Mar-Jeu 8h30-17h, Ven 8h30-17h", lat: 48.8783, lng: 2.1372 },
  { id: "s2", name: "Services techniques", category: "technique", phone: "01 30 53 00 10", email: "technique@croissy.fr", address: "8 Rue des Ateliers", hours: "Lun-Ven 8h-16h30", lat: 48.8770, lng: 2.1380 },
  { id: "s3", name: "Police municipale", category: "securite", phone: "01 30 53 00 20", email: "pm@croissy.fr", address: "2 Place de la Mairie", hours: "Lun-Ven 8h30-18h, Sam 9h-12h", lat: 48.8784, lng: 2.1370 },
  { id: "s4", name: "Mediatheque", category: "culture", phone: "01 30 53 00 30", email: "mediatheque@croissy.fr", address: "12 Rue de la Paix", hours: "Mar,Ven 15h-19h, Mer 10h-18h, Sam 10h-17h", lat: 48.8790, lng: 2.1365 },
];

const MOCK_FACILITIES = [
  { id: "f1", name: "Parc Chanorier", type: "parc", lat: 48.8788, lng: 2.1320 },
  { id: "f2", name: "Gymnase municipal", type: "sport", lat: 48.8770, lng: 2.1390 },
  { id: "f3", name: "Ecole Monet", type: "ecole", lat: 48.8795, lng: 2.1340 },
  { id: "f4", name: "Creche Les Petits Pas", type: "creche", lat: 48.8780, lng: 2.1355 },
  { id: "f5", name: "Parking Mairie", type: "parking", lat: 48.8782, lng: 2.1375 },
  { id: "f6", name: "Tennis Club", type: "sport", lat: 48.8765, lng: 2.1400 },
];

const CAT_COLORS: Record<string, string> = { administratif: "#2563EB", technique: "#F59E0B", securite: "#EF4444", culture: "#8B5CF6", education: "#10B981" };

export default function AnnuairePage() {
  const [tab, setTab] = useState<"services" | "carte">("services");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Annuaire</h1>
          <p className="text-sm text-gray-500 mt-1">Services municipaux et equipements publics</p>
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          <button onClick={() => setTab("services")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "services" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Services</button>
          <button onClick={() => setTab("carte")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === "carte" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>Carte equipements</button>
        </div>
      </div>

      {tab === "services" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {MOCK_SERVICES.map((s) => (
            <div key={s.id} className="card">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${CAT_COLORS[s.category] ?? "#6B7280"}15` }}>
                  <Building2 className="w-5 h-5" style={{ color: CAT_COLORS[s.category] ?? "#6B7280" }} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{s.name}</h3>
                  <span className="text-xs text-gray-400 capitalize">{s.category}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600"><Phone className="w-3.5 h-3.5 text-gray-400" />{s.phone}</div>
                <div className="flex items-center gap-2 text-gray-600"><Mail className="w-3.5 h-3.5 text-gray-400" />{s.email}</div>
                <div className="flex items-center gap-2 text-gray-600"><MapPin className="w-3.5 h-3.5 text-gray-400" />{s.address}</div>
                <div className="flex items-center gap-2 text-gray-600"><Clock className="w-3.5 h-3.5 text-gray-400" />{s.hours}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "carte" && (
        <div className="card p-0 overflow-hidden">
          <MapView
            signalements={MOCK_FACILITIES.map((f) => ({ id: f.id, title: f.name, latitude: f.lat, longitude: f.lng, address: f.type, status: "resolved", photo_url: "", severity: "low" } as any))}
            height="600px"
          />
        </div>
      )}
    </div>
  );
}
