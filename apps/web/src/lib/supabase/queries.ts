import { createClient } from "./client";
import type {
  Signalement,
  Category,
  DashboardStats,
  StatusHistory,
  SignalementStatus,
} from "@signalicity/shared";

const supabase = createClient();

// --- Signalements ---

export async function fetchSignalements(filters?: {
  status?: string;
  category_id?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  let query = supabase
    .from("signalements")
    .select("*, categories(name, slug, icon, color)")
    .order("created_at", { ascending: false });

  if (filters?.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters?.category_id && filters.category_id !== "all") {
    query = query.eq("category_id", filters.category_id);
  }
  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,address.ilike.%${filters.search}%`
    );
  }
  if (filters?.limit) {
    const offset = filters.offset ?? 0;
    query = query.range(offset, offset + filters.limit - 1);
  }

  const { data, error, count } = await query;
  if (error) throw error;
  return { data: data ?? [], count };
}

export async function fetchSignalement(id: string) {
  const { data, error } = await supabase
    .from("signalements")
    .select("*, categories(name, slug, icon, color)")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function createSignalement(input: {
  photo_url: string;
  latitude: number;
  longitude: number;
  address?: string;
  category_id?: string;
  title: string;
  description: string;
  ai_description?: string;
  severity?: string;
  user_id?: string;
  guest_email?: string;
}) {
  const { data, error } = await supabase
    .from("signalements")
    .insert({
      ...input,
      location: `SRID=4326;POINT(${input.longitude} ${input.latitude})`,
      status: "received",
      severity: input.severity ?? "medium",
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSignalement(
  id: string,
  updates: Partial<{
    status: SignalementStatus;
    severity: string;
    category_id: string;
    assigned_agent_id: string;
    assigned_service_id: string;
    internal_notes: string;
    ai_description: string;
    photo_after_url: string;
  }>
) {
  const { data, error } = await supabase
    .from("signalements")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// --- Status History ---

export async function fetchStatusHistory(signalementId: string) {
  const { data, error } = await supabase
    .from("status_history")
    .select("*")
    .eq("signalement_id", signalementId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// --- Categories ---

export async function fetchCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

// --- Dashboard Stats ---

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [totalRes, resolvedRes, inProgressRes, receivedRes] = await Promise.all(
    [
      supabase
        .from("signalements")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("signalements")
        .select("*", { count: "exact", head: true })
        .eq("status", "resolved"),
      supabase
        .from("signalements")
        .select("*", { count: "exact", head: true })
        .eq("status", "in_progress"),
      supabase
        .from("signalements")
        .select("*", { count: "exact", head: true })
        .eq("status", "received"),
    ]
  );

  const total = totalRes.count ?? 0;
  const resolved = resolvedRes.count ?? 0;
  const inProgress = inProgressRes.count ?? 0;
  const received = receivedRes.count ?? 0;

  // Avg resolution time
  const { data: resolvedData } = await supabase
    .from("signalements")
    .select("created_at, resolved_at")
    .eq("status", "resolved")
    .not("resolved_at", "is", null);

  let avgHours = 0;
  if (resolvedData && resolvedData.length > 0) {
    const totalHours = resolvedData.reduce((sum, s) => {
      const diff =
        new Date(s.resolved_at!).getTime() - new Date(s.created_at).getTime();
      return sum + diff / 3600000;
    }, 0);
    avgHours = Math.round(totalHours / resolvedData.length);
  }

  return {
    total_signalements: total,
    resolved_count: resolved,
    in_progress_count: inProgress,
    received_count: received,
    avg_resolution_hours: avgHours,
    resolution_rate: total > 0 ? Math.round((resolved / total) * 1000) / 10 : 0,
  };
}

// --- Notifications ---

export async function fetchNotifications(userId: string) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);

  if (error) throw error;
}

// --- Nearby signalements (for dedup) ---

export async function fetchNearbySignalements(
  lat: number,
  lng: number,
  radiusMeters: number = 50
) {
  const { data, error } = await supabase.rpc("nearby_signalements", {
    lat,
    lng,
    radius_m: radiusMeters,
  });

  if (error) throw error;
  return data ?? [];
}
