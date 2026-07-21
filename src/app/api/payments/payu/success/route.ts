// =============================================================================
// Ravenshaw Moments
// File      : src/app/api/payments/payu/success/route.ts
// Purpose   : PayU success callback handler
// Security  : Verifies response hash before marking payment as successful
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getPayUConfig } from "@/lib/payu/config";
import { verifyPayUResponseHash } from "@/lib/payu/hash";
import { verifyPayUTransaction } from "@/lib/payu/verify";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const config = getPayUConfig();

  // Default redirect for misconfigured state
  const baseUrl =
    config?.appUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const failureRedirect = `${baseUrl}/donations/status?result=error`;

  if (!config) {
    return NextResponse.redirect(failureRedirect, { status: 303 });
  }

  try {
    const formData = await request.formData();

    // Extract PayU response fields
    const status = formData.get("status")?.toString() || "";
    const txnid = formData.get("txnid")?.toString() || "";
    const amount = formData.get("amount")?.toString() || "";
    const productinfo = formData.get("productinfo")?.toString() || "";
    const firstname = formData.get("firstname")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const phone = formData.get("phone")?.toString() || "";
    const hash = formData.get("hash")?.toString() || "";
    const mihpayid = formData.get("mihpayid")?.toString() || "";
    const key = formData.get("key")?.toString() || "";
    const mode = formData.get("mode")?.toString() || "";
    const udf1 = formData.get("udf1")?.toString() || "";
    const udf2 = formData.get("udf2")?.toString() || "";
    const udf3 = formData.get("udf3")?.toString() || "";
    const udf4 = formData.get("udf4")?.toString() || "";
    const udf5 = formData.get("udf5")?.toString() || "";

    // Validate required fields exist
    if (!txnid || !hash || !status || !amount || !key) {
      console.error("[PayU Success] Missing required callback fields");
      return NextResponse.redirect(failureRedirect, { status: 303 });
    }

    // Verify the merchant key matches
    if (key !== config.merchantKey) {
      console.error("[PayU Success] Merchant key mismatch");
      return NextResponse.redirect(failureRedirect, { status: 303 });
    }

    // Verify the response hash
    const isHashValid = verifyPayUResponseHash({
      salt: config.merchantSalt,
      status,
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5,
      receivedHash: hash,
    });

    if (!isHashValid) {
      console.error("[PayU Success] Hash verification failed for txnid:", txnid);
      return NextResponse.redirect(
        `${baseUrl}/donations/status?result=hash_error`,
        { status: 303 }
      );
    }

    // Check if PayU reports success
    if (status !== "success") {
      console.warn("[PayU Success] Non-success status received:", status);
      return NextResponse.redirect(
        `${baseUrl}/donations/status?result=failed&ref=${encodeURIComponent(
          txnid
        )}`,
        { status: 303 }
      );
    }

    // Server-side verification with PayU API for additional assurance
    let verificationStatus = "callback_verified";
    const verification = await verifyPayUTransaction(txnid);
    if (verification) {
      // Cross-check amount
      const verifiedAmount = parseFloat(verification.amount);
      const callbackAmount = parseFloat(amount);
      if (
        Math.abs(verifiedAmount - callbackAmount) > 0.01 ||
        verification.status !== "success"
      ) {
        console.error(
          "[PayU Success] Verification mismatch. Callback amount:",
          amount,
          "Verified amount:",
          verification.amount,
          "Verified status:",
          verification.status
        );
        return NextResponse.redirect(
          `${baseUrl}/donations/status?result=verification_pending&ref=${encodeURIComponent(
            txnid
          )}`,
          { status: 303 }
        );
      }
      verificationStatus = "api_verified";
    }

    // =========================================================================
    // DATABASE PERSISTENCE
    // =========================================================================
    const supabase = createAdminClient();

    // Idempotency Check: Does transaction exist?
    const { data: existingTxn } = await supabase
      .from("payment_transactions")
      .select("id, payment_id")
      .eq("transaction_reference", txnid)
      .maybeSingle();

    if (!existingTxn) {
      // Find or create profile logic is REMOVED to avoid fake authentication users.
      // We rely on udf5 for authenticated profiles, or match existing by email securely.
      let profileId = null;
      if (udf5) {
        profileId = udf5;
      } else {
        // Try to find profile by email if they are already registered
        const { data: profile } = await supabase
          .from("profiles")
          .select("id")
          .eq("email", email)
          .maybeSingle();

        if (profile) {
          // @ts-ignore
          profileId = profile.id;
        }
      }

      // Create payment record (profile_id and entity_id can now be null)
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          // @ts-ignore
          profile_id: profileId,
          entity_type: "university",
          entity_id: null,
          amount: parseFloat(amount),
          currency_code: "INR",
          payment_provider: "payu",
          provider_payment_id: mihpayid,
          provider_order_id: txnid,
          payment_status: "paid",
          description: productinfo,
          paid_at: new Date().toISOString(),
          // Store guest info
          payer_email: email,
          payer_name: firstname,
          payer_phone: phone,
        })
        .select("id")
        .single();

      if (!paymentError && payment) {
        // Create transaction record
        await supabase.from("payment_transactions").insert({
          // @ts-ignore
          payment_id: payment.id,
          transaction_reference: txnid,
          gateway_response: {
            mihpayid,
            mode,
            status,
            verificationStatus,
          },
          amount: parseFloat(amount),
          payment_status: "paid",
        });

        // Create donation record
        const visibility = (udf1 || "public") as
          | "public"
          | "public_hide_amount"
          | "anonymous";

        await supabase.from("donations").insert({
          // @ts-ignore
          profile_id: profileId,
          // @ts-ignore
          payment_id: payment.id,
          amount: parseFloat(amount),
          visibility: visibility,
          message: udf2 || null,
          donor_name_override: udf4 || null,
          // Store guest info
          donor_email: email,
          donor_phone: phone,
        });
      } else {
        console.error("[PayU Success] Failed to create payment:", paymentError);
      }
    }

    const successUrl = new URL(`${baseUrl}/donations/status`);
    successUrl.searchParams.set("result", "success");
    successUrl.searchParams.set("ref", txnid);
    successUrl.searchParams.set("amt", amount);
    successUrl.searchParams.set("v", verificationStatus);
    if (mode) successUrl.searchParams.set("mode", mode);

    return NextResponse.redirect(successUrl.toString(), { status: 303 });
  } catch (error) {
    console.error("[PayU Success] Error processing callback:", error);
    return NextResponse.redirect(failureRedirect, { status: 303 });
  }
}
