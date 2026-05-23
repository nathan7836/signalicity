import { getProvider } from "./provider";

export async function generateDescription(
  category: string,
  severity: string,
  userInput?: string
): Promise<string> {
  try {
    const prompt = `Genere une description courte et factuelle pour un signalement municipal.
Categorie: ${category}
Gravite: ${severity}
${userInput ? `Indication du citoyen: ${userInput}` : ""}
Reponds en une ou deux phrases maximum.`;
    return await getProvider().generateText(prompt);
  } catch {
    return userInput ?? "Signalement enregistre.";
  }
}
