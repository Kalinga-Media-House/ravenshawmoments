// =============================================================================
// Ravenshaw Moments
// File      : src/features/profile/services/profile.service.ts
// Purpose   : Core Identity & Academic Profile Service
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import { ProfileRepository, DbRow } from "@/lib/repositories/profile.repository";
import { basicProfileSchema, academicRecordSchema } from "@/lib/validation/profile-system";
import { logger } from "@/lib/logger";
import {
  PublicProfile,
  PrivateProfile,
  ProfileCertificate,
  AchievementSummary,
  ProfileGalleryItem,
  ProfilePrivacySettings,
  ProfileType,
  CertificateType,
  ProfileStatus,
  VerificationStatus,
} from "@/types/profile";

// =============================================================================
// Typed Application Errors
// =============================================================================

export class ProfileNotFoundError extends Error {
  constructor(message = "Profile not found.") {
    super(message);
    this.name = "ProfileNotFoundError";
  }
}

export class ProfileAccessDeniedError extends Error {
  constructor(message = "Access to this profile is restricted by user privacy settings.") {
    super(message);
    this.name = "ProfileAccessDeniedError";
  }
}

export class ProfileValidationError extends Error {
  constructor(message = "Profile validation failed.") {
    super(message);
    this.name = "ProfileValidationError";
  }
}

// =============================================================================
// Core Identity Service Implementation
// =============================================================================

