"use client";

import React, { useState } from "react";
import {
  Share2,
  Check,
  Printer,
  Copy,
  MessageSquare,
  Facebook,
} from "lucide-react";
import { PublicCertificateDetails } from "../types/certificate";

export interface CertificateShareProps {
  certificate: PublicCertificateDetails;
}

export const CertificateShare: React.FC<CertificateShareProps> = ({
  certificate,
}) => {
  const [copied, setCopied] = useState(false);

  const getVerificationUrl = () => {
    if (typeof window === "undefined") {
      return `https://ravenshawmoments.com/certificates?id=${encodeURIComponent(
        certificate.certificateId
      )}`;
    }
    const origin = window.location.origin;
    return `${origin}/certificates?id=${encodeURIComponent(
      certificate.certificateId
    )}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getVerificationUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback silent fail
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const shareText = `Official Certificate Verification: ${certificate.title} (ID: ${certificate.certificateId}) on Ravenshaw Moments`;
  const url = getVerificationUrl();

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${shareText} - ${url}`
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    url
  )}`;
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(url)}`;

  return (
    <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
      <div className="w-full sm:w-auto flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-white/60 mr-1 flex items-center gap-1.5">
          <Share2 className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Share Verification:</span>
        </span>

        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy Verification Link"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
              <span className="text-emerald-300">Link Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-emerald-600/30 border border-white/20 hover:border-emerald-500/40 text-xs font-bold text-white transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>

        <a
          href={facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-blue-600/30 border border-white/20 hover:border-blue-500/40 text-xs font-bold text-white transition-colors"
        >
          <Facebook className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
          <span>Facebook</span>
        </a>

        <a
          href={xUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors"
        >
          <span className="font-black text-xs leading-none">𝕏</span>
          <span>Post</span>
        </a>
      </div>

      {/* Section 22: Print Verification */}
      <div className="w-full sm:w-auto">
        <button
          type="button"
          onClick={handlePrint}
          aria-label="Print Verification"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/25 text-xs font-extrabold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
        >
          <Printer className="w-4 h-4 text-[var(--color-rm-gold)]" aria-hidden="true" />
          <span>Print Verification Record</span>
        </button>
      </div>
    </div>
  );
};
