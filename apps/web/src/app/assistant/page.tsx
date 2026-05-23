"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, Sparkles, Bot, User, RotateCcw } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

const WELCOME_SUGGESTIONS = [
  "Quels sont les horaires de la mairie ?",
  "Comment faire une carte d'identite ?",
  "Quand est le prochain ramassage encombrants ?",
  "Ou est la dechetterie la plus proche ?",
  "Quels sont les tarifs de la piscine ?",
];

const MOCK_RESPONSES: Record<string, { content: string; sources: string[] }> = {
  "horaires": {
    content: "La mairie de Croissy-sur-Seine est ouverte :\n- Lundi : 8h30 - 12h00\n- Mardi et Jeudi : 8h30 - 17h00\n- Mercredi : 8h30 - 12h00\n- Vendredi : 8h30 - 17h00\n\nFermee le samedi et le dimanche.",
    sources: ["croissy.fr/mairie/horaires"],
  },
  "carte": {
    content: "Pour faire ou renouveler une carte d'identite :\n1. Prenez rendez-vous en ligne sur croissy.fr\n2. Apportez : ancien titre, photo d'identite, justificatif de domicile (-3 mois), acte de naissance\n3. Delai moyen : 3 a 4 semaines\n\nLa mairie de Croissy dispose d'une station biometrique.",
    sources: ["croissy.fr/demarches/cni", "service-public.fr"],
  },
  "encombrants": {
    content: "Le ramassage des encombrants a lieu **tous les premiers lundis du mois**.\n\n- Deposez les objets la veille au soir devant votre domicile\n- Maximum 2m3 par foyer\n- Prenez rendez-vous au 01 30 53 00 10\n\nProchain ramassage : **lundi 1er juin**.",
    sources: ["croissy.fr/pratique/dechets"],
  },
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: `u-${Date.now()}`, role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const lower = text.toLowerCase();
      let resp = { content: "Je n'ai pas trouve d'information precise sur ce sujet. Je vous conseille de contacter la mairie au 01 30 53 00 00 ou par email a mairie@croissy.fr.", sources: [] as string[] };

      for (const [key, val] of Object.entries(MOCK_RESPONSES)) {
        if (lower.includes(key)) { resp = val; break; }
      }

      const assistantMsg: Message = { id: `a-${Date.now()}`, role: "assistant", content: resp.content, sources: resp.sources };
      setMessages((prev) => [...prev, assistantMsg]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Assistant IA</h1>
          <p className="text-sm text-gray-500 mt-1">Chatbot citoyen 24/7 - RAG sur les donnees municipales</p>
        </div>
        <button onClick={() => setMessages([])} className="btn-secondary flex items-center gap-2 text-sm">
          <RotateCcw className="w-4 h-4" /> Nouvelle conversation
        </button>
      </div>

      <div className="card p-0 overflow-hidden" style={{ height: "calc(100vh - 200px)" }}>
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4" style={{ height: "calc(100% - 80px)" }}>
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Assistant municipal</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md">
                Posez une question sur les services, demarches ou la vie a Croissy-sur-Seine.
              </p>
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {WELCOME_SUGGESTIONS.map((s) => (
                  <button key={s} onClick={() => sendMessage(s)} className="px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl text-xs text-gray-700 font-medium transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
              {msg.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
              )}
              <div className={`max-w-[70%] ${msg.role === "user" ? "bg-accent text-white rounded-2xl rounded-tr-md px-4 py-3" : "bg-gray-50 rounded-2xl rounded-tl-md px-4 py-3"}`}>
                <p className="text-sm whitespace-pre-line">{msg.content}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-200/50">
                    <p className="text-[10px] text-gray-400">Sources : {msg.sources.join(", ")}</p>
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-accent" />
              </div>
              <div className="bg-gray-50 rounded-2xl rounded-tl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-100 px-4 py-3">
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="flex gap-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} className="input flex-1" placeholder="Posez votre question..." disabled={loading} />
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-4">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
