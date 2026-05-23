"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Map,
  Settings,
  Shield,
  LogOut,
  Bell,
  Calendar,
  Building2,
  Vote,
  MessageCircle,
  Route,
  Siren,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

interface NavSection {
  label: string;
  items: { href: string; label: string; icon: LucideIcon }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Principal",
    items: [
      { href: "/", label: "Dashboard", icon: LayoutDashboard },
      { href: "/signalements", label: "Signalements", icon: ClipboardList },
      { href: "/carte", label: "Carte", icon: Map },
    ],
  },
  {
    label: "Communication",
    items: [
      { href: "/alertes", label: "Alertes", icon: Bell },
      { href: "/agenda", label: "Agenda", icon: Calendar },
      { href: "/annuaire", label: "Annuaire", icon: Building2 },
      { href: "/participatif", label: "Participatif", icon: Vote },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/tournees", label: "Tournees agents", icon: Route },
      { href: "/police", label: "Police municipale", icon: Siren },
      { href: "/assistant", label: "Assistant IA", icon: MessageCircle },
    ],
  },
  {
    label: "Systeme",
    items: [
      { href: "/parametres", label: "Parametres", icon: Settings },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "AG";

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-100 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Signalicity</h1>
            <p className="text-xs text-gray-400">Croissy-sur-Seine</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-4 text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-accent text-white"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-3 border-t border-gray-100">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.email ?? "Agent"}
            </p>
            <p className="text-xs text-gray-400">Back-office</p>
          </div>
          <button
            onClick={signOut}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
            title="Deconnexion"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
