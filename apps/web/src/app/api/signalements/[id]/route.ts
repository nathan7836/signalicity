import { NextRequest, NextResponse } from "next/server";
import { MOCK_SIGNALEMENTS } from "@/lib/mock-data";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const signalement = MOCK_SIGNALEMENTS.find((s) => s.id === params.id);

  if (!signalement) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // In production:
  // const supabase = createServiceSupabase();
  // const { data } = await supabase.from('signalements').select('*').eq('id', params.id).single();

  return NextResponse.json({ data: signalement });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const signalement = MOCK_SIGNALEMENTS.find((s) => s.id === params.id);

  if (!signalement) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // In production:
  // const supabase = createServiceSupabase();
  // const { data, error } = await supabase
  //   .from('signalements')
  //   .update(body)
  //   .eq('id', params.id)
  //   .select()
  //   .single();

  const updated = { ...signalement, ...body, updated_at: new Date().toISOString() };

  return NextResponse.json({ data: updated });
}
