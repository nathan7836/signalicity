"use client";

import { Settings, Shield, Palette, Bell, Database, Link2, Users, Globe } from "lucide-react";

export default function ParametresPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Parametres</h1>
        <p className="text-sm text-gray-500 mt-1">Configuration de la plateforme</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* General */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><Globe className="w-5 h-5 text-accent" /></div>
            <div><h3 className="text-sm font-semibold text-gray-900">Commune</h3><p className="text-xs text-gray-400">Informations generales</p></div>
          </div>
          <div className="space-y-3">
            <div><label className="text-xs font-medium text-gray-500">Nom</label><input className="input mt-1" defaultValue="Croissy-sur-Seine" /></div>
            <div><label className="text-xs font-medium text-gray-500">Population</label><input className="input mt-1" defaultValue="10 000" /></div>
            <div><label className="text-xs font-medium text-gray-500">Departement</label><input className="input mt-1" defaultValue="78 - Yvelines" /></div>
          </div>
        </div>

        {/* Branding */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center"><Palette className="w-5 h-5 text-purple-600" /></div>
            <div><h3 className="text-sm font-semibold text-gray-900">Branding</h3><p className="text-xs text-gray-400">Personnalisation visuelle</p></div>
          </div>
          <div className="space-y-3">
            <div><label className="text-xs font-medium text-gray-500">Couleur principale</label><div className="flex items-center gap-2 mt-1"><input type="color" defaultValue="#2563EB" className="w-10 h-10 rounded-lg border-0 cursor-pointer" /><input className="input flex-1" defaultValue="#2563EB" /></div></div>
            <div><label className="text-xs font-medium text-gray-500">Logo</label><div className="mt-1 w-full h-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-xs text-gray-400">Glisser-deposer ou cliquer</div></div>
          </div>
        </div>

        {/* Modules */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><Shield className="w-5 h-5 text-green-600" /></div>
            <div><h3 className="text-sm font-semibold text-gray-900">Modules actifs</h3><p className="text-xs text-gray-400">Fonctionnalites activees</p></div>
          </div>
          <div className="space-y-2">
            {[
              { name: "Signalements", enabled: true },
              { name: "Alertes geolocalisees", enabled: true },
              { name: "Agenda evenements", enabled: true },
              { name: "Annuaire services", enabled: true },
              { name: "Budget participatif", enabled: true },
              { name: "Assistant IA", enabled: true },
              { name: "Tournees agents", enabled: true },
              { name: "Police municipale", enabled: true },
            ].map((mod) => (
              <label key={mod.name} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">{mod.name}</span>
                <input type="checkbox" defaultChecked={mod.enabled} className="rounded text-accent" />
              </label>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center"><Bell className="w-5 h-5 text-orange-600" /></div>
            <div><h3 className="text-sm font-semibold text-gray-900">Notifications</h3><p className="text-xs text-gray-400">Configuration push et email</p></div>
          </div>
          <div className="space-y-2">
            {["Nouveau signalement", "Changement de statut", "Alerte creee", "Nouvel evenement", "Nouveau vote"].map((n) => (
              <label key={n} className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">{n}</span>
                <input type="checkbox" defaultChecked className="rounded text-accent" />
              </label>
            ))}
          </div>
        </div>

        {/* Webhooks */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center"><Link2 className="w-5 h-5 text-cyan-600" /></div>
            <div><h3 className="text-sm font-semibold text-gray-900">Webhooks / API</h3><p className="text-xs text-gray-400">Connecteurs SI externes</p></div>
          </div>
          <p className="text-sm text-gray-500 mb-3">Connectez Signalicity a vos systemes existants.</p>
          <button className="btn-secondary text-sm w-full">Ajouter un webhook</button>
        </div>

        {/* Users */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center"><Users className="w-5 h-5 text-pink-600" /></div>
            <div><h3 className="text-sm font-semibold text-gray-900">Utilisateurs</h3><p className="text-xs text-gray-400">Gestion des comptes agents</p></div>
          </div>
          <div className="space-y-2">
            {[
              { name: "Agent Martin", role: "Agent", service: "Voirie" },
              { name: "Agent Durand", role: "Agent", service: "Espaces verts" },
              { name: "M. Lambert", role: "DGS", service: "-" },
              { name: "Mme Dupont", role: "Elu", service: "-" },
            ].map((u) => (
              <div key={u.name} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-[10px] font-medium text-gray-600">{u.name.split(" ").map(n => n[0]).join("")}</div>
                  <span className="text-sm text-gray-700">{u.name}</span>
                </div>
                <span className="text-xs text-gray-400">{u.role} - {u.service}</span>
              </div>
            ))}
          </div>
          <button className="btn-secondary text-sm w-full mt-3">Ajouter un utilisateur</button>
        </div>
      </div>
    </div>
  );
}
