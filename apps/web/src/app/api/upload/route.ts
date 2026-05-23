import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { createServiceSupabase } from "@/lib/supabase/server";

const BUCKET = "signalements-photos";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("photo") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = file.name.split(".").pop() ?? "jpg";
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  // Strategy 1: Supabase Storage (preferred, sovereign)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    try {
      const supabase = createServiceSupabase();
      const { error } = await supabase.storage
        .from(BUCKET)
        .upload(key, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) throw error;

      // Generate a signed URL (valid 1 year) so admins/agents can view it
      const { data: signedData } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(key, 60 * 60 * 24 * 365);

      return NextResponse.json({
        data: {
          url: signedData?.signedUrl ?? `${supabaseUrl}/storage/v1/object/${BUCKET}/${key}`,
          key,
          bucket: BUCKET,
        },
      });
    } catch (err) {
      console.error("Supabase Storage upload error:", err);
      // Fall through to S3 fallback
    }
  }

  // Strategy 2: Scaleway S3 (alternative sovereign storage)
  if (process.env.S3_ACCESS_KEY) {
    try {
      const s3 = new S3Client({
        endpoint: process.env.S3_ENDPOINT ?? "https://s3.fr-par.scw.cloud",
        region: process.env.S3_REGION ?? "fr-par",
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_KEY ?? "",
        },
        forcePathStyle: true,
      });

      const s3Bucket = process.env.S3_BUCKET ?? "signalicity-photos";
      const s3Key = `signalements/${key}`;

      await s3.send(
        new PutObjectCommand({
          Bucket: s3Bucket,
          Key: s3Key,
          Body: buffer,
          ContentType: file.type,
          ACL: "public-read",
        })
      );

      const url = `${process.env.S3_ENDPOINT}/${s3Bucket}/${s3Key}`;
      return NextResponse.json({ data: { url, key: s3Key } });
    } catch (err) {
      console.error("S3 upload error:", err);
    }
  }

  // Fallback: placeholder for dev
  const url = `https://placehold.co/800x600/2563EB/white?text=${encodeURIComponent(file.name)}`;
  return NextResponse.json({ data: { url, key } });
}
