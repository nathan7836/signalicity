import type { AIClassification } from "@signalicity/shared";

export interface AIConfig {
  apiKey: string;
  visionModel?: string;
  textModel?: string;
  smallModel?: string;
}

export interface AIProvider {
  classifyImage(imageBase64: string): Promise<AIClassification>;
  generateText(prompt: string): Promise<string>;
  moderate(text: string): Promise<{ flagged: boolean; reason?: string }>;
}

let currentProvider: AIProvider | null = null;

export function setProvider(provider: AIProvider) {
  currentProvider = provider;
}

export function getProvider(): AIProvider {
  if (!currentProvider) {
    throw new Error(
      "AI provider not initialized. Call setProvider() first."
    );
  }
  return currentProvider;
}
