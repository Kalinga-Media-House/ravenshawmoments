// =============================================================================
// Ravenshaw Moments
// File      : src/app/api/payments/payu/initiate/route.ts
// Purpose   : Server-side PayU payment initialization
// Security  : Generates hash, txnid, and callback URLs on the server
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getPayUConfig } from "@/lib/payu/config";
import { generatePayURequestHash } from "@/lib/payu/hash";
import { donationFormSchema } from "@/features/donation/schemas/donation";
import { normalizeAmount, PAYU_PRODUCT_INFO } from "@/features/donation/config/donation";
import { createClient } from "@/lib/supabase/server";
import type { PayUSubmitParams } from "@/lib/payu/types";

// Simple in-memory rate limiter for payment initiation
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 5; // 5 initiations per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many payment requests. Please try again in a moment." },
        { status: 429 }
      );
    }

    // Validate PayU configuration
    const config = getPayUConfig();
    if (!config) {
      return NextResponse.json(
        { error: "Payment setup is temporarily unavailable. Please try again later." },
        { status: 503 }
      );
    }

    // Parse and validate request body
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Invalid request data." },
        { status: 400 }
      );
    }

    const parsed = donationFormSchema.safeParse(body);
    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message || "Please review your information.";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const data = parsed.data;

    // Normalize amount securely on the server
    const normalizedAmount = normalizeAmount(data.amount);

    // Generate server-side transaction ID
    const txnId = `RM_${Date.now()}_${randomUUID().replace(/-/g, "").slice(0, 12)}`;

    // Determine donation visibility for the database
    let visibility: "public" | "public_hide_amount" | "anonymous";
    if (!data.isPublic) {
      visibility = "anonymous";
    } else {
      // Amount is always hidden in public UI now for all new donations
      visibility = "public_hide_amount";
    }

    // Check if authenticated user exists to pass profile ID in UDF5
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let profileId = "";
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("auth_id", user.id)
        .single();
      if (profile) {
        // @ts-ignore
        profileId = profile.id;
      }
    }

    // Store UDF fields for verification on callback
    // udf1: visibility preference
    // udf2: unused
    // udf3: purpose
    // udf4: donor name override (for public display)
    // udf5: profile ID (if authenticated)
    const udf1 = visibility;
    const udf2 = "";
    const udf3 = data.purpose || "General Platform Support";
    const udf4 = data.isPublic ? data.fullName : "";
    const udf5 = profileId;

    // Generate PayU request hash on the server
    const hash = generatePayURequestHash({
      key: config.merchantKey,
      txnid: txnId,
      amount: normalizedAmount,
      productinfo: PAYU_PRODUCT_INFO,
      firstname: data.fullName,
      email: data.email,
      salt: config.merchantSalt,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
    });

    // Return safe payment submission parameters (no salt, no secrets)
    const submitParams: PayUSubmitParams = {
      action: config.paymentUrl,
      params: {
        key: config.merchantKey,
        txnid: txnId,
        amount: normalizedAmount,
        productinfo: PAYU_PRODUCT_INFO,
        firstname: data.fullName,
        email: data.email,
        phone: data.phone.replace(/[\s-]/g, ""),
        surl: config.successUrl,
        furl: config.failureUrl,
        hash,
        udf1,
        udf2,
        udf3,
        udf4,
        udf5,
      },
    };

    return NextResponse.json(submitParams);
  } catch (error) {
    console.error("[PayU Initiate] Unexpected error:", error);
    return NextResponse.json(
      {
        error:
          "We could not start the secure payment process. Please review your information and try again.",
      },
      { status: 500 }
    );
  }
}
