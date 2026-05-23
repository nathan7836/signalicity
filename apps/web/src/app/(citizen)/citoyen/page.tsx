"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Camera,
  ClipboardList,
  MapPin,
  ChevronRight,
  Shield,
  Bell,
  Calendar,
  Building2,
  Vote,
  MessageCircle,
  AlertTriangle,
} from "lucide-react";
import StatusBadge from "@/components/StatusBadge";
import { MOCK_SIGNALEMENTS } from "@/lib/mock-data";

export default function CitoyenHomePage() {
  const router = useRouter();
  const recent = MOCK_SIGNALEMENTS.slice(0, 3);

  return (
    <div className="max-w-lg mx-auto px-5 pb-24">
      {/* Header */}
      <header className="pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Signalicity</h1>
              <p className="text-xs text-gray-400">Croissy-sur-Seine</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <Bell className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <h2 className="text-[28px] font-bold text-gray-900 leading-tight">
          Bonjour !
        </h2>
        <p className="text-base text-gray-500 mt-1">
          Signalez un probleme en quelques secondes.
        </p>
      </header>

      {/* CTA - Signaler */}
      <button
        onClick={() => router.push("/signaler")}
        className="w-full bg-accent text-white rounded-2xl p-6 flex items-center gap-4 shadow-lg shadow-accent/25 hover:bg-blue-700 transition-colors mb-6 text-left"
      >
        <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Camera className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <p className="text-lg font-bold">Signaler un probleme</p>
          <p className="text-sm text-white/75">
            Photo, localisation, c&apos;est envoye !
          </p>
        </div>
        <ChevronRight className="w-5 h-5 text-white/60" />
      </button>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { value: "47", label: "Signalements", color: "text-gray-900" },
          { value: "14", label: "En cours", color: "text-blue-600" },
          { value: "18", label: "Resolus", color: "text-green-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-gray-50 rounded-2xl p-4 text-center"
          >
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { href: "/mes-signalements", icon: ClipboardList, color: "blue", label: "Mes signalements", sub: "Suivre mes demandes" },
          { href: "/c-alertes", icon: AlertTriangle, color: "red", label: "Alertes", sub: "Travaux, meteo" },
          { href: "/c-agenda", icon: Calendar, color: "purple", label: "Agenda", sub: "Evenements" },
          { href: "/c-annuaire", icon: Building2, color: "amber", label: "Annuaire", sub: "Services, horaires" },
          { href: "/c-participatif", icon: Vote, color: "green", label: "Participatif", sub: "Voter, proposer" },
          { href: "/c-assistant", icon: MessageCircle, color: "cyan", label: "Assistant IA", sub: "Posez vos questions" },
        ].map((item) => {
          const Icon = item.icon;
          const bgMap: Record<string, string> = { blue: "bg-blue-50", red: "bg-red-50", purple: "bg-purple-50", amber: "bg-amber-50", green: "bg-green-50", cyan: "bg-cyan-50" };
          const textMap: Record<string, string> = { blue: "text-blue-600", red: "text-red-600", purple: "text-purple-600", amber: "text-amber-600", green: "text-green-600", cyan: "text-cyan-600" };
          return (
            <Link key={item.href} href={item.href} className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3 hover:bg-gray-100 transition-colors">
              <div className={`w-10 h-10 rounded-xl ${bgMap[item.color]} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${textMap[item.color]}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-400">{item.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent signalements */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          Signalements recents
        </h3>
        <div className="space-y-3">
          {recent.map((s) => (
            <Link
              key={s.id}
              href={`/suivi/${s.id}`}
              className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 hover:bg-gray-100 transition-colors"
            >
              <img
                src={s.photo_url}
                alt=""
                className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {s.title}
                </p>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {s.address}
                </p>
              </div>
              <StatusBadge status={s.status} />
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-2 pb-8 flex justify-around max-w-lg mx-auto">
        <Link
          href="/citoyen"
          className="flex flex-col items-center gap-0.5 text-accent"
        >
          <Shield className="w-6 h-6" />
          <span className="text-[10px] font-medium">Accueil</span>
        </Link>
        <Link
          href="/signaler"
          className="flex flex-col items-center gap-0.5 -mt-5"
        >
          <div className="w-14 h-14 bg-accent rounded-full flex items-center justify-center shadow-lg shadow-accent/30">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <span className="text-[10px] font-medium text-accent">Signaler</span>
        </Link>
        <Link
          href="/mes-signalements"
          className="flex flex-col items-center gap-0.5 text-gray-400"
        >
          <ClipboardList className="w-6 h-6" />
          <span className="text-[10px] font-medium">Suivi</span>
        </Link>
      </nav>
    </div>
  );
}
