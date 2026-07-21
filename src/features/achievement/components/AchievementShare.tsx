"use client";

import React, { useState, useEffect } from "react";
import { Share2, Link as LinkIcon, Check, Facebook, Twitter, MessageCircle } from "lucide-react";

export interface AchievementShareProps {
  title: string;
  slug: string;
}

export const AchievementShare = ({ title, slug }: AchievementShareProps) => {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    // Using microtask to prevent synchronous state update inside effect body warning
    const timer = setTimeout(() => {
      setCurrentUrl(`${window.location.origin}/achievements/${slug}`);
    }, 0);
    return () => clearTimeout(timer);
  }, [slug]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  if (!currentUrl) {
    return null;
  }

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <section className="rm-glass-card rounded-[2rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] w-full">
      <div className="flex items-center gap-2.5 pb-4 mb-3 border-b border-[var(--color-rm-glass-border)]">
        <Share2 className="w-5 h-5 text-[var(--color-maroon)]" aria-hidden="true" />
        <h2 className="text-xl font-bold rm-heading-primary">Celebrate and Share</h2>
      </div>

      <p className="text-sm rm-text-body font-medium mb-6">
        Share this achievement and celebrate the people and communities that continue to inspire Ravenshaw.
      </p>

      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleCopy}
          className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-3 bg-black/5 border border-black/10 hover:border-[var(--color-maroon)]/30 hover:bg-black/10 text-foreground font-medium rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)]"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-600" aria-hidden="true" />
              <span className="text-green-600">Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4 text-foreground" aria-hidden="true" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 text-[#25D366] font-medium rounded-xl transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366]"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" aria-hidden="true" />
          <span className="text-[#075E54]">WhatsApp</span>
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2]/10 border border-[#1877F2]/20 hover:bg-[#1877F2]/20 text-[#1877F2] font-medium rounded-xl transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2]"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform" aria-hidden="true" />
          <span className="text-[#1877F2]">Facebook</span>
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 px-4 py-3 bg-black/5 border border-black/10 hover:bg-black/10 text-foreground font-medium rounded-xl transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
          aria-label="Share on X"
        >
          <Twitter className="w-4 h-4 text-foreground group-hover:scale-110 transition-transform" aria-hidden="true" />
          <span>X</span>
        </a>
      </div>
    </section>
  );
};
