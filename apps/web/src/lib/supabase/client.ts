import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export function createClient() {
  if (!supabaseUrl || !supabaseKey) {
    // Dev mode: return a mock-safe client that won't crash
    return createSupabaseClient("https://placeholder.supabase.co", "placeholder-key");
  }
  return createBrowserClient(supabaseUrl, supabaseKey);
}
