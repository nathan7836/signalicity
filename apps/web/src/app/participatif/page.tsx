"use client";

import { useState } from "react";
import { Vote, Plus, BarChart3, Euro, Users, Clock } from "lucide-react";

const MOCK_POLLS = [
  {
    id: "p1", title: "Budget participatif 2026", description: "Choisissez le projet finance a hauteur de 50 000 euros.", type: "budget_participatif", budget: 50000, total_votes: 381, closes: "20 juin 2026",
    options: [
      { id: "o1", title: "Renovation aires de jeux", description: "Remplacement des jeux du parc Chanorier.", cost: 45000, votes: 127 },
      { id: "o2", title: "Piste cyclable rue de Paris", description: "Piste cyclable securisee sur 1.2km.", cost: 48000, votes: 98 },
      { id: "o3", title: "Jardins partages", description: "20 parcelles rue des Gabillons.", cost: 25000, votes: 84 },
      { id: "o4", title: "Eclairage solaire berges", description: "15 bornes solaires chemin de halage.", cost: 35000, votes: 72 },
    ],
  },
  {
    id: "p2", title: "Horaires piscine ete", description: "Quels horaires preferez-vous ?", type: "poll", budget: null, total_votes: 224, closes: "3 juin 2026",
    options: [
      { id: "o5", title: "7h-20h (actuel)", description: null, cost: null, votes: 45 },
      { id: "o6", title: "6h-21h (elargi)", description: null, cost: null, votes: 112 },
      { id: "o7", title: "8h-22h (decale)", description: null, cost: null, votes: 67 },
    ],
  },
];

export default function ParticipatifPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Participatif</h1>
          <p className="text-sm text-gray-500 mt-1">Sondages et budget participatif</p>
        </div>
        <button className="btn-primary flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Nouveau sondage
        </button>
      </div>

      <div className="space-y-6">
        {MOCK_POLLS.map((poll) => {
          const maxVotes = Math.max(...poll.options.map((o) => o.votes));
          return (
            <div key={poll.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-semibold text-gray-900">{poll.title}</h2>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${poll.type === "budget_participatif" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                      {poll.type === "budget_participatif" ? "Budget participatif" : "Sondage"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{poll.description}</p>
                </div>
                <div className="text-right text-xs text-gray-400">
                  <div className="flex items-center gap-1"><Users className="w-3 h-3" /> {poll.total_votes} votes</div>
                  <div className="flex items-center gap-1 mt-1"><Clock className="w-3 h-3" /> Jusqu&apos;au {poll.closes}</div>
                </div>
              </div>

              {poll.budget && (
                <div className="flex items-center gap-2 mb-4 bg-green-50 text-green-700 rounded-xl px-4 py-2 text-sm font-medium">
                  <Euro className="w-4 h-4" />
                  Budget : {poll.budget.toLocaleString("fr-FR")} euros
                </div>
              )}

              <div className="space-y-3">
                {poll.options.map((opt) => {
                  const pct = poll.total_votes > 0 ? Math.round((opt.votes / poll.total_votes) * 100) : 0;
                  const isLeading = opt.votes === maxVotes;
                  return (
                    <div key={opt.id} className={`rounded-xl border p-4 ${isLeading ? "border-accent bg-blue-50/30" : "border-gray-100"}`}>
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <span className="text-sm font-semibold text-gray-900">{opt.title}</span>
                          {opt.description && <p className="text-xs text-gray-500 mt-0.5">{opt.description}</p>}
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-bold ${isLeading ? "text-accent" : "text-gray-700"}`}>{pct}%</span>
                          <p className="text-xs text-gray-400">{opt.votes} votes</p>
                        </div>
                      </div>
                      {opt.cost && <p className="text-xs text-gray-400 mb-2">Cout estime : {opt.cost.toLocaleString("fr-FR")} euros</p>}
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${isLeading ? "bg-accent" : "bg-gray-300"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
