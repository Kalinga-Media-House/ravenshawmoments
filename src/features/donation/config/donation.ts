// =============================================================================
// Ravenshaw Moments
// File      : src/features/donation/config/donation.ts
// Purpose   : Centralized donation configuration
// =============================================================================

/**
 * Currency configuration.
 * The active PayU merchant account and project are configured for India.
 */
export const DONATION_CURRENCY = {
  code: "INR" as const,
  symbol: "\u20B9",
  locale: "en-IN",
} as const;

/**
 * Preset contribution amounts in INR.
 * Centralized so changes apply everywhere.
 */
export const DONATION_PRESETS = [100, 250, 500, 1000] as const;

/**
 * Contribution amount limits.
 * These are platform configuration, not PayU limits.
 */
export const DONATION_LIMITS = {
  min: 10,
  max: 100000,
  decimalPlaces: 2,
} as const;

/**
 * Format an amount for display using Indian locale.
 */
export function formatDonationAmount(amount: number): string {
  return new Intl.NumberFormat(DONATION_CURRENCY.locale, {
    style: "currency",
    currency: DONATION_CURRENCY.code,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Validate a donation amount.
 * Returns an error message string or null if valid.
 */
export function validateDonationAmount(value: unknown): string | null {
  if (value === undefined || value === null || value === "") {
    return "Please enter a contribution amount.";
  }

  const num = typeof value === "string" ? Number(value) : value;

  if (typeof num !== "number" || !Number.isFinite(num)) {
    return "Please enter a valid number.";
  }

  if (num <= 0) {
    return "Contribution amount must be greater than zero.";
  }

  if (num < DONATION_LIMITS.min) {
    return `Minimum contribution is ${DONATION_CURRENCY.symbol}${DONATION_LIMITS.min}.`;
  }

  if (num > DONATION_LIMITS.max) {
    return `Maximum contribution is ${DONATION_CURRENCY.symbol}${new Intl.NumberFormat(DONATION_CURRENCY.locale).format(DONATION_LIMITS.max)}.`;
  }

  // Check decimal precision
  const parts = String(num).split(".");
  if (parts[1] && parts[1].length > DONATION_LIMITS.decimalPlaces) {
    return `Amount cannot have more than ${DONATION_LIMITS.decimalPlaces} decimal places.`;
  }

  return null;
}

/**
 * Normalize an amount for financial storage.
 * Returns the amount as a string with exactly 2 decimal places.
 */
export function normalizeAmount(amount: number): string {
  return amount.toFixed(2);
}

/**
 * Default contribution purpose.
 */
export const DEFAULT_CONTRIBUTION_PURPOSE = "General Platform Support";

/**
 * Maximum message length for contribution messages.
 */
export const MAX_MESSAGE_LENGTH = 300;

/**
 * Product info string sent to PayU.
 */
export const PAYU_PRODUCT_INFO = "Ravenshaw Moments Contribution";
