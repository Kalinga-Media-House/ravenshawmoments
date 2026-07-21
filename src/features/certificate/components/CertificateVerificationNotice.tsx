"use client";

import React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Info,
  Lock,
  HelpCircle,
  Flag,
} from "lucide-react";

export const CertificateVerificationNotice: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 print:hidden">
      {/* Section 23: About Certificate Verification */}
      <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-white/10 bg-black/40 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-rm-gold)]">
          <Info className="w-4 h-4 shrink-0" aria-hidden="true" />
          <h3>About Certificate Verification</h3>
        </div>
        <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
          Certificate verification confirms whether the entered certificate information matches an approved public certificate record available through Ravenshaw Moments. It does not replace additional verification required by an institution, employer, organizer, or issuing authority.
        </p>
      </div>

      {/* Section 6: Where can I find the Certificate ID? */}
      <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-white/10 bg-black/40 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-rm-gold)]">
          <HelpCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <h3>Where can I find the Certificate ID?</h3>
        </div>
        <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
          The Certificate ID or verification code is printed at the bottom corner of every official certificate issued through Ravenshaw Moments (for example: <code className="px-1.5 py-0.5 rounded bg-white/10 text-[var(--color-rm-gold)] font-mono text-xs">RM-CERT-XXXX</code>).
        </p>
      </div>

      {/* Section 24: Privacy and Public Information */}
      <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-white/10 bg-black/40 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-rm-gold)]">
          <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />
          <h3>Privacy and Public Information</h3>
        </div>
        <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
          Only information approved for public certificate verification is displayed. Private contact details, internal records, and restricted profile information are not shown. For more details, read our{" "}
          <Link
            href="/privacy-policy"
            className="text-[var(--color-rm-gold)] underline hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      {/* Section 25: Report a Certificate Issue */}
      <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-white/10 bg-black/40 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-[var(--color-rm-gold)]">
          <Flag className="w-4 h-4 shrink-0" aria-hidden="true" />
          <h3>Report a Certificate Issue</h3>
        </div>
        <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
          If you notice an error in recipient details, suspect misuse, or have questions regarding certificate revocation or ownership, please reach out to our team.
        </p>
        <div className="pt-1">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white transition-colors"
          >
            <span>Report an Issue</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
