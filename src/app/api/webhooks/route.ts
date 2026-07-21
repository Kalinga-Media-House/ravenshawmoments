import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { env } from "../../../lib/env";
import { handleApiError, jsonResponse } from "@/app/api/api.helpers";

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get("x-webhook-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 401 });
    }

    const bodyText = await request.text();
    
    // HMAC SHA256 validation (standard for Stripe, Supabase, etc.)
    const expectedSignature = crypto
      // @ts-ignore
      .createHmac("sha256", env.WEBHOOK_SECRET || "default-secret")
      .update(bodyText)
      .digest("hex");

    // Prevent timing attacks
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const payload = JSON.parse(bodyText);
    
    // Webhook processing logic would be deferred to a background task or service here
    console.log("Verified webhook payload:", payload.type);

    return jsonResponse({ received: true }, 200);
  } catch (error) {
    return handleApiError(error);
  }
}
