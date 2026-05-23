import { getProvider } from "./provider";

export async function generateCitizenResponse(
  status: string,
  category: string,
  description: string
): Promise<string> {
  try {
    const prompt = `Redige un message court et bienveillant a destination d'un citoyen pour l'informer du changement de statut de son signalement.
Categorie: ${category}
Description: ${description}
Nouveau statut: ${status}
Le ton doit etre professionnel, rassurant et concis (2-3 phrases max).`;
    return await getProvider().generateText(prompt);
  } catch {
    const messages: Record<string, string> = {
      received: "Votre signalement a bien ete recu. Nos services vont l'examiner dans les meilleurs delais.",
      in_progress: "Votre signalement est en cours de traitement par nos equipes techniques.",
      resolved: "Votre signalement a ete traite. Merci pour votre contribution a l'amelioration de notre commune.",
    };
    return messages[status] ?? "Votre signalement a ete mis a jour.";
  }
}
