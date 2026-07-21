"use client";

import React, { useState } from "react";
import { Copy, Check, Share2 } from "lucide-react";

export interface MemoryShareProps {
  title: string;
}

export const MemoryShare: React.FC<MemoryShareProps> = ({ title }) => {
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  const handleCopy = async () => {
    const url = getShareUrl();
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback if needed
    }
  };

  const shareWhatsApp = () => {
    const url = getShareUrl();
    if (!url) return;
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title}: ${url}`)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareFacebook = () => {
    const url = getShareUrl();
    if (!url) return;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const shareX = () => {
    const url = getShareUrl();
    if (!url) return;
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(
        title
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <section aria-labelledby="memory-share-heading" className="w-full max-w-[760px] mx-auto my-12">
      <div className="rm-glass-card rounded-[1.75rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] bg-black/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-rm-maroon)]/40 border border-[var(--color-rm-gold)]/40 flex items-center justify-center text-[var(--color-maroon)]">
            <Share2 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="memory-share-heading" className="text-base sm:text-lg font-extrabold text-white">
              Share This Memory
            </h2>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground mb-6 leading-relaxed">
          Some memories become more meaningful when they are shared with the people who lived them.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleCopy}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-rm-gold)]/20 hover:bg-[var(--color-rm-gold)]/30 border border-[var(--color-rm-gold)]/40 text-xs sm:text-sm font-bold text-[var(--color-maroon)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                <span>Link Copied</span>
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
            onClick={shareWhatsApp}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 border border-black/10 text-xs sm:text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)]"
          >
            WhatsApp
          </button>

          <button
            type="button"
            onClick={shareFacebook}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 border border-black/10 text-xs sm:text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)]"
          >
            Facebook
          </button>

          <button
            type="button"
            onClick={shareX}
            className="min-h-[44px] inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/5 hover:bg-black/10 border border-black/10 text-xs sm:text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)]"
          >
            X
          </button>
        </div>

        {/* Live region feedback */}
        <div aria-live="polite" className="sr-only">
          {copied ? "Link copied to clipboard successfully" : ""}
        </div>
      </div>
    </section>
  );
};
