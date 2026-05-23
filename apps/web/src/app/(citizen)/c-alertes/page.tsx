"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, AlertTriangle, CloudRain, Construction, Info } from "lucide-react";

const ICONS: Record<string, typeof Info> = { travaux: Construction, intemperie: CloudRain, securite: AlertTriangle, info: Info };
const SEV: Record<string, { bg: string; text: string }> = { info: { bg: "#EFF6FF", text: "#2563EB" }, warning: { bg: "#FEF3C7", text: "#D97706" }, critical: { bg: "#FEE2E2", text: "#DC2626" } };

const ALERTS = [
  { id: "a1", title: "Travaux rue de Paris", body: "Circulation alternee du 20 au 30 mai. Deviation par la rue de Verdun.", type: "travaux", severity: "warning", date: "20 mai" },
  { id: "a2", title: "Alerte meteo orange", body: "Vent violent prevu. Evitez les deplacements. Eloignez-vous des arbres.", type: "intemperie", severity: "critical", date: "20 mai" },
  { id: "a3", title: "Coupure d'eau le 25 mai", body: "Secteur parc Chanorier de 9h a 14h pour travaux de canalisation.", type: "info", severity: "info", date: "25 mai" },
];

export default function AlertesCitoyenPage() {
  const router = useRouter();
  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white pb-24">
      <header className="sticky top-0 bg-white/90 backdrop-blur-lg z-10 px-5 pt-14 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/citoyen")} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-lg font-bold text-gray-900">Alertes</h1>
        </div>
      </header>
      <div className="px-5 space-y-3">
        {ALERTS.map((a) => {
          const Icon = ICONS[a.type] ?? Info;
          const sev = SEV[a.severity] ?? SEV.info;
          return (
            <div key={a.id} className="rounded-2xl p-4" style={{ backgroundColor: sev.bg }}>
              <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: sev.text }} />
                <div>
                  <h3 className="text-sm font-bold" style={{ color: sev.text }}>{a.title}</h3>
                  <p className="text-sm text-gray-700 mt-1">{a.body}</p>
                  <p className="text-xs text-gray-400 mt-2">{a.date}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
