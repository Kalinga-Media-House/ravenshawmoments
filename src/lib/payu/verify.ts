// =============================================================================
// Ravenshaw Moments
// File      : src/lib/payu/verify.ts
// Purpose   : Server-side PayU transaction verification
// Security  : Uses Merchant Key and Salt, must remain server-only
// =============================================================================

import { createHash } from "crypto";
import { getPayUConfig } from "./config";

/**
 * Verifies a transaction with PayU's server-to-server verification API.
 * Returns the parsed verification response, or null on failure.
 */
export async function verifyPayUTransaction(
  txnId: string
): Promise<{
  status: string;
  amount: string;
  txnid: string;
  mihpayid: string;
} | null> {
  const config = getPayUConfig();
  if (!config) return null;

  try {
    // Generate verification hash: sha512(key|command|var1|salt)
    const command = "verify_payment";
    const hashInput = `${config.merchantKey}|${command}|${txnId}|${config.merchantSalt}`;
    const hash = createHash("sha512").update(hashInput).digest("hex");

    const formData = new URLSearchParams();
    formData.append("key", config.merchantKey);
    formData.append("command", command);
    formData.append("var1", txnId);
    formData.append("hash", hash);

    const response = await fetch(config.verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    if (!response.ok) return null;

    const data = await response.json();

    // PayU returns { status: 1, transaction_details: { [txnId]: { ... } } }
    if (data?.status === 1 && data?.transaction_details?.[txnId]) {
      const txn = data.transaction_details[txnId];
      return {
        status: txn.status,
        amount: txn.amt || txn.amount,
        txnid: txn.txnid,
        mihpayid: txn.mihpayid,
      };
    }

    return null;
  } catch {
    return null;
  }
}
