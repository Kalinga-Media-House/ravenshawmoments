// =============================================================================
// Ravenshaw Moments
// File      : src/app/api/payments/payu/failure/route.ts
// Purpose   : PayU failure/cancellation callback handler
// Security  : Verifies response hash, does not expose internal errors
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { getPayUConfig } from "@/lib/payu/config";
import { verifyPayUResponseHash } from "@/lib/payu/hash";

export async function POST(request: NextRequest) {
  const config = getPayUConfig();
  const baseUrl = config?.appUrl || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const formData = await request.formData();

    const status = formData.get("status")?.toString() || "failure";
    const txnid = formData.get("txnid")?.toString() || "";
    const amount = formData.get("amount")?.toString() || "";
    const productinfo = formData.get("productinfo")?.toString() || "";
    const firstname = formData.get("firstname")?.toString() || "";
    const email = formData.get("email")?.toString() || "";
    const hash = formData.get("hash")?.toString() || "";
    const key = formData.get("key")?.toString() || "";
    const udf1 = formData.get("udf1")?.toString() || "";
    const udf2 = formData.get("udf2")?.toString() || "";
    const udf3 = formData.get("udf3")?.toString() || "";
    const udf4 = formData.get("udf4")?.toString() || "";
    const udf5 = formData.get("udf5")?.toString() || "";

    // Verify response hash when config is available
    if (config && hash && key === config.merchantKey) {
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
        console.error("[PayU Failure] Hash verification failed for txnid:", txnid);
      }
    }

    // Determine failure reason for the status page
    const resultType = status === "userCancelled" ? "cancelled" : "failed";

    const failureUrl = new URL(`${baseUrl}/donations/status`);
    failureUrl.searchParams.set("result", resultType);
    if (txnid) failureUrl.searchParams.set("ref", txnid);

    return NextResponse.redirect(failureUrl.toString(), { status: 303 });
  } catch (error) {
    console.error("[PayU Failure] Error processing callback:", error);
    return NextResponse.redirect(
      `${baseUrl}/donations/status?result=error`,
      { status: 303 }
    );
  }
}
