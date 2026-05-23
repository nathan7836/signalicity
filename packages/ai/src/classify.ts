import type { AIClassification } from "@signalicity/shared";
import { getProvider } from "./provider";

const KEYWORD_RULES: Record<string, { category_slug: string; severity: string }> = {
  nid_de_poule: { category_slug: "voirie", severity: "high" },
  trottoir_casse: { category_slug: "voirie", severity: "medium" },
  poubelle: { category_slug: "proprete", severity: "medium" },
  dechets: { category_slug: "proprete", severity: "medium" },
  lampadaire: { category_slug: "eclairage", severity: "medium" },
  eclairage: { category_slug: "eclairage", severity: "medium" },
  arbre: { category_slug: "espaces-verts", severity: "low" },
  branche: { category_slug: "espaces-verts", severity: "medium" },
  banc: { category_slug: "mobilier-urbain", severity: "low" },
  stationnement: { category_slug: "stationnement", severity: "low" },
  bruit: { category_slug: "nuisances", severity: "medium" },
};

export async function classifyPhoto(
  imageBase64: string,
  userText?: string
): Promise<AIClassification> {
  // Pre-filtering by keywords (no AI call needed)
  if (userText) {
    const lower = userText.toLowerCase().replace(/[^a-z]/g, "_");
    for (const [keyword, rule] of Object.entries(KEYWORD_RULES)) {
      if (lower.includes(keyword)) {
        return {
          category_slug: rule.category_slug,
          category_confidence: 0.95,
          severity: rule.severity as AIClassification["severity"],
          suggested_description: userText,
        };
      }
    }
  }

  // AI classification via provider
  try {
    return await getProvider().classifyImage(imageBase64);
  } catch {
    // Fallback: return unclassified
    return {
      category_slug: "autre",
      category_confidence: 0,
      severity: "medium",
      suggested_description: userText ?? "Signalement en attente de classification.",
    };
  }
}
