// =============================================================================
// Ravenshaw Moments
// File      : src/types/profile.ts
// Purpose   : Universal Profile System Domain Interfaces & Type Definitions
// =============================================================================

import { BaseEntity } from "./index";

/**
 * Supported profile types across the Ravenshaw ecosystem.
 * Includes Student, Teacher, Alumni, Department CR, Hostel BMC,
 * Organization Admin, Contributor, and Volunteer.
 */
export type ProfileType =
  | "student"
  | "teacher"
  | "alumni"
  | "department_cr"
  | "hostel_bmc"
  | "organization_admin"
  | "contributor"
  | "volunteer"
  | "external_participant"
  | "admin"
  | "super_admin";

/**
 * Visibility levels supported by the privacy model.
 */
export type ProfileVisibility = "public" | "ravenshaw_only" | "private";

/**
 * Verification status for claims, documents, and proofs.
 */
export type VerificationStatus = "pending" | "approved" | "rejected";

/**
 * Profile verification state.
 */
export type ProfileStatus = "unclaimed" | "pending" | "active" | "suspended" | "archived";

/**
 * Certificate types supported by the certificate engine.
 */
export type CertificateType =
  | "winner"
  | "runner_up"
  | "second_runner_up"
  | "participation"
  | "appreciation"
  | "volunteer"
  | "organizer"
  | "judge"
  | "speaker"
  | "special_recognition";

/**
 * Gallery item representing a single photo within the 50-image profile quota.
 */
export interface ProfileGalleryItem extends BaseEntity {
  gallery_album_id: string;
  media_file_id: string;
  media_url: string;
  caption?: string;
  display_order: number;
  is_cover?: boolean;
  is_featured?: boolean;
  uploaded_by?: string;
}

/**
 * Digital certificate record with QR verification capabilities.
 */
export interface ProfileCertificate extends BaseEntity {
  public_id: string;
  certificate_number: string;
  profile_id: string;
  entity_type: string;
  entity_id: string;
  certificate_type: CertificateType;
  title: string;
  description?: string;
  issued_on: string;
  issued_by?: string;
  qr_token: string;
  verification_url?: string;
  pdf_media_url?: string;
  preview_media_url?: string;
  is_revoked?: boolean;
}

/**
 * Achievement summary card for public display.
 */
export interface AchievementSummary extends BaseEntity {
  public_id: string;
  title: string;
  slug: string;
  category_name?: string;
  achievement_date?: string;
  issuing_organization?: string;
  position?: string;
  featured_media_url?: string;
  certificate_media_url?: string;
}

/**
 * Private contribution proof uploaded by sponsors or contributors.
 */
export interface ContributionProof extends BaseEntity {
  profile_id: string;
  media_file_id: string;
  media_url?: string;
  title: string;
  description?: string;
  amount_reference?: number;
  verification_status: VerificationStatus;
  remarks?: string;
  reviewed_at?: string;
}

/**
 * Granular user-controlled privacy settings matrix.
 */
export interface ProfilePrivacySettings {
  profile_id: string;
  profile_visibility: ProfileVisibility;
  email_visibility: ProfileVisibility;
  phone_visibility: ProfileVisibility;
  dob_visibility: ProfileVisibility;
  gallery_visibility: ProfileVisibility;
  achievements_visibility: ProfileVisibility;
}

/**
 * Public Profile Identity — Stripped of all sensitive private data.
 * Safe for public search, QR code rendering, and unauthenticated viewing.
 */
export interface PublicProfile extends BaseEntity {
  public_id: string;
  username: string;
  slug: string;
  full_name: string;
  avatar_url?: string;
  cover_url?: string;
  profile_type: ProfileType;
  bio?: string;
  department_name?: string;
  batch_year?: string;
  is_verified: boolean;
  achievements: AchievementSummary[];
  winner_certificates: ProfileCertificate[];
  gallery_items: ProfileGalleryItem[];
}

/**
 * Private Profile Identity — Complete record for authenticated owners and admins.
 * Includes sensitive academic enrollment identifiers, contact details, and private certificates.
 */
export interface PrivateProfile extends PublicProfile {
  auth_user_id: string;
  email?: string;
  phone?: string;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  date_of_birth?: string;
  roll_number?: string;
  registration_number?: string;
  is_profile_claimed: boolean;
  profile_status: ProfileStatus;
  privacy_settings: ProfilePrivacySettings;
  participation_certificates: ProfileCertificate[];
  contribution_proofs: ContributionProof[];
}

/**
 * Roll Number profile claim request submitted by existing university students.
 */
export interface ProfileClaimRequest extends BaseEntity {
  profile_id: string;
  claimant_auth_user_id: string;
  roll_number: string;
  registration_number?: string;
  verification_status: VerificationStatus;
  supporting_document_url?: string;
  remarks?: string;
  reviewed_at?: string;
}
