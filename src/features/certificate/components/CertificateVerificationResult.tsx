"use client";

import React from "react";
import {
  AlertTriangle,
  RefreshCw,
  Award,
  Calendar,
  Building2,
  Download,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import {
  VerificationLookupResult,
  PublicCertificateDetails,
} from "../types/certificate";
import { CertificateStatus } from "./CertificateStatus";
import { CertificatePreview } from "./CertificatePreview";
import { CertificateRelationships } from "./CertificateRelationships";
import { CertificateShare } from "./CertificateShare";

export interface CertificateVerificationResultProps {
  result: VerificationLookupResult | null;
  onTryAgain: () => void;
}

export const CertificateVerificationResult: React.FC<
  CertificateVerificationResultProps
> = ({ result, onTryAgain }) => {
  if (!result) {
    return null;
  }

  // Section 10: Certificate Not Found
  if (result.status === "NotFound") {
    return (
      <div
        role="region"
        aria-label="Certificate Not Found"
        className="rm-glass-card rounded-3xl p-8 sm:p-12 border border-amber-500/40 bg-black/50 text-center max-w-2xl mx-auto space-y-6"
      >
        <div className="w-16 h-16 rounded-3xl bg-amber-950/60 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
          <AlertTriangle className="w-8 h-8" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <CertificateStatus status="NotFound" />
          <h2 className="text-2xl sm:text-3xl font-black text-white pt-2">
            Certificate Not Found
          </h2>
          <p className="text-sm sm:text-base text-white/75 max-w-lg mx-auto leading-relaxed">
            {result.message ||
              "We could not find a publicly verifiable certificate matching the information entered. Check the certificate ID and try again."}
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onTryAgain}
            className="min-h-[46px] inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[var(--color-rm-maroon)] hover:bg-[var(--color-rm-maroon)]/90 border border-[var(--color-rm-gold)]/60 text-xs sm:text-sm font-extrabold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Section 12: Verification Service Error
  if (result.status === "Error") {
    return (
      <div
        role="alert"
        aria-label="Verification Service Unavailable"
        className="rm-glass-card rounded-3xl p-8 sm:p-12 border border-rose-500/40 bg-black/50 text-center max-w-2xl mx-auto space-y-6"
      >
        <div className="w-16 h-16 rounded-3xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center mx-auto text-rose-400 shadow-xl">
          <ShieldAlert className="w-8 h-8" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Verification Is Temporarily Unavailable
          </h2>
          <p className="text-sm sm:text-base text-white/75 max-w-lg mx-auto leading-relaxed">
            {result.message ||
              "We could not complete the verification request. Please try again later."}
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onTryAgain}
            className="min-h-[46px] inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Section 8 & 9: Verified / Valid / Revoked / Expired / Superseded / Pending Certificate Result
  const cert = result.certificate;

  if (!cert) {
    return null;
  }

  const isRevoked = result.status === "Revoked" || cert.isRevoked === true;

  return (
    <article
      role="region"
      aria-label="Certificate Verification Record"
      className={`rm-glass-card rounded-3xl p-6 sm:p-8 md:p-10 border ${
        isRevoked
          ? "border-rose-500/50 bg-rose-950/20"
          : "border-[var(--color-rm-gold)]/50 bg-black/60"
      } space-y-8 shadow-2xl`}
    >
      {/* Header Badge & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <CertificateStatus status={result.status} />
            {cert.certificateType && (
              <span className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-bold text-white">
                {cert.certificateType}
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {cert.title}
          </h2>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-xs font-bold text-white/50 block">
            Certificate ID
          </span>
          <code className="text-sm sm:text-base font-mono font-extrabold text-[var(--color-rm-gold)] break-all">
            {cert.certificateId}
          </code>
        </div>
      </div>

      {/* Revocation Note if present */}
      {isRevoked && (
        <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-xs sm:text-sm text-rose-200 space-y-1">
          <p className="font-extrabold uppercase tracking-wide text-rose-300">
            Revocation Notice
          </p>
          <p className="leading-relaxed">
            {cert.revocationNote ||
              "This certificate record is no longer considered valid."}
          </p>
        </div>
      )}

      {/* Public Approved Fields Grid */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cert.recipientName && (
          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/50">
              Recipient Name
            </dt>
            <dd className="text-base sm:text-lg font-black text-white">
              {cert.recipientName}
            </dd>
          </div>
        )}

        {cert.recognitionType && (
          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/50">
              Recognition Type
            </dt>
            <dd className="text-sm sm:text-base font-bold text-white">
              {cert.recognitionType}
            </dd>
          </div>
        )}

        {cert.position && (
          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/50">
              Position / Rank
            </dt>
            <dd className="text-sm sm:text-base font-bold text-[var(--color-rm-gold)]">
              {cert.position}
            </dd>
          </div>
        )}

        {cert.award && (
          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/50">
              Award Distinction
            </dt>
            <dd className="text-sm sm:text-base font-bold text-white">
              {cert.award}
            </dd>
          </div>
        )}

        {cert.department && (
          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/50">
              Department
            </dt>
            <dd className="text-sm font-bold text-white/90">
              {cert.department}
            </dd>
          </div>
        )}

        {cert.hostel && (
          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/50">
              Hostel
            </dt>
            <dd className="text-sm font-bold text-white/90">
              {cert.hostel}
            </dd>
          </div>
        )}

        {cert.organization && (
          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/50">
              Organization
            </dt>
            <dd className="text-sm font-bold text-white/90">
              {cert.organization}
            </dd>
          </div>
        )}

        {cert.teamName && (
          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/50">
              Team Name
            </dt>
            <dd className="text-sm font-bold text-white">
              {cert.teamName}
            </dd>
          </div>
        )}

        {cert.institution && (
          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/50">
              Institution
            </dt>
            <dd className="text-sm font-bold text-white/90">
              {cert.institution}
            </dd>
          </div>
        )}

        {cert.issueDate && (
          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/50">
              Issue Date
            </dt>
            <dd className="text-sm font-bold text-white/90">
              {new Date(cert.issueDate).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </dd>
          </div>
        )}

        {cert.issuingOrganization && (
          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/50">
              Issuing Authority
            </dt>
            <dd className="text-sm font-bold text-white/90">
              {cert.issuingOrganization}
            </dd>
          </div>
        )}

        {cert.verificationTimestamp && (
          <div className="space-y-1">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/50">
              Verified On
            </dt>
            <dd className="text-xs font-mono text-white/70">
              {new Date(cert.verificationTimestamp).toLocaleString("en-IN")}
            </dd>
          </div>
        )}
      </dl>

      {/* Section 13: Certificate Preview Image */}
      <CertificatePreview
        title={cert.title}
        previewUrl={cert.previewUrl}
        downloadUrl={cert.downloadUrl}
      />

      {/* Section 14: View or Download Certificate */}
      {cert.downloadUrl && (
        <div className="pt-4 flex flex-wrap items-center gap-3">
          <a
            href={cert.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[var(--color-rm-maroon)] hover:bg-[var(--color-rm-maroon)]/90 border border-[var(--color-rm-gold)]/60 text-xs sm:text-sm font-extrabold text-white transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Download Official Certificate</span>
          </a>
        </div>
      )}

      {/* Section 15, 16, 17, 18, 19: Verified Relationships & Issuer */}
      <CertificateRelationships certificate={cert} />

      {/* Section 21 & 22: Share & Print Verification */}
      {!isRevoked && <CertificateShare certificate={cert} />}
    </article>
  );
};
