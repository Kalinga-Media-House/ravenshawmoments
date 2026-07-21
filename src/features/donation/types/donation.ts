// =============================================================================
// Ravenshaw Moments
// File      : src/features/donation/types/donation.ts
// Purpose   : Donation and Contributor Public Projection Types
// =============================================================================

/**
 * Public recognition preference for a contributor.
 * Controls whether the contributor's information appears in the public directory.
 */
export type PublicRecognitionPreference = "public" | "anonymous";

/**
 * Contribution purpose categories.
 * Only approved categories from the existing project documentation.
 */
export type ContributionPurpose =
  | "General Platform Support"
  | "Digital Preservation"
  | "Events"
  | "Competitions"
  | "Certificates"
  | "Community Initiative";

/**
 * Verified contribution status.
 * Payment status is determined only by server-side verification.
 */
export type ContributionStatus =
  | "verified"
  | "pending"
  | "failed"
  | "cancelled"
  | "refunded";

/**
 * Public Contributor Projection.
 * Strictly public-safe fields only. Never exposes email, phone, transaction ID,
 * payment order ID, billing information, or internal user ID.
 */
export interface PublicContributor {
  id: string;
  publicDisplayName: string;
  profilePhoto?: string;
  profilePhotoAlt?: string;
  profileSlug?: string;
  contributionDate?: string;
  contributionPurpose?: ContributionPurpose;
  label: string;
}

/**
 * Impact area displayed in the "How Contributions May Help" section.
 */
export interface ImpactArea {
  id: string;
  title: string;
  description: string;
  icon: string;
}

/**
 * Transparency principle displayed in the "Built with Transparency" section.
 */
export interface TransparencyPrinciple {
  id: string;
  title: string;
  description: string;
}

/**
 * FAQ item for the Donations FAQ section.
 */
export interface DonationFAQItem {
  id: string;
  question: string;
  answer: string;
}
