import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "../env";
import type { Database } from "../../types/database.types";

/**
 * CAUTION: This client uses the SERVICE_ROLE key.
 * It bypasses all RLS policies and must ONLY be used on the server
 * for administrative tasks or automated background processes.
 */
export function createAdminClient() {
  return createSupabaseClient<any>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
