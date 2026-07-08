// =============================================================================
// Ravenshaw Moments
// File      : src/features/profile/services/index.ts
// Purpose   : Profile Feature Service Layer Barrel File & Orchestrated Facade
// =============================================================================

import { profileCoreService } from "./profile.service";
import { profileGalleryService } from "./profile-gallery.service";
import { profileClaimService } from "./profile-claim.service";
import { profilePrivacyService } from "./profile-privacy.service";
import { profileCertificateService } from "./profile-certificate.service";

export * from "./profile.service";
export * from "./profile-gallery.service";
export * from "./profile-claim.service";
export * from "./profile-privacy.service";
export * from "./profile-certificate.service";

/**
 * Unified facade combining all modularized Profile feature services.
 * Preserves full backwards compatibility for server actions and APIs.
 */
export const profileService = {
  ...profileCoreService,
  ...profileGalleryService,
  ...profileClaimService,
  ...profilePrivacyService,
  ...profileCertificateService,
};
