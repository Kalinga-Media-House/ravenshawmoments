import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { env } from "../env";
import type { Database } from "../../types/database.types";

export async function createClient() {
  try {
    const cookieStore = await cookies();

    return createServerClient<any>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          // @ts-ignore
          setAll(cookiesToSet) {
            try {
              // @ts-ignore
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );
  } catch (error) {
    // Next.js throws an error if `cookies()` is called outside a request scope
    // (e.g., during generateStaticParams, generateMetadata, or ISR revalidation).
    // In these static phases, we fall back to a standard anonymous client so
    // public data fetching continues to work without breaking the build.
    return createSupabaseClient<any>(
      env.NEXT_PUBLIC_SUPABASE_URL,
      env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  }
}