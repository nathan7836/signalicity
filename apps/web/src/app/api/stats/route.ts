import { NextResponse } from "next/server";
import { MOCK_STATS } from "@/lib/mock-data";

export async function GET() {
  // In production:
  // const supabase = createServiceSupabase();
  //
  // const [total, resolved, inProgress, received] = await Promise.all([
  //   supabase.from('signalements').select('*', { count: 'exact', head: true }),
  //   supabase.from('signalements').select('*', { count: 'exact', head: true }).eq('status', 'resolved'),
  //   supabase.from('signalements').select('*', { count: 'exact', head: true }).eq('status', 'in_progress'),
  //   supabase.from('signalements').select('*', { count: 'exact', head: true }).eq('status', 'received'),
  // ]);
  //
  // const { data: avgData } = await supabase.rpc('avg_resolution_hours');

  return NextResponse.json({ data: MOCK_STATS });
}
