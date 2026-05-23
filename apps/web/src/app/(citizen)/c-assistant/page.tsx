"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Send, Sparkles, Bot, User } from "lucide-react";

interface Message { id: string; role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  "Horaires de la mairie ?",
  "Comment faire une carte d'identite ?",
  "Ramassage encombrants ?",
  "Tarifs piscine ?",
];

const RESPONSES: Record<string, string> = {
  "horaires": "La mairie est ouverte :\n- Lundi : 8h30-12h\n- Mardi, Jeudi : 8h30-17h\n- Mercredi : 8h30-12h\n- Vendredi : 8h30-17h",
  "carte": "Pour une carte d'identite :\n1. RDV en ligne sur croissy.fr\n2. Apportez : photo, justificatif domicile, acte de naissance\n3. Delai : 3-4 semaines",
  "encombrants": "Ramassage le **1er lundi du mois**.\nDeposez la veille au soir. Max 2m3.\nRDV au 01 30 53 00 10.",
  "piscine": "Piscine ouverte juin-septembre.\nAdulte : 5 euros\nEnfant : 3 euros\nCarnet 10 entrees : 40 euros",
};

export default function AssistantCitoyenPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((p) => [...p, { id: `u${Date.now()}`, role: "user", content: text }]);
    setInput("");
    setLoading(true);
    setTimeout(() => {
      const lower = text.toLowerCase();
      let resp = "Je n'ai pas l'information. Contactez la mairie au 01 30 53 00 00.";
      for (const [k, v] of Object.entries(RESPONSES)) { if (lower.includes(k)) { resp = v; break; } }
      setMessages((p) => [...p, { id: `a${Date.now()}`, role: "assistant", content: resp }]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-lg mx-auto h-screen bg-white flex flex-col">
      <header className="px-5 pt-14 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/citoyen")} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center"><Sparkles className="w-4 h-4 text-accent" /></div>
            <div><p className="text-sm font-bold text-gray-900">Assistant Croissy</p><p className="text-[10px] text-gray-400">En ligne 24/7</p></div>
          </div>
        </div>
      </header>

      <div ref={ref} className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Sparkles className="w-10 h-10 text-accent/30 mb-3" />
            <p className="text-sm text-gray-500 mb-4">Comment puis-je vous aider ?</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="px-3 py-2 bg-gray-50 rounded-xl text-xs text-gray-700 font-medium hover:bg-gray-100">{s}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}>
            {m.role === "assistant" && <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0"><Bot className="w-3.5 h-3.5 text-accent" /></div>}
            <div className={`max-w-[80%] px-4 py-3 text-sm whitespace-pre-line ${m.role === "user" ? "bg-accent text-white rounded-2xl rounded-tr-sm" : "bg-gray-50 rounded-2xl rounded-tl-sm text-gray-700"}`}>{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center"><Bot className="w-3.5 h-3.5 text-accent" /></div>
            <div className="bg-gray-50 rounded-2xl px-4 py-3 flex gap-1"><span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" /><span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} /><span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} /></div>
          </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="px-5 py-3 pb-8 border-t border-gray-100 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} className="input flex-1" placeholder="Votre question..." />
        <button type="submit" disabled={!input.trim()} className="w-11 h-11 bg-accent rounded-xl flex items-center justify-center text-white disabled:opacity-50"><Send className="w-4 h-4" /></button>
      </form>
    </div>
  );
}
