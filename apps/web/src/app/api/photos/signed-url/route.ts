import { NextRequest, NextResponse } from "next/server";
import { createServiceSupabase } from "@/lib/supabase/server";

const BUCKET = "signalements-photos";

export async function POST(request: NextRequest) {
  const { key } = await request.json();

  if (!key) {
    return NextResponse.json({ error: "key is required" }, { status: 400 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    // Dev mode: return the key as-is (it's already a full URL or placeholder)
    return NextResponse.json({ data: { url: key } });
  }

  try {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(key, 60 * 60); // 1 hour

    if (error) throw error;

    return NextResponse.json({ data: { url: data.signedUrl } });
  } catch (err) {
    console.error("Signed URL error:", err);
    return NextResponse.json(
      { error: "Failed to generate signed URL" },
      { status: 500 }
    );
  }
}

// GET: batch signed URLs for multiple photos
export async function GET(request: NextRequest) {
  const keys = request.nextUrl.searchParams.get("keys")?.split(",") ?? [];

  if (keys.length === 0) {
    return NextResponse.json({ data: [] });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    return NextResponse.json({
      data: keys.map((key) => ({ key, url: key })),
    });
  }

  try {
    const supabase = createServiceSupabase();
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrls(keys, 60 * 60);

    if (error) throw error;

    return NextResponse.json({
      data: data?.map((d) => ({ key: d.path, url: d.signedUrl })) ?? [],
    });
  } catch (err) {
    console.error("Batch signed URLs error:", err);
    return NextResponse.json(
      { error: "Failed to generate signed URLs" },
      { status: 500 }
    );
  }
}
