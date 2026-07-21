// =============================================================================
// Ravenshaw Moments
// File      : src/lib/payu/hash.ts
// Purpose   : Server-only PayU hash generation and verification
// Security  : Merchant Salt must NEVER leave the server
// =============================================================================

import { createHash } from "crypto";

/**
 * Generates SHA-512 hash for PayU payment request.
 *
 * PayU request hash formula:
 * sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
 *
 * Empty UDF fields are included as empty strings.
 * The pipe-delimited format must be exact.
 */
export function generatePayURequestHash(params: {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  salt: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}): string {
  const hashString = [
    params.key,
    params.txnid,
    params.amount,
    params.productinfo,
    params.firstname,
    params.email,
    params.udf1 || "",
    params.udf2 || "",
    params.udf3 || "",
    params.udf4 || "",
    params.udf5 || "",
    "",
    "",
    "",
    "",
    "",
    params.salt,
  ].join("|");

  return createHash("sha512").update(hashString).digest("hex");
}

/**
 * Verifies PayU response hash.
 *
 * PayU response hash formula (reverse):
 * sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayUResponseHash(params: {
  salt: string;
  status: string;
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  receivedHash: string;
}): boolean {
  const hashString = [
    params.salt,
    params.status,
    "",
    "",
    "",
    "",
    "",
    params.udf5 || "",
    params.udf4 || "",
    params.udf3 || "",
    params.udf2 || "",
    params.udf1 || "",
    params.email,
    params.firstname,
    params.productinfo,
    params.amount,
    params.txnid,
    params.key,
  ].join("|");

  const computedHash = createHash("sha512")
    .update(hashString)
    .digest("hex");

  // Constant-time comparison to prevent timing attacks
  if (computedHash.length !== params.receivedHash.length) return false;

  let result = 0;
  for (let i = 0; i < computedHash.length; i++) {
    result |= computedHash.charCodeAt(i) ^ params.receivedHash.charCodeAt(i);
  }
  return result === 0;
}
