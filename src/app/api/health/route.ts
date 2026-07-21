import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // 1. Check Database connection
    const { error: dbError } = await supabase.from("departments").select("id").limit(1);
    const dbStatus = dbError ? "disconnected" : "connected";

    // 2. Check Auth Service (Supabase)
    const { error: authError } = await supabase.auth.getSession();
    const authStatus = authError ? "disconnected" : "connected";

    // 3. Overall status
    const isHealthy = dbStatus === "connected" && authStatus === "connected";

    return NextResponse.json({
      status: isHealthy ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        authentication: authStatus,
        application: "ok",
      }
    }, { status: isHealthy ? 200 : 503 });
  } catch (error: any) {
    return NextResponse.json({
      status: "down",
      timestamp: new Date().toISOString(),
      error: error.message
    }, { status: 500 });
  }
}
