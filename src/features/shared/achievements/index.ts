// =============================================================================
// Ravenshaw Moments
// File      : src/features/shared/achievements/index.ts
// Purpose   : Shared Platform Layer — Universal Achievements, Awards & Certificates
// =============================================================================

export type SharedAchievementLevel = "international" | "national" | "state" | "university" | "department" | "other";

export interface SharedAchievementItem {
  id: string;
  tenant_id: string; // Profile ID or Department ID
  title: string;
  description?: string;
  level?: SharedAchievementLevel;
  awarded_date: string;
  issuer?: string;
  certificate_media_id?: string;
  certificate_url?: string;
  is_verified: boolean;
}

/**
 * Validates achievement date against historical limits (cannot be future).
 */
export function isValidAchievementDate(dateIso: string, now = new Date()): boolean {
  const date = new Date(dateIso);
  return !Number.isNaN(date.getTime()) && date <= now;
}
