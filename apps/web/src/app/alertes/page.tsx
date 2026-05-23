"use client";

import { useState } from "react";
import {
  Bell,
  Plus,
  AlertTriangle,
  CloudRain,
  Construction,
  Info,
  MapPin,
  Users,
  Send,
} from "lucide-react";

const MOCK_ALERTS = [
  { id: "a1", title: "Travaux rue de Paris", body: "Travaux de voirie du 20 au 30 mai. Circulation alternee.", type: "travaux", severity: "warning", commune_wide: false, radius: 300, sent: 245, read: 198, active: true, starts_at: "2026-05-20", ends_at: "2026-05-30" },
  { id: "a2", title: "Alerte meteo orange", body: "Vigilance orange vent violent. Evitez les deplacements inutiles.", type: "intemperie", severity: "critical", commune_wide: true, radius: 5000, sent: 3200, read: 2800, active: true, starts_at: "2026-05-20", ends_at: "2026-05-21" },
  { id: "a3", title: "Coupure d'eau programmee", body: "Coupure d'eau le 25 mai de 9h a 14h secteur parc Chanorier.", type: "info", severity: "info", commune_wide: false, radius: 500, sent: 0, read: 0, active: true, starts_at: "2026-05-25", ends_at: "2026-05-25" },
];

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  travaux: { icon: Construction, color: "#F59E0B", label: "Travaux" },
  intemperie: { icon: CloudRain, color: "#EF4444", label: "Intemperie" },
  securite: { icon: AlertTriangle, color: "#DC2626", label: "Securite" },
  info: { icon: Info, color: "#3B82F6", label: "Information" },
  evenement: { icon: Bell, color: "#8B5CF6", label: "Evenement" },
};

const SEV_COLORS: Record<string, string> = {
  info: "#3B82F6",
  warning: "#F59E0B",
  critical: "#EF4444",
};

export default function AlertesPage() {
  const [showNew, setShowNew] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Alertes</h1>
          <p className="text-sm text-gray-500 mt-1">
            Alertes push geolocalisees pour les citoyens
          </p>
        </div>
        <button onClick={() => setShowNew(!showNew)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Nouvelle alerte
        </button>
      </div>

      {/* New alert form */}
      {showNew && (
        <div className="card mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Creer une alerte</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input className="input" placeholder="Titre de l'alerte" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select className="input">
                <option value="travaux">Travaux</option>
                <option value="intemperie">Intemperie</option>
                <option value="securite">Securite</option>
                <option value="info">Information</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea className="input min-h-[80px] resize-none" placeholder="Contenu de l'alerte..." />
          </div>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gravite</label>
              <select className="input">
                <option value="info">Info</option>
                <option value="warning">Attention</option>
                <option value="critical">Critique</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rayon (m)</label>
              <input type="number" className="input" defaultValue={500} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" className="rounded" />
                Toute la commune
              </label>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="btn-primary flex items-center gap-2 text-sm">
              <Send className="w-4 h-4" /> Envoyer l&apos;alerte
            </button>
            <button onClick={() => setShowNew(false)} className="btn-secondary text-sm">Annuler</button>
          </div>
        </div>
      )}

      {/* Alert list */}
      <div className="space-y-4">
        {MOCK_ALERTS.map((alert) => {
          const tc = TYPE_CONFIG[alert.type] ?? TYPE_CONFIG.info;
          const Icon = tc.icon;
          const sevColor = SEV_COLORS[alert.severity] ?? "#6B7280";

          return (
            <div key={alert.id} className="card">
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${tc.color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color: tc.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-gray-900">{alert.title}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${sevColor}15`, color: sevColor }}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                      {tc.label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{alert.body}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      {alert.commune_wide ? (
                        <><Users className="w-3 h-3" /> Toute la commune</>
                      ) : (
                        <><MapPin className="w-3 h-3" /> Rayon {alert.radius}m</>
                      )}
                    </span>
                    <span>Du {alert.starts_at} au {alert.ends_at}</span>
                    {alert.sent > 0 && (
                      <span className="flex items-center gap-1">
                        <Send className="w-3 h-3" /> {alert.sent} envoyes, {alert.read} lus
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
