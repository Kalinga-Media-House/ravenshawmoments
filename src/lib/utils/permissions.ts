// =============================================================================
// Ravenshaw Moments
// File      : src/lib/utils/permissions.ts
// Purpose   : Centralized Permission Service & Verification Policy Evaluator
// =============================================================================

export interface ProfileVerificationInfo {
  status: "verified" | "pending" | "rejected" | "suspended" | "unclaimed" | "archived";
  isVerified: boolean;
  canCreateContent: boolean;
  rejectedReason?: string;
  authority?: string;
  verifiedAt?: string;
}

/**
 * Single source of truth check: Evaluates if the profile's `profile_status` is verified.
 * Handles both standard 'verified' enum string and legacy 'active' + is_verified state during migration.
 */
export function isProfileVerified(profile: any): boolean {
  if (!profile || typeof profile !== "object") return false;

  const status = typeof profile.profile_status === "string"
    ? profile.profile_status.toLowerCase()
    : "";

  if (status === "suspended" || status === "archived" || status === "rejected") {
    return false;
  }

  // Strictly check verified status (or active + is_verified transition state)
  return status === "verified" || (status === "active" && Boolean(profile.is_verified));
}

/**
 * Core Verification Rule: Only profiles with Profile Status = VERIFIED can create public user-generated content.
 * Returns TRUE only when profile.profile_status is verified (`verified` / `VERIFIED`).
 * Returns FALSE for Pending, Rejected, Suspended, Archived, Unclaimed, or null.
 */
export function canCreatePublicContent(profile: any): boolean {
  return isProfileVerified(profile);
}

/**
 * Can upload media (Photos, Videos, Campus Memories, Albums).
 */
export function canUploadMedia(profile: any): boolean {
  return canCreatePublicContent(profile);
}

/**
 * Can create and publish Business Listings or promotional items.
 */
export function canCreateBusiness(profile: any): boolean {
  return canCreatePublicContent(profile);
}

/**
 * Can submit or publish Alumni Stories, Hall of Fame, and Achievements.
 */
export function canSubmitAlumniStory(profile: any): boolean {
  return canCreatePublicContent(profile);
}

/**
 * Can participate in and post to Community Hub feeds.
 */
export function canJoinCommunity(profile: any): boolean {
  return canCreatePublicContent(profile);
}

/**
 * Can access and utilize full Identity / Verification features.
 */
export function canAccessIdentity(profile: any): boolean {
  if (!profile || typeof profile !== "object") return false;
  const status = typeof profile.profile_status === "string"
    ? profile.profile_status.toLowerCase()
    : "";
  return status !== "suspended" && status !== "archived";
}

/**
 * Extracts a structured information object describing the verification state of a profile
 * for UI rendering (e.g. ProfileVerificationDialog and Community Access card).
 */
export function getProfileVerificationInfo(profile: any, latestRequest?: any): ProfileVerificationInfo {
  const verified = isProfileVerified(profile);
  let rawStatus = typeof profile?.profile_status === "string" ? profile.profile_status.toLowerCase() : "unclaimed";

  if (verified) {
    rawStatus = "verified";
  } else if (rawStatus === "active" && !verified) {
    rawStatus = "pending";
  }

  let rejectedReason = typeof profile?.rejection_reason === "string" ? profile.rejection_reason : undefined;
  if (!rejectedReason && latestRequest?.remarks && latestRequest?.verification_status === "rejected") {
    rejectedReason = latestRequest.remarks;
  }
  if (!rejectedReason && rawStatus === "rejected") {
    rejectedReason = "Your verification request did not meet official criteria. Please update your profile information and submit again.";
  }

  let authority = "Department CR / Hostel BMC / Admin";
  if (profile?.verified_by_role || profile?.updated_by_role) {
    authority = profile.verified_by_role || profile.updated_by_role;
  }

  return {
    status: rawStatus as ProfileVerificationInfo["status"],
    isVerified: verified,
    canCreateContent: verified,
    rejectedReason,
    authority,
    verifiedAt: profile?.verified_at || profile?.updated_at
  };
}
