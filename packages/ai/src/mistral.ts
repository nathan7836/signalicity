import { Mistral } from "@mistralai/mistralai";
import type { AIProvider, AIConfig } from "./provider";
import type { AIClassification, SeverityLevel } from "@signalicity/shared";
import { DEFAULT_CATEGORIES } from "@signalicity/shared";

const CATEGORY_SLUGS = DEFAULT_CATEGORIES.map((c) => c.slug);

export function createMistralProvider(config: AIConfig): AIProvider {
  const client = new Mistral({ apiKey: config.apiKey });
  const visionModel = config.visionModel ?? "pixtral-large-latest";
  const textModel = config.textModel ?? "mistral-large-latest";
  const smallModel = config.smallModel ?? "mistral-small-latest";

  return {
    async classifyImage(imageBase64: string): Promise<AIClassification> {
      const response = await client.chat.complete({
        model: visionModel,
        messages: [
          {
            role: "system",
            content: `Tu es un assistant municipal qui classifie les signalements urbains a partir de photos.
Reponds UNIQUEMENT en JSON valide avec ce format:
{
  "category_slug": "${CATEGORY_SLUGS.join('" | "')}",
  "severity": "low" | "medium" | "high" | "critical",
  "suggested_description": "description courte du probleme observe"
}
Categories disponibles: ${DEFAULT_CATEGORIES.map((c) => `${c.slug} (${c.name})`).join(", ")}`,
          },
          {
            role: "user",
            content: [
              {
                type: "image_url",
                imageUrl: `data:image/jpeg;base64,${imageBase64}`,
              },
              {
                type: "text",
                text: "Classifie ce signalement urbain. Reponds uniquement en JSON.",
              },
            ],
          },
        ],
        responseFormat: { type: "json_object" },
      });

      const content =
        typeof response.choices?.[0]?.message?.content === "string"
          ? response.choices[0].message.content
          : "";

      try {
        const parsed = JSON.parse(content);
        return {
          category_slug: CATEGORY_SLUGS.includes(parsed.category_slug)
            ? parsed.category_slug
            : "autre",
          category_confidence: parsed.confidence ?? 0.8,
          severity: (["low", "medium", "high", "critical"] as SeverityLevel[]).includes(
            parsed.severity
          )
            ? parsed.severity
            : "medium",
          suggested_description:
            parsed.suggested_description ?? "Signalement en attente de description.",
        };
      } catch {
        return {
          category_slug: "autre",
          category_confidence: 0,
          severity: "medium",
          suggested_description: "Signalement en attente de classification.",
        };
      }
    },

    async generateText(prompt: string): Promise<string> {
      const response = await client.chat.complete({
        model: textModel,
        messages: [
          {
            role: "system",
            content:
              "Tu es un assistant municipal. Reponds de maniere concise, professionnelle et bienveillante.",
          },
          { role: "user", content: prompt },
        ],
      });
      return (
        (typeof response.choices?.[0]?.message?.content === "string"
          ? response.choices[0].message.content
          : "") ?? ""
      );
    },

    async moderate(text: string): Promise<{ flagged: boolean; reason?: string }> {
      const response = await client.chat.complete({
        model: smallModel,
        messages: [
          {
            role: "system",
            content: `Analyse le texte suivant. Reponds en JSON: {"flagged": boolean, "reason": "..."}
Flagge si: contenu injurieux, donnees personnelles, hors sujet municipal.`,
          },
          { role: "user", content: text },
        ],
        responseFormat: { type: "json_object" },
      });
      try {
        const content =
          typeof response.choices?.[0]?.message?.content === "string"
            ? response.choices[0].message.content
            : '{"flagged":false}';
        return JSON.parse(content);
      } catch {
        return { flagged: false };
      }
    },
  };
}
