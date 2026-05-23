import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Signalicity - Croissy-sur-Seine",
  description:
    "Signalez un probleme dans votre commune en quelques secondes.",
  manifest: "/manifest.json",
  themeColor: "#2563EB",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
};

export default function CitizenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-white">{children}</div>;
}
