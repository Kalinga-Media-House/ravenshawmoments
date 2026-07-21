"use client";

import React, { useState } from "react";
import { Share2, Copy, Check, MessageCircle, Send } from "lucide-react";

interface AlumniProfileShareProps {
  fullName: string;
  slug: string;
}

export const AlumniProfileShare: React.FC<AlumniProfileShareProps> = ({
  fullName,
  slug,
}) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return `/profile/${slug}`;
  };

  const handleCopy = async () => {
    try {
      const url = getShareUrl();
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback silent handle
    }
  };

  const shareText = `Explore the Ravenshaw journey and alumni profile of ${fullName} on Ravenshaw Moments.`;

  const handleWhatsApp = () => {
    const url = getShareUrl();
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        shareText + " " + url
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleFacebook = () => {
    const url = getShareUrl();
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleTwitter = () => {
    const url = getShareUrl();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section aria-labelledby="alumni-share-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto rm-glass-card rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2
            id="alumni-share-heading"
            className="text-base sm:text-lg font-black text-white flex items-center gap-2"
          >
            <Share2 className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />
            <span>Share This Alumni Profile</span>
          </h2>
          <p className="text-xs text-white/70">
            Celebrate Ravenshaw’s legacy by sharing this profile across your network.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/40 text-[var(--color-rm-gold)] text-xs font-black uppercase tracking-wider hover:bg-[var(--color-rm-maroon)]/80 transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span className="text-emerald-400">Link Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" aria-hidden="true" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleWhatsApp}
            aria-label="Share on WhatsApp"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider hover:bg-emerald-600/30 transition-all"
          >
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            <span>WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handleFacebook}
            aria-label="Share on Facebook"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600/20 border border-blue-500/40 text-blue-300 text-xs font-bold uppercase tracking-wider hover:bg-blue-600/30 transition-all"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>Facebook</span>
          </button>

          <button
            type="button"
            onClick={handleTwitter}
            aria-label="Share on X"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/20 transition-all"
          >
            <span>X (Twitter)</span>
          </button>
        </div>
      </div>
    </section>
  );
};
