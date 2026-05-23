// --- Signalement ---

export type SignalementStatus = "received" | "in_progress" | "resolved";

export type SeverityLevel = "low" | "medium" | "high" | "critical";

export interface Signalement {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  guest_email: string | null;
  category_id: string;
  title: string;
  description: string;
  ai_description: string | null;
  photo_url: string;
  photo_after_url: string | null;
  latitude: number;
  longitude: number;
  address: string | null;
  status: SignalementStatus;
  severity: SeverityLevel;
  assigned_service_id: string | null;
  assigned_agent_id: string | null;
  duplicate_of: string | null;
  internal_notes: string | null;
  resolved_at: string | null;
}

export interface SignalementCreate {
  photo: File | Blob;
  latitude: number;
  longitude: number;
  address?: string;
  category_id?: string;
  description?: string;
  guest_email?: string;
}

// --- Categories ---

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  service_id: string;
}

// --- Services ---

export interface Service {
  id: string;
  name: string;
  slug: string;
}

// --- Users ---

export type UserRole = "citizen" | "agent" | "manager" | "admin" | "elected";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  service_id: string | null;
  avatar_url: string | null;
  created_at: string;
}

// --- Notifications ---

export interface Notification {
  id: string;
  user_id: string;
  signalement_id: string;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
}

// --- Status History ---

export interface StatusHistory {
  id: string;
  signalement_id: string;
  old_status: SignalementStatus | null;
  new_status: SignalementStatus;
  changed_by: string;
  note: string | null;
  created_at: string;
}

// --- Dashboard Stats ---

export interface DashboardStats {
  total_signalements: number;
  resolved_count: number;
  in_progress_count: number;
  received_count: number;
  avg_resolution_hours: number;
  resolution_rate: number;
}

// --- AI Classification ---

export interface AIClassification {
  category_slug: string;
  category_confidence: number;
  severity: SeverityLevel;
  suggested_description: string;
}
