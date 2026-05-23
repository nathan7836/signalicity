import { NextRequest, NextResponse } from "next/server";
import { generateCitizenResponse } from "@signalicity/ai";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { status, category, description, user_id, push_token } = body;

  // Generate AI response for citizen notification
  let message: string;
  try {
    message = await generateCitizenResponse(status, category, description);
  } catch {
    const fallback: Record<string, string> = {
      received:
        "Votre signalement a bien ete recu. Nos services vont l'examiner dans les meilleurs delais.",
      in_progress:
        "Votre signalement est en cours de traitement par nos equipes techniques.",
      resolved:
        "Votre signalement a ete traite. Merci pour votre contribution.",
    };
    message = fallback[status] ?? "Votre signalement a ete mis a jour.";
  }

  // Send push notification if token available
  if (push_token) {
    try {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: push_token,
          title: statusTitle(status),
          body: message,
          data: { signalement_id: params.id },
          sound: "default",
        }),
      });
    } catch (err) {
      console.error("Push notification error:", err);
    }
  }

  // Save notification in DB
  // const supabase = createServiceSupabase();
  // if (user_id) {
  //   await supabase.from('notifications').insert({
  //     user_id,
  //     signalement_id: params.id,
  //     title: statusTitle(status),
  //     body: message,
  //   });
  // }

  return NextResponse.json({
    data: { message, sent: !!push_token },
  });
}

function statusTitle(status: string): string {
  switch (status) {
    case "received":
      return "Signalement recu";
    case "in_progress":
      return "Pris en charge";
    case "resolved":
      return "Resolu !";
    default:
      return "Mise a jour";
  }
}
