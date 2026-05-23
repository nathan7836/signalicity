export const colors = {
  accent: "#2563EB",
  accentLight: "#DBEAFE",
  accentDark: "#1D4ED8",

  background: "#FFFFFF",
  surface: "#F9FAFB",
  border: "#F3F4F6",

  text: "#111827",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  textInverse: "#FFFFFF",

  status: {
    received: "#9CA3AF",
    in_progress: "#3B82F6",
    resolved: "#10B981",
  },

  severity: {
    low: "#10B981",
    medium: "#F59E0B",
    high: "#EF4444",
    critical: "#7C3AED",
  },

  category: {
    voirie: "#6366F1",
    proprete: "#F59E0B",
    eclairage: "#FBBF24",
    "espaces-verts": "#10B981",
    "mobilier-urbain": "#8B5CF6",
    stationnement: "#EF4444",
    nuisances: "#EC4899",
    autre: "#6B7280",
  },

  white: "#FFFFFF",
  black: "#000000",
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    400: "#9CA3AF",
    500: "#6B7280",
    600: "#4B5563",
    700: "#374151",
    800: "#1F2937",
    900: "#111827",
  },
} as const;
