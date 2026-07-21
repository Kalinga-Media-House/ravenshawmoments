// =============================================================================
// Ravenshaw Moments
// File      : src/features/profile/services/profile-certificate.service.ts
// Purpose   : Certificates & Chronological Achievement Timeline Service
// =============================================================================

import { createClient } from "@/lib/supabase/server";
import { ProfileRepository, DbRow } from "@/lib/repositories/profile.repository";
import { ProfileCertificate, AchievementSummary, CertificateType } from "@/types/profile";

export const profileCertificateService = {
  /**
   * Generates a chronologically sorted timeline of achievements and winner certificates.
   */
  getProfileTimeline: async (profileId: string): Promise<Array<AchievementSummary | ProfileCertificate>> => {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new ProfileRepository(supabase);

    const achievements = await repo.getAchievements(profileId);
    const certificates = await repo.getCertificates(profileId);
    const winnerCerts = certificates.filter((c: DbRow) => c.certificate_type === "winner" || c.certificate_type === "runner_up");

    const formattedAchievements: AchievementSummary[] = achievements.map((ach: DbRow) => ({
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

    const formattedCerts: ProfileCertificate[] = winnerCerts.map((cert: DbRow) => ({
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

    const merged: Array<AchievementSummary | ProfileCertificate> = [...formattedAchievements, ...formattedCerts];
    return merged.sort((a, b) => {
      const recA = a as unknown as Record<string, unknown>;
      const recB = b as unknown as Record<string, unknown>;
      const dateAStr = String(recA.achievement_date || recA.issued_on || 0);
      const dateBStr = String(recB.achievement_date || recB.issued_on || 0);
      const dateA = new Date(dateAStr).getTime();
      const dateB = new Date(dateBStr).getTime();
      return dateB - dateA;
    });
  },

  /**
   * Retrieves profile certificates filtered by type and requester authorization.
   */
  getProfileCertificates: async (profileId: string, includePrivate = false): Promise<ProfileCertificate[]> => {
    const supabase = await createClient();
    // @ts-ignore
    const repo = new ProfileRepository(supabase);

    const allCertificates = await repo.getCertificates(profileId);
    return allCertificates
      .filter((c: DbRow) => includePrivate || c.certificate_type === "winner" || c.certificate_type === "runner_up")
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
  },
};
