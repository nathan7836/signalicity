"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Phone, Clock, MapPin, Building2 } from "lucide-react";

const SERVICES = [
  { id: "s1", name: "Mairie", phone: "01 30 53 00 00", address: "Place de la Mairie", hours: "Lun-Ven 8h30-17h", color: "#2563EB" },
  { id: "s2", name: "Services techniques", phone: "01 30 53 00 10", address: "8 Rue des Ateliers", hours: "Lun-Ven 8h-16h30", color: "#F59E0B" },
  { id: "s3", name: "Police municipale", phone: "01 30 53 00 20", address: "2 Place de la Mairie", hours: "Lun-Sam", color: "#EF4444" },
  { id: "s4", name: "Mediatheque", phone: "01 30 53 00 30", address: "12 Rue de la Paix", hours: "Mar-Sam", color: "#8B5CF6" },
];

export default function AnnuaireCitoyenPage() {
  const router = useRouter();
  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white pb-24">
      <header className="sticky top-0 bg-white/90 backdrop-blur-lg z-10 px-5 pt-14 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/citoyen")} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-lg font-bold text-gray-900">Annuaire</h1>
        </div>
      </header>
      <div className="px-5 space-y-3">
        {SERVICES.map((s) => (
          <div key={s.id} className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.color}15` }}>
                <Building2 className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <h3 className="text-base font-semibold text-gray-900">{s.name}</h3>
            </div>
            <div className="space-y-1.5 text-sm text-gray-600">
              <a href={`tel:${s.phone.replace(/ /g, "")}`} className="flex items-center gap-2 text-accent font-medium"><Phone className="w-3.5 h-3.5" />{s.phone}</a>
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-gray-400" />{s.address}</div>
              <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-gray-400" />{s.hours}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
