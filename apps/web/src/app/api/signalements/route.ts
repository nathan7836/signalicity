import { NextRequest, NextResponse } from "next/server";
import { MOCK_SIGNALEMENTS } from "@/lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const limit = parseInt(searchParams.get("limit") ?? "50");
  const offset = parseInt(searchParams.get("offset") ?? "0");

  let results = [...MOCK_SIGNALEMENTS];

  if (status && status !== "all") {
    results = results.filter((s) => s.status === status);
  }
  if (category && category !== "all") {
    results = results.filter((s) => s.category_id === category);
  }

  // In production: Supabase query
  // const supabase = createServiceSupabase();
  // let query = supabase.from('signalements').select('*').order('created_at', { ascending: false });
  // if (status) query = query.eq('status', status);
  // if (category) query = query.eq('category_id', category);
  // const { data, error } = await query.range(offset, offset + limit - 1);

  return NextResponse.json({
    data: results.slice(offset, offset + limit),
    total: results.length,
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  // In production:
  // const supabase = createServiceSupabase();
  // const { data, error } = await supabase.from('signalements').insert({
  //   ...body,
  //   location: `SRID=4326;POINT(${body.longitude} ${body.latitude})`,
  //   status: 'received',
  // }).select().single();

  const newSignalement = {
    id: `sig-${Date.now()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    status: "received",
    severity: body.severity ?? "medium",
    ...body,
  };

  return NextResponse.json({ data: newSignalement }, { status: 201 });
}
