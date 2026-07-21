// =============================================================================
// Ravenshaw Moments
// File      : src/lib/payu/config.ts
// Purpose   : Server-only PayU payment gateway configuration
// Security  : This file must NEVER be imported from client components
// =============================================================================

const PAYU_TEST_URL = "https://test.payu.in/_payment";
const PAYU_PRODUCTION_URL = "https://secure.payu.in/_payment";

const PAYU_TEST_VERIFY_URL = "https://test.payu.in/merchant/postservice?form=2";
const PAYU_PRODUCTION_VERIFY_URL =
  "https://info.payu.in/merchant/postservice?form=2";

export type PayUEnvironment = "test" | "production";

export interface PayUConfig {
  merchantKey: string;
  merchantSalt: string;
  environment: PayUEnvironment;
  paymentUrl: string;
  verifyUrl: string;
  appUrl: string;
  successUrl: string;
  failureUrl: string;
}

let _cachedConfig: PayUConfig | null = null;
let _configError: string | null = null;

/**
 * Returns validated PayU configuration or null if misconfigured.
 * Configuration is cached after first successful validation.
 * Secrets are never exposed in error messages returned to clients.
 */
export function getPayUConfig(): PayUConfig | null {
  if (_cachedConfig) return _cachedConfig;
  if (_configError) return null;

  const merchantKey = process.env.PAYU_MERCHANT_KEY;
  const merchantSalt = process.env.PAYU_MERCHANT_SALT;
  const payuEnv = (process.env.PAYU_ENV || "test") as string;
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!merchantKey || merchantKey.trim().length === 0) {
    _configError = "PAYU_MERCHANT_KEY is not configured";
    if (process.env.NODE_ENV === "development") {
      console.warn(`[PayU] ${_configError}`);
    }
    return null;
  }

  if (!merchantSalt || merchantSalt.trim().length === 0) {
    _configError = "PAYU_MERCHANT_SALT is not configured";
    if (process.env.NODE_ENV === "development") {
      console.warn(`[PayU] ${_configError}`);
    }
    return null;
  }

  if (payuEnv !== "test" && payuEnv !== "production") {
    _configError = "PAYU_ENV must be 'test' or 'production'";
    if (process.env.NODE_ENV === "development") {
      console.warn(`[PayU] ${_configError}`);
    }
    return null;
  }

  // Production safety: require HTTPS
  if (payuEnv === "production" && !appUrl.startsWith("https://")) {
    _configError = "Production NEXT_PUBLIC_APP_URL must use HTTPS";
    if (process.env.NODE_ENV === "development") {
      console.warn(`[PayU] ${_configError}`);
    }
    return null;
  }

  const environment: PayUEnvironment = payuEnv;
  const paymentUrl =
    environment === "production" ? PAYU_PRODUCTION_URL : PAYU_TEST_URL;
  const verifyUrl =
    environment === "production"
      ? PAYU_PRODUCTION_VERIFY_URL
      : PAYU_TEST_VERIFY_URL;

  const baseUrl = appUrl.replace(/\/$/, "");

  _cachedConfig = {
    merchantKey: merchantKey.trim(),
    merchantSalt: merchantSalt.trim(),
    environment,
    paymentUrl,
    verifyUrl,
    appUrl: baseUrl,
    successUrl: `${baseUrl}/api/payments/payu/success`,
    failureUrl: `${baseUrl}/api/payments/payu/failure`,
  };

  return _cachedConfig;
}

/**
 * Returns whether PayU is properly configured without exposing secrets.
 * Safe to call from server components that need to decide whether to show
 * the donation form or the payment-unavailable notice.
 */
export function isPayUConfigured(): boolean {
  return getPayUConfig() !== null;
}

/**
 * Resets cached configuration. Useful for testing.
 */
export function resetPayUConfigCache(): void {
  _cachedConfig = null;
  _configError = null;
}
