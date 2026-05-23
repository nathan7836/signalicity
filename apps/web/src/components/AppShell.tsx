"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

const CITIZEN_PREFIXES = ["/citoyen", "/signaler", "/suivi", "/mes-signalements", "/c-agenda", "/c-annuaire", "/c-participatif", "/c-assistant", "/c-alertes"];
const NO_SHELL_PAGES = ["/login", ...CITIZEN_PREFIXES];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const noShell = NO_SHELL_PAGES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  if (noShell) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <main className="ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-8 py-8">{children}</div>
      </main>
    </>
  );
}
