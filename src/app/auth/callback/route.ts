import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}${next}`);
    }
  }

  // Return user to login with an error if exchange failed
  return NextResponse.redirect(`${env.NEXT_PUBLIC_APP_URL}/login?error=auth_callback_failed`);
}