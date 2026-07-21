"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Trophy,
  Calendar,
  Award,
  UserCheck,
  ShieldCheck,
  ExternalLink,
  Building2,
} from "lucide-react";
import { PublicCertificateDetails } from "../types/certificate";

export interface CertificateRelationshipsProps {
  certificate: PublicCertificateDetails;
}

export const CertificateRelationships: React.FC<CertificateRelationshipsProps> = ({
  certificate,
}) => {
  const hasCompetition = Boolean(certificate.competitionSlug || certificate.competitionName);
  const hasEvent = Boolean(certificate.eventSlug || certificate.eventName);
  const hasAchievement = Boolean(certificate.achievementSlug || certificate.achievementTitle);
  const hasProfile = Boolean(certificate.recipientProfile?.profileSlug || certificate.recipientName);
  const hasIssuer = Boolean(certificate.issuerInformation?.issuingOrganization || certificate.issuingOrganization);

  if (!hasCompetition && !hasEvent && !hasAchievement && !hasProfile && !hasIssuer) {
    return null;
  }

  return (
    <div className="space-y-6 pt-6 border-t border-white/10">
      <h3 className="text-xs font-black uppercase tracking-widest text-white/60">
        Verified Relationships & Issuer Information
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Section 18: Recipient Profile */}
        {hasProfile && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Certificate Recipient</span>
              </span>
              {certificate.recipientProfile?.profileType && (
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white/80">
                  {certificate.recipientProfile.profileType}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {certificate.recipientProfile?.profileImage ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[var(--color-rm-gold)]/40 shrink-0">
                  <Image
                    src={certificate.recipientProfile.profileImage}
                    alt={certificate.recipientProfile.name || "Recipient"}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-white font-extrabold text-base shrink-0">
                  {(certificate.recipientProfile?.name || certificate.recipientName || "R").charAt(0)}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-white truncate">
                  {certificate.recipientProfile?.name || certificate.recipientName}
                </p>
                {certificate.recipientProfile?.department && (
                  <p className="text-xs text-white/70 truncate">
                    {certificate.recipientProfile.department}
                    {certificate.recipientProfile.batch ? ` (${certificate.recipientProfile.batch})` : ""}
                  </p>
                )}
              </div>
            </div>

            {certificate.recipientProfile?.profileSlug && (
              <div className="pt-2">
                <Link
                  href={`/profile/${certificate.recipientProfile.profileSlug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-rm-gold)] hover:text-white transition-colors"
                >
                  <span>View Verified Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Section 19: Issuer Information */}
        {hasIssuer && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)]">
              <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Issued By</span>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm font-extrabold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-white/60 shrink-0" aria-hidden="true" />
                <span>
                  {certificate.issuerInformation?.issuingOrganization ||
                    certificate.issuingOrganization ||
                    "Ravenshaw Moments"}
                </span>
              </p>

              {certificate.issuerInformation?.department && (
                <p className="text-xs text-white/70">
                  Department: {certificate.issuerInformation.department}
                </p>
              )}

              {certificate.issuerInformation?.authorizedRole && (
                <p className="text-xs text-white/60">
                  Authorized Role: {certificate.issuerInformation.authorizedRole}
                </p>
              )}

              {certificate.issuerInformation?.issueDate && (
                <p className="text-xs text-white/60">
                  Issued On:{" "}
                  {new Date(certificate.issuerInformation.issueDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Section 15: Related Competition */}
        {hasCompetition && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)]">
              <Trophy className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Related Competition</span>
            </div>
            <p className="text-sm font-bold text-white">
              {certificate.competitionName || "Competition"}
            </p>
            {certificate.competitionSlug && (
              <Link
                href={`/competitions/${certificate.competitionSlug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-[var(--color-rm-gold)] transition-colors"
              >
                <span>View Competition</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        )}

        {/* Section 16: Related Event */}
        {hasEvent && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)]">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Related Event</span>
            </div>
            <p className="text-sm font-bold text-white">
              {certificate.eventName || "Campus Event"}
            </p>
            {certificate.eventSlug && (
              <Link
                href={`/events/${certificate.eventSlug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-[var(--color-rm-gold)] transition-colors"
              >
                <span>View Event</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        )}

        {/* Section 17: Related Achievement */}
        {hasAchievement && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)]">
              <Award className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Related Achievement</span>
            </div>
            <p className="text-sm font-bold text-white">
              {certificate.achievementTitle || "University Achievement"}
            </p>
            {certificate.achievementSlug && (
              <Link
                href={`/achievements/${certificate.achievementSlug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-[var(--color-rm-gold)] transition-colors"
              >
                <span>View Achievement</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
