import { NextRequest, NextResponse } from "next/server";
import { generateCitizenResponse } from "@signalicity/ai";
import { setProvider } from "@signalicity/ai/src/provider";
import { createMistralProvider } from "@signalicity/ai/src/mistral";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { status, category, description } = body;

  if (process.env.MISTRAL_API_KEY) {
    setProvider(
      createMistralProvider({ apiKey: process.env.MISTRAL_API_KEY })
    );
  }

  try {
    const message = await generateCitizenResponse(
      status,
      category,
      description
    );
    return NextResponse.json({ data: { message } });
  } catch {
    return NextResponse.json({
      data: {
        message:
          "Votre signalement a ete mis a jour. Merci pour votre contribution.",
      },
    });
  }
}
