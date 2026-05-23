"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft,
  MapPin,
  User,
  Sparkles,
  Send,
  ImageIcon,
} from "lucide-react";

const MapView = dynamic(() => import("@/components/MapView"), {
  ssr: false,
  loading: () => <div className="w-full h-48 skeleton rounded-xl" />,
});
import StatusBadge from "@/components/StatusBadge";
import SeverityBadge from "@/components/SeverityBadge";
import SecureImage from "@/components/SecureImage";
import StatusTimeline from "@/components/StatusTimeline";
import {
  MOCK_SIGNALEMENTS,
  MOCK_STATUS_HISTORY,
  getCategoryById,
} from "@/lib/mock-data";
import { useState } from "react";
import type { SignalementStatus } from "@signalicity/shared";

export default function SignalementDetailPage() {
  const { id } = useParams<{ id: string }>();
  const signalement = MOCK_SIGNALEMENTS.find((s) => s.id === id);
  const [newStatus, setNewStatus] = useState<string>("");
  const [note, setNote] = useState("");

  if (!signalement) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Signalement introuvable</p>
        <Link href="/signalements" className="text-accent text-sm mt-2 inline-block">
          Retour a la liste
        </Link>
      </div>
    );
  }

  const category = getCategoryById(signalement.category_id);
  const history = MOCK_STATUS_HISTORY.filter(
    (h) => h.signalement_id === signalement.id
  );

  const formatDate = (d: string) =>
    new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(d));

  return (
    <div>
      {/* Back */}
      <Link
        href="/signalements"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux signalements
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {signalement.title}
          </h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusBadge status={signalement.status} />
            <SeverityBadge severity={signalement.severity} />
            {category && (
              <span
                className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium"
                style={{
                  backgroundColor: `${category.color}15`,
                  color: category.color,
                }}
              >
                {category.name}
              </span>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-400">{formatDate(signalement.created_at)}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo */}
          <div className="card p-0 overflow-hidden">
            <SecureImage
              src={signalement.photo_url}
              alt={signalement.title}
              className="w-full h-80 object-cover"
            />
            {signalement.photo_after_url && (
              <div className="border-t border-gray-100">
                <div className="px-4 py-2 bg-green-50 text-green-700 text-xs font-medium flex items-center gap-1">
                  <ImageIcon className="w-3 h-3" />
                  Photo apres intervention
                </div>
                <SecureImage
                  src={signalement.photo_after_url}
                  alt="Apres"
                  className="w-full h-60 object-cover"
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Description
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {signalement.description}
            </p>

            {signalement.ai_description && (
              <div className="mt-4 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-xs font-medium text-accent">
                    Classification IA
                  </span>
                </div>
                <p className="text-sm text-gray-700">
                  {signalement.ai_description}
                </p>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Localisation
            </h2>
            <div className="flex items-start gap-2 mb-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-600">
                {signalement.address ?? `${signalement.latitude}, ${signalement.longitude}`}
              </p>
            </div>
            <MapView
              signalements={[]}
              height="200px"
              singleMarker={{ lat: signalement.latitude, lng: signalement.longitude }}
            />
          </div>

          {/* Actions */}
          <div className="card">
            <h2 className="text-base font-semibold text-gray-900 mb-4">
              Actions
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input w-auto"
                >
                  <option value="">Changer le statut...</option>
                  <option value="received">Recu</option>
                  <option value="in_progress">En cours</option>
                  <option value="resolved">Resolu</option>
                </select>
                <button
                  className="btn-primary text-sm"
                  disabled={!newStatus}
                >
                  Appliquer
                </button>
              </div>

              <div>
                <textarea
                  placeholder="Ajouter une note interne..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="input min-h-[80px] resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <button className="text-sm text-accent font-medium flex items-center gap-1 hover:underline">
                    <Sparkles className="w-3.5 h-3.5" />
                    Generer une reponse IA
                  </button>
                  <button className="btn-secondary text-sm flex items-center gap-1" disabled={!note}>
                    <Send className="w-3.5 h-3.5" />
                    Envoyer au citoyen
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Info */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Informations
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-400">Auteur</dt>
                <dd className="flex items-center gap-1.5 mt-0.5 text-gray-700">
                  <User className="w-3.5 h-3.5" />
                  {signalement.guest_email ?? "Utilisateur connecte"}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">Reference</dt>
                <dd className="mt-0.5 text-gray-700 font-mono text-xs">
                  {signalement.id}
                </dd>
              </div>
              <div>
                <dt className="text-gray-400">Service assigne</dt>
                <dd className="mt-0.5 text-gray-700">
                  {category?.name ?? "Non assigne"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Internal notes */}
          {signalement.internal_notes && (
            <div className="card">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Notes internes
              </h3>
              <p className="text-sm text-gray-600">{signalement.internal_notes}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="card">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Historique
            </h3>
            {history.length > 0 ? (
              <StatusTimeline history={history} />
            ) : (
              <p className="text-sm text-gray-400">Aucun historique</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
