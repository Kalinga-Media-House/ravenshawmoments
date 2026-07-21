"use client";

import React, { useState, useEffect } from "react";
import { Share2, Link as LinkIcon, Check, Facebook, Twitter, MessageCircle } from "lucide-react";
import { ContentType } from "../types/content";

interface NewsShareProps {
  title: string;
  slug: string;
  contentType: ContentType;
}

export const NewsShare = ({ title, slug, contentType }: NewsShareProps) => {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(`${window.location.origin}/news/${slug}`);
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

  const getShareText = () => {
    const isStoryOrArticle = ["Story", "Article", "Interview", "Achievement", "News"].includes(contentType);
    return isStoryOrArticle ? "Share This Story" : "Share This Publication";
  };

  if (!currentUrl) return null;

  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(title);

  return (
    <div className="rm-glass-card rounded-[2rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] w-full">
      <h3 className="text-xl font-bold rm-heading-primary flex items-center gap-2 mb-6">
        <Share2 className="w-5 h-5 text-[var(--color-rm-gold)]" />
        {getShareText()}
      </h3>
      
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleCopy}
          className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:border-[var(--color-rm-gold)]/30 hover:bg-white/10 text-white font-medium rounded-xl transition-all"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-4 h-4" />
              <span>Copy Link</span>
            </>
          )}
        </button>

        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 text-white font-medium rounded-xl transition-all group"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:scale-110 transition-transform" />
          <span>WhatsApp</span>
        </a>

        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#1877F2]/10 border border-[#1877F2]/20 hover:bg-[#1877F2]/20 text-white font-medium rounded-xl transition-all group"
          aria-label="Share on Facebook"
        >
          <Facebook className="w-4 h-4 text-[#1877F2] group-hover:scale-110 transition-transform" />
          <span>Facebook</span>
        </a>

        <a
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-[120px] inline-flex items-center justify-center gap-2 px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium rounded-xl transition-all group"
          aria-label="Share on X"
        >
          <Twitter className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          <span>X</span>
        </a>
      </div>
    </div>
  );
};
