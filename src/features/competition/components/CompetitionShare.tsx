"use client";

import React, { useState } from "react";
import { Share2, Copy, Check, MessageCircle } from "lucide-react";
import { CompetitionItem } from "../types/competition";
import { getCanonicalUrl } from "@/features/shared/utils/urls";

export interface CompetitionShareProps {
  competition: CompetitionItem;
}

export const CompetitionShare: React.FC<CompetitionShareProps> = ({
  competition,
}) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    return getCanonicalUrl(`/competitions/${competition.slug}`);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback ignore
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `${competition.title} at Ravenshaw Moments: ${getShareUrl()}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleFacebook = () => {
    const url = encodeURIComponent(getShareUrl());
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleX = () => {
    const text = encodeURIComponent(
      `Discover ${competition.title} at Ravenshaw Moments: ${getShareUrl()}`
    );
    window.open(
      `https://twitter.com/intent/tweet?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section aria-labelledby="share-competition-heading">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
        <div className="flex items-center gap-3 border-b border-stone-100 pb-4">
          <div className="w-9 h-9 rounded-xl bg-rm-maroon/10 border border-rm-maroon/20 flex items-center justify-center text-rm-maroon">
            <Share2 className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="share-competition-heading"
              className="text-lg sm:text-xl font-black text-stone-900 tracking-tight"
            >
              Share This Competition
            </h2>
            <p className="text-xs text-stone-500">
              Invite eligible friends and communities to discover this opportunity.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Copy competition page link to clipboard"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-200 text-xs font-bold text-stone-700 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rm-gold"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                <span className="text-emerald-700">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-500" aria-hidden="true" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* WhatsApp */}
          <button
            type="button"
            onClick={handleWhatsApp}
            aria-label="Share competition on WhatsApp"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold text-emerald-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>WhatsApp</span>
          </button>

          {/* Facebook */}
          <button
            type="button"
            onClick={handleFacebook}
            aria-label="Share competition on Facebook"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-xs font-bold text-blue-800 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          >
            <span>Facebook</span>
          </button>

          {/* X */}
          <button
            type="button"
            onClick={handleX}
            aria-label="Share competition on X"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 border border-stone-700 text-xs font-bold text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400"
          >
            <span>X (Twitter)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
