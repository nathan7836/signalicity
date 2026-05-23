"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Images,
  MapPin,
  Sparkles,
  Check,
  X,
  ChevronLeft,
} from "lucide-react";
import { DEFAULT_CATEGORIES } from "@signalicity/shared";

type Step = "photo" | "location" | "classify" | "sending" | "done";

export default function SignalerPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("photo");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: photo
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoPreview(reader.result as string);
      setStep("location");
      // Auto-get location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            try {
              const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`
              );
              const data = await res.json();
              setAddress(data.display_name?.split(",").slice(0, 3).join(",") ?? "");
            } catch {
              setAddress("Croissy-sur-Seine");
            }
          },
          () => {
            setCoords({ lat: 48.8783, lng: 2.1372 });
            setAddress("Croissy-sur-Seine");
          }
        );
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCapture = () => {
    if (fileRef.current) {
      fileRef.current.setAttribute("capture", "environment");
      fileRef.current.click();
    }
  };

  const handleGallery = () => {
    if (fileRef.current) {
      fileRef.current.removeAttribute("capture");
      fileRef.current.click();
    }
  };

  // Step 2: confirm location -> AI classify
  const confirmLocation = () => {
    setLoading(true);
    // Simulate AI classification
    setTimeout(() => {
      setDescription(
        "Degradation detectee necessitant une intervention des services techniques."
      );
      setLoading(false);
      setStep("classify");
    }, 1500);
  };

  // Step 3: submit
  const handleSubmit = async () => {
    setStep("sending");
    // Simulate submit
    setTimeout(() => {
      setStep("done");
    }, 1200);
  };

  const close = () => router.push("/citoyen");

  const stepIndex = ["photo", "location", "classify"].indexOf(step);

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white">
      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {/* Header */}
      {step !== "done" && (
        <header className="sticky top-0 bg-white/90 backdrop-blur-lg z-10 px-5 pt-14 pb-3">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={step === "photo" ? close : () => {
                const steps: Step[] = ["photo", "location", "classify"];
                setStep(steps[Math.max(0, stepIndex - 1)]);
              }}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
            >
              {step === "photo" ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </button>
            <span className="text-sm font-semibold text-gray-900">
              Nouveau signalement
            </span>
            <div className="w-10" />
          </div>

          {/* Steps */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  i <= stepIndex ? "bg-accent" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </header>
      )}

      <div className="px-5 py-6">
        {/* STEP 1: Photo */}
        {step === "photo" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Prenez une photo
            </h2>
            <p className="text-gray-500 mb-8">
              Photographiez le probleme a signaler.
            </p>

            <button
              onClick={handleCapture}
              className="w-full h-64 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 hover:border-accent hover:bg-blue-50/30 transition-colors mb-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Camera className="w-8 h-8 text-accent" />
              </div>
              <span className="text-base font-semibold text-accent">
                Prendre une photo
              </span>
            </button>

            <button
              onClick={handleGallery}
              className="w-full py-4 flex items-center justify-center gap-2 text-accent font-semibold"
            >
              <Images className="w-5 h-5" />
              Choisir dans la galerie
            </button>
          </div>
        )}

        {/* STEP 2: Location */}
        {step === "location" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Confirmez le lieu
            </h2>
            <p className="text-gray-500 mb-6">
              Verifiez que la localisation est correcte.
            </p>

            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-44 object-cover rounded-2xl mb-4"
              />
            )}

            <div className="bg-gray-50 rounded-2xl p-5 flex items-start gap-3 mb-6">
              <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {address || "Localisation en cours..."}
                </p>
                {coords && (
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={confirmLocation}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  Analyse IA en cours...
                </>
              ) : (
                "Confirmer la localisation"
              )}
            </button>
          </div>
        )}

        {/* STEP 3: Classify + submit */}
        {step === "classify" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Verification
            </h2>
            <p className="text-gray-500 mb-6">
              L&apos;IA a classifie votre signalement. Corrigez si besoin.
            </p>

            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-2xl mb-5"
              />
            )}

            {/* Category */}
            <label className="text-sm font-semibold text-gray-900 mb-2 block">
              Categorie
            </label>
            <div className="flex flex-wrap gap-2 mb-5">
              {DEFAULT_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory.slug === cat.slug
                      ? "ring-2 ring-accent shadow-sm"
                      : ""
                  }`}
                  style={{
                    backgroundColor: `${cat.color}15`,
                    color: cat.color,
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Description */}
            <label className="text-sm font-semibold text-gray-900 mb-1 block">
              Description
            </label>
            <div className="flex items-center gap-1 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs text-accent font-medium">
                Suggeree par l&apos;IA
              </span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input min-h-[100px] resize-none mb-4"
              placeholder="Decrivez le probleme..."
            />

            {/* Email (guest mode) */}
            <label className="text-sm font-semibold text-gray-900 mb-2 block">
              Email (pour le suivi)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input mb-6"
              placeholder="votre@email.fr"
            />

            <button
              onClick={handleSubmit}
              className="btn-primary w-full text-base"
            >
              Envoyer le signalement
            </button>
          </div>
        )}

        {/* SENDING */}
        {step === "sending" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4 animate-pulse">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <p className="text-lg font-semibold text-gray-900">Envoi en cours...</p>
          </div>
        )}

        {/* DONE */}
        {step === "done" && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-6 shadow-lg shadow-green-500/30 animate-[scale-in_0.4s_ease-out]">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Signalement envoye !
            </h2>
            <p className="text-gray-500 mb-2 max-w-xs">
              Vous recevrez une notification a chaque mise a jour de votre
              signalement.
            </p>
            <p className="text-xs text-gray-400 font-mono mb-8">
              Ref: SIG-{Date.now().toString().slice(-6)}
            </p>

            <button
              onClick={() => router.push("/citoyen")}
              className="btn-primary w-full max-w-xs mb-3"
            >
              Retour a l&apos;accueil
            </button>
            <button
              onClick={() => {
                setStep("photo");
                setPhotoPreview(null);
                setDescription("");
                setEmail("");
              }}
              className="btn-secondary w-full max-w-xs"
            >
              Nouveau signalement
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
