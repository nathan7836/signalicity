import type { Signalement, AIClassification } from "@signalicity/shared";

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/api";

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const json = await res.json();
  return json.data;
}

export async function getSignalements(params?: {
  status?: string;
  limit?: number;
}): Promise<Signalement[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.limit) query.set("limit", String(params.limit));
  return fetchAPI(`/signalements?${query}`);
}

export async function getSignalement(id: string): Promise<Signalement> {
  return fetchAPI(`/signalements/${id}`);
}

export async function createSignalement(data: {
  photo_url: string;
  latitude: number;
  longitude: number;
  address?: string;
  category_id?: string;
  title: string;
  description: string;
  guest_email?: string;
}): Promise<Signalement> {
  return fetchAPI("/signalements", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function classifyPhoto(
  signalementId: string,
  imageBase64: string
): Promise<AIClassification> {
  return fetchAPI(`/signalements/${signalementId}/classify`, {
    method: "POST",
    body: JSON.stringify({ image_base64: imageBase64 }),
  });
}

export async function uploadPhoto(uri: string): Promise<string> {
  const formData = new FormData();
  const filename = uri.split("/").pop() ?? "photo.jpg";
  formData.append("photo", {
    uri,
    name: filename,
    type: "image/jpeg",
  } as unknown as Blob);

  const res = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  const json = await res.json();
  return json.data.url;
}
