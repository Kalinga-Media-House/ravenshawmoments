import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "../../lib/supabase/middleware";

export async function authMiddleware(request: NextRequest) {
  // updateSession handles the token refresh logic safely in Next.js Server Components
  return await updateSession(request);
}

// In the root middleware.ts, you would export:
// export { authMiddleware as middleware } from './src/auth/middleware/auth.middleware';
