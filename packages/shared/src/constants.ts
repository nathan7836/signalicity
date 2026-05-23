export const STATUS_LABELS: Record<string, string> = {
  received: "Recu",
  in_progress: "En cours",
  resolved: "Resolu",
};

export const STATUS_COLORS: Record<string, string> = {
  received: "#9CA3AF",
  in_progress: "#3B82F6",
  resolved: "#10B981",
};

export const SEVERITY_LABELS: Record<string, string> = {
  low: "Faible",
  medium: "Moyen",
  high: "Eleve",
  critical: "Critique",
};

export const SEVERITY_COLORS: Record<string, string> = {
  low: "#10B981",
  medium: "#F59E0B",
  high: "#EF4444",
  critical: "#7C3AED",
};

export const DEFAULT_CATEGORIES = [
  { name: "Voirie", slug: "voirie", icon: "road", color: "#6366F1" },
  { name: "Proprete", slug: "proprete", icon: "trash", color: "#F59E0B" },
  { name: "Eclairage", slug: "eclairage", icon: "lightbulb", color: "#FBBF24" },
  { name: "Espaces verts", slug: "espaces-verts", icon: "tree", color: "#10B981" },
  { name: "Mobilier urbain", slug: "mobilier-urbain", icon: "bench", color: "#8B5CF6" },
  { name: "Stationnement", slug: "stationnement", icon: "car", color: "#EF4444" },
  { name: "Nuisances", slug: "nuisances", icon: "volume-x", color: "#EC4899" },
  { name: "Autre", slug: "autre", icon: "help-circle", color: "#6B7280" },
] as const;

export const CROISSY_CENTER = {
  latitude: 48.8783,
  longitude: 2.1372,
} as const;
