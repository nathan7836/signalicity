import { NextRequest, NextResponse } from "next/server";
import { classifyPhoto } from "@signalicity/ai";
import { createMistralProvider } from "@signalicity/ai/src/mistral";
import { setProvider } from "@signalicity/ai/src/provider";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { image_base64, user_text } = body;

  if (!image_base64) {
    return NextResponse.json(
      { error: "image_base64 is required" },
      { status: 400 }
    );
  }

  // Initialize Mistral provider if API key is set
  if (process.env.MISTRAL_API_KEY) {
    setProvider(
      createMistralProvider({ apiKey: process.env.MISTRAL_API_KEY })
    );
  }

  try {
    const classification = await classifyPhoto(image_base64, user_text);

    // In production: update signalement in DB
    // const supabase = createServiceSupabase();
    // await supabase.from('signalements').update({
    //   category_id: getCategoryIdBySlug(classification.category_slug),
    //   severity: classification.severity,
    //   ai_description: classification.suggested_description,
    // }).eq('id', params.id);

    return NextResponse.json({ data: classification });
  } catch (err) {
    console.error("Classification error:", err);
    // Fallback
    return NextResponse.json({
      data: {
        category_slug: "autre",
        category_confidence: 0,
        severity: "medium",
        suggested_description: "Classification automatique indisponible.",
      },
    });
  }
}
