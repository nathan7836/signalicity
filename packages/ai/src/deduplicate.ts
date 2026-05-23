import { getProvider } from "./provider";

interface DuplicateCheck {
  isDuplicate: boolean;
  duplicateId?: string;
  confidence: number;
}

export async function detectDuplicate(
  newDescription: string,
  newCategory: string,
  newLat: number,
  newLng: number,
  existingSignalements: Array<{
    id: string;
    description: string;
    category_slug: string;
    latitude: number;
    longitude: number;
  }>
): Promise<DuplicateCheck> {
  // First pass: geographic proximity filter (within 50m)
  const nearby = existingSignalements.filter((s) => {
    const dist = haversineDistance(newLat, newLng, s.latitude, s.longitude);
    return dist < 50 && s.category_slug === newCategory;
  });

  if (nearby.length === 0) {
    return { isDuplicate: false, confidence: 1.0 };
  }

  // Second pass: AI semantic comparison
  try {
    const prompt = `Compare ce nouveau signalement avec les signalements existants a proximite.
Nouveau: "${newDescription}" (categorie: ${newCategory})
Existants:
${nearby.map((s) => `- ID ${s.id}: "${s.description}"`).join("\n")}
Reponds en JSON: {"isDuplicate": boolean, "duplicateId": "id ou null", "confidence": 0.0-1.0}`;

    const result = await getProvider().generateText(prompt);
    try {
      return JSON.parse(result);
    } catch {
      return { isDuplicate: false, confidence: 0.5 };
    }
  } catch {
    return { isDuplicate: false, confidence: 0.5 };
  }
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
