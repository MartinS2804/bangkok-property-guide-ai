import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Builds a Supabase client that acts as the signed-in user (RLS applies),
 * for use inside server route handlers that receive a bearer token.
 */
export function createUserSupabaseClient(accessToken: string) {
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Backend is not configured");

  return createClient<Database>(url, key, {
    global: {
      headers: {
        apikey: key,
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