export const profileCoreService = {
  /**
   * Initializes or updates a user's identity profile during onboarding.
   */
  createProfile: async (authUserId: string, email: string | undefined, rawData: Record<string, unknown>): Promise<void> => {
    const supabase = await createClient();
    const repo = new ProfileRepository(supabase);

    const validated = basicProfileSchema.parse(rawData);
    const slug = (validated.username || authUserId)
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]/g, "-");

    await repo.upsertProfile({
      id: authUserId,
      auth_user_id: authUserId,
      email,
      full_name: validated.full_name,
      username: validated.username,
      slug,
      bio: validated.bio,
    });

    logger.info(`Service: Profile initialized for user ${authUserId}`);
  },

  /**
   * Updates basic identity and biography details for an authenticated user.
   */
  updateBasicProfile: async (authUserId: string, rawData: Record<string, unknown>): Promise<void> => {
    const supabase = await createClient();
    const repo = new ProfileRepository(supabase);

    const validated = basicProfileSchema.parse(rawData);
    const slug = validated.username.toLowerCase();

    await repo.updateByAuthUserId(authUserId, {
      full_name: validated.full_name,
      username: validated.username,
      slug,
      bio: validated.bio,
      gender: validated.gender as "male" | "female" | "other" | "prefer_not_to_say" | undefined,
      updated_at: new Date().toISOString(),
    });

    logger.info(`Service: Basic profile updated for user ${authUserId}`);
  },

  /**
   * Updates private academic enrollment records and links Roll Number.
   */
  updateAcademicProfile: async (authUserId: string, rawData: Record<string, unknown>): Promise<void> => {
    const supabase = await createClient();
    const repo = new ProfileRepository(supabase);

    const validated = academicRecordSchema.parse(rawData);
    const profile = await repo.findByAuthUserId(authUserId);

    if (!profile) {
      throw new ProfileNotFoundError("Identity profile required before setting academic records.");
    }

    if (validated.date_of_birth) {
      await repo.updateById(String(profile.id), { date_of_birth: validated.date_of_birth });
    }

    await repo.upsertEducationRecord({
      profile_id: profile.id,
      department_program_id: validated.department_id,
      batch_id: validated.batch_id,
      roll_number: validated.roll_number,
      registration_number: validated.registration_number || null,
      is_primary: true,
      updated_by: profile.id,
      updated_at: new Date().toISOString(),
    });

    logger.info(`Service: Academic profile updated for user ${authUserId}`);
  },

  /**
   * Retrieves a Public Profile by slug, stripping sensitive identifiers according to privacy rules.
   */
  getPublicProfileBySlug: async (slug: string): Promise<PublicProfile | null> => {
    const supabase = await createClient();
    const repo = new ProfileRepository(supabase);

    const profile = await repo.findBySlug(slug);
    if (!profile) return null;

    const privacyRecord = await repo.getPrivacySettings(String(profile.id));
    const privacy = privacyRecord as unknown as ProfilePrivacySettings | null;

    if (privacy && privacy.profile_visibility === "private") {
      throw new ProfileAccessDeniedError();
    }

    const eduRecord = await repo.getPrimaryEducationRecord(String(profile.id));
    const album = await repo.findProfileGalleryAlbum(String(profile.id));
    const rawGallery = album ? await repo.getGalleryItems(String(album.id)) : [];
    const allCertificates = await repo.getCertificates(String(profile.id));
    const allAchievements = await repo.getAchievements(String(profile.id));

    const gallery_items: ProfileGalleryItem[] = privacy?.gallery_visibility === "private"
      ? []
      : rawGallery.map((item: DbRow) => ({
          id: String(item.id || ""),
          gallery_album_id: String(item.gallery_album_id || ""),
          media_file_id: String(item.media_file_id || ""),
          media_url: String(item.media_url || ""),
          caption: item.caption ? String(item.caption) : undefined,
          display_order: Number(item.display_order || 0),
          is_cover: Boolean(item.is_cover),
          is_featured: Boolean(item.is_featured),
          uploaded_by: item.uploaded_by ? String(item.uploaded_by) : undefined,
        }));

    const winner_certificates: ProfileCertificate[] = allCertificates
      .filter((cert: DbRow) => cert.certificate_type === "winner" || cert.certificate_type === "runner_up")
      .map((cert: DbRow) => ({
        id: String(cert.id || ""),
        public_id: String(cert.public_id || cert.id || ""),
        certificate_number: String(cert.certificate_number || ""),
        profile_id: String(cert.profile_id || ""),
        entity_type: String(cert.entity_type || ""),
        entity_id: String(cert.entity_id || ""),
        certificate_type: cert.certificate_type as CertificateType,
        title: String(cert.title || ""),
        description: cert.description ? String(cert.description) : undefined,
        issued_on: String(cert.issued_on || ""),
        issued_by: cert.issued_by ? String(cert.issued_by) : undefined,
        qr_token: String(cert.qr_token || cert.id || ""),
        verification_url: cert.verification_url ? String(cert.verification_url) : undefined,
        pdf_media_url: cert.pdf_media_url ? String(cert.pdf_media_url) : undefined,
        preview_media_url: cert.preview_media_url ? String(cert.preview_media_url) : undefined,
        is_revoked: Boolean(cert.is_revoked),
      }));

    const achievements: AchievementSummary[] = privacy?.achievements_visibility === "private"
      ? []
      : allAchievements.map((ach: DbRow) => ({
          id: String(ach.id || ""),
          public_id: String(ach.public_id || ach.id || ""),
          title: String(ach.title || ""),
          slug: String(ach.slug || ach.id || ""),
          category_name: ach.category_name ? String(ach.category_name) : undefined,
          achievement_date: ach.achievement_date ? String(ach.achievement_date) : undefined,
          issuing_organization: ach.issuing_organization ? String(ach.issuing_organization) : undefined,
          position: ach.position ? String(ach.position) : undefined,
          featured_media_url: ach.featured_media_url ? String(ach.featured_media_url) : undefined,
          certificate_media_url: ach.certificate_media_url ? String(ach.certificate_media_url) : undefined,
        }));

    const depts = eduRecord?.departments as { name?: string } | null;
    const batches = eduRecord?.batches as { year?: string } | null;

    return {
      id: String(profile.id || ""),
      public_id: String(profile.public_id || profile.id || ""),
      username: String(profile.username || ""),
      slug: String(profile.slug || ""),
      full_name: String(profile.full_name || ""),
      avatar_url: profile.avatar_url ? String(profile.avatar_url) : undefined,
      cover_url: profile.cover_url ? String(profile.cover_url) : undefined,
      profile_type: (profile.profile_type as ProfileType) || "student",
      bio: profile.bio ? String(profile.bio) : undefined,
      department_name: depts?.name || undefined,
      batch_year: batches?.year || undefined,
      is_verified: Boolean(eduRecord?.is_verified),
      achievements,
      winner_certificates,
      gallery_items,
      created_at: profile.created_at ? String(profile.created_at) : undefined,
      updated_at: profile.updated_at ? String(profile.updated_at) : undefined,
    };
  },

  /**
   * Retrieves a full Private Profile for the authenticated owner or administrator.
   */
  getPrivateProfileByUserId: async (authUserId: string): Promise<PrivateProfile | null> => {
    const supabase = await createClient();
    const repo = new ProfileRepository(supabase);

    const profile = await repo.findByAuthUserId(authUserId);
    if (!profile) return null;

    const publicProfile = await profileCoreService.getPublicProfileBySlug(String(profile.slug));
    if (!publicProfile) return null;

    const privacyRecord = await repo.getPrivacySettings(String(profile.id));
    const privacy = (privacyRecord || {
      profile_id: String(profile.id),
      profile_visibility: "public",
      email_visibility: "private",
      phone_visibility: "private",
      dob_visibility: "private",
      gallery_visibility: "public",
      achievements_visibility: "public",
    }) as unknown as ProfilePrivacySettings;

    const eduRecord = await repo.getPrimaryEducationRecord(String(profile.id));
    const allCertificates = await repo.getCertificates(String(profile.id));
    const rawProofs = await repo.getContributionProofs(String(profile.id));

    const participation_certificates: ProfileCertificate[] = allCertificates
      .filter((cert: DbRow) => cert.certificate_type === "participation" || cert.certificate_type === "volunteer" || cert.certificate_type === "appreciation")
      .map((cert: DbRow) => ({
        id: String(cert.id || ""),
        public_id: String(cert.public_id || cert.id || ""),
        certificate_number: String(cert.certificate_number || ""),
        profile_id: String(cert.profile_id || ""),
        entity_type: String(cert.entity_type || ""),
        entity_id: String(cert.entity_id || ""),
        certificate_type: cert.certificate_type as CertificateType,
        title: String(cert.title || ""),
        description: cert.description ? String(cert.description) : undefined,
        issued_on: String(cert.issued_on || ""),
        issued_by: cert.issued_by ? String(cert.issued_by) : undefined,
        qr_token: String(cert.qr_token || cert.id || ""),
        verification_url: cert.verification_url ? String(cert.verification_url) : undefined,
        pdf_media_url: cert.pdf_media_url ? String(cert.pdf_media_url) : undefined,
        preview_media_url: cert.preview_media_url ? String(cert.preview_media_url) : undefined,
        is_revoked: Boolean(cert.is_revoked),
      }));

    return {
      ...publicProfile,
      auth_user_id: String(profile.auth_user_id || ""),
      email: profile.email ? String(profile.email) : undefined,
      phone: profile.phone ? String(profile.phone) : undefined,
      gender: profile.gender as "male" | "female" | "other" | "prefer_not_to_say" | undefined,
      date_of_birth: profile.date_of_birth ? String(profile.date_of_birth) : undefined,
      roll_number: eduRecord?.roll_number ? String(eduRecord.roll_number) : undefined,
      registration_number: eduRecord?.registration_number ? String(eduRecord.registration_number) : undefined,
      is_profile_claimed: Boolean(profile.is_profile_claimed),
      profile_status: (profile.profile_status as ProfileStatus) || "active",
      privacy_settings: privacy,
      participation_certificates,
      contribution_proofs: rawProofs.map((proof: DbRow) => ({
        id: String(proof.id || ""),
        profile_id: String(proof.profile_id || ""),
        media_file_id: String(proof.media_file_id || ""),
        media_url: proof.media_url ? String(proof.media_url) : undefined,
        title: String(proof.title || ""),
        description: proof.description ? String(proof.description) : undefined,
        amount_reference: proof.amount_reference ? Number(proof.amount_reference) : undefined,
        verification_status: (proof.verification_status as VerificationStatus) || "pending",
        remarks: proof.remarks ? String(proof.remarks) : undefined,
        reviewed_at: proof.reviewed_at ? String(proof.reviewed_at) : undefined,
        created_at: proof.created_at ? String(proof.created_at) : undefined,
        updated_at: proof.updated_at ? String(proof.updated_at) : undefined,
      })),
    };
  },
};
