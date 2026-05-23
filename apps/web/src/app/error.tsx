"use client";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Erreur</h1>
      <p className="text-gray-500">Une erreur est survenue</p>
      <a href="/" className="text-accent mt-4 text-sm font-medium hover:underline">
        Retour au dashboard
      </a>
    </div>
  );
}
