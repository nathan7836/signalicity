"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, Calendar, Clock, MapPin } from "lucide-react";

const EVENTS = [
  { id: "e1", title: "Fete de la musique", cat: "Culture", catColor: "#7C3AED", date: "20 juin", time: "18h - 00h", location: "Berges de Seine", img: "https://placehold.co/400x200/7C3AED/white?text=Musique" },
  { id: "e2", title: "Brocante annuelle", cat: "General", catColor: "#4B5563", date: "5 juin", time: "Toute la journee", location: "Place de la Mairie", img: "https://placehold.co/400x200/4B5563/white?text=Brocante" },
  { id: "e3", title: "Conseil municipal", cat: "Conseil", catColor: "#2563EB", date: "27 mai", time: "20h30", location: "Salle du conseil", img: "https://placehold.co/400x200/2563EB/white?text=Conseil" },
  { id: "e4", title: "Stage multisport 6-12 ans", cat: "Sport", catColor: "#16A34A", date: "7-11 juil.", time: "9h - 17h", location: "Gymnase", img: "https://placehold.co/400x200/16A34A/white?text=Sport" },
  { id: "e5", title: "Atelier seniors numerique", cat: "Seniors", catColor: "#DB2777", date: "30 mai", time: "14h - 16h", location: "Espace Pagnol", img: "https://placehold.co/400x200/DB2777/white?text=Seniors" },
];

export default function AgendaCitoyenPage() {
  const router = useRouter();
  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white pb-24">
      <header className="sticky top-0 bg-white/90 backdrop-blur-lg z-10 px-5 pt-14 pb-3">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/citoyen")} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <h1 className="text-lg font-bold text-gray-900">Agenda</h1>
        </div>
      </header>
      <div className="px-5 space-y-4">
        {EVENTS.map((e) => (
          <div key={e.id} className="rounded-2xl overflow-hidden bg-gray-50">
            <img src={e.img} alt="" className="w-full h-32 object-cover" />
            <div className="p-4">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${e.catColor}15`, color: e.catColor }}>{e.cat}</span>
              <h3 className="text-base font-semibold text-gray-900 mt-2">{e.title}</h3>
              <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{e.date}</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{e.time}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{e.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
