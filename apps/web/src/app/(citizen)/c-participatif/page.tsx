"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Vote, Euro, Check } from "lucide-react";

const POLL = {
  title: "Budget participatif 2026",
  description: "Choisissez le projet finance par la commune (50 000 euros).",
  closes: "20 juin 2026",
  total: 381,
  options: [
    { id: "o1", title: "Renovation aires de jeux", desc: "Parc Chanorier, aire tout-petits", cost: 45000, votes: 127 },
    { id: "o2", title: "Piste cyclable rue de Paris", desc: "1.2km securise", cost: 48000, votes: 98 },
    { id: "o3", title: "Jardins partages", desc: "20 parcelles rue des Gabillons", cost: 25000, votes: 84 },
    { id: "o4", title: "Eclairage solaire berges", desc: "15 bornes chemin de halage", cost: 35000, votes: 72 },
  ],
};

export default function ParticipatifCitoyenPage() {
  const router = useRouter();
  const [voted, setVoted] = useState<string | null>(null);
  const maxVotes = Math.max(...POLL.options.map((o) => o.votes));

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white pb-24">
      <header className="sticky top-0 bg-white/90 backdrop-blur-lg z-10 px-5 pt-14 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/citoyen")} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-lg font-bold text-gray-900">Budget participatif</h1>
        </div>
      </header>
      <div className="px-5">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">{POLL.title}</h2>
          <p className="text-sm text-gray-500">{POLL.description}</p>
          <div className="flex items-center gap-2 mt-2 text-sm text-green-700 bg-green-50 rounded-xl px-3 py-2 font-medium">
            <Euro className="w-4 h-4" /> 50 000 euros - {POLL.total} votes
          </div>
        </div>

        <div className="space-y-3">
          {POLL.options.map((opt) => {
            const pct = Math.round((opt.votes / POLL.total) * 100);
            const isLeading = opt.votes === maxVotes;
            const isVoted = voted === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setVoted(opt.id)}
                className={`w-full text-left rounded-2xl border-2 p-4 transition-all ${
                  isVoted ? "border-accent bg-blue-50/50" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">{opt.title}</span>
                      {isVoted && <Check className="w-4 h-4 text-accent" />}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{opt.cost?.toLocaleString("fr-FR")} euros</p>
                  </div>
                  <span className={`text-lg font-bold ${isLeading ? "text-accent" : "text-gray-400"}`}>{pct}%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
                  <div className={`h-full rounded-full ${isVoted ? "bg-accent" : isLeading ? "bg-accent/60" : "bg-gray-300"}`} style={{ width: `${pct}%` }} />
                </div>
              </button>
            );
          })}
        </div>

        {voted && (
          <div className="mt-4 bg-green-50 text-green-700 rounded-xl px-4 py-3 text-sm font-medium text-center">
            Merci pour votre vote !
          </div>
        )}
      </div>
    </div>
  );
}
