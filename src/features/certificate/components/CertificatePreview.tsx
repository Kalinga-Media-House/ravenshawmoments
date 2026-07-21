"use client";

import React from "react";
import Image from "next/image";
import { FileText, ExternalLink } from "lucide-react";

export interface CertificatePreviewProps {
  title: string;
  previewUrl?: string;
  downloadUrl?: string;
}

export const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  title,
  previewUrl,
  downloadUrl,
}) => {
  if (!previewUrl) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-rm-gold)] flex items-center gap-2">
          <FileText className="w-4 h-4" aria-hidden="true" />
          <span>Certificate Preview</span>
        </h3>
        {downloadUrl && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-white/80 hover:text-[var(--color-rm-gold)] inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Open Full Certificate</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        )}
      </div>

      <div className="relative w-full aspect-[1.414/1] rounded-2xl overflow-hidden border border-white/15 bg-black/60 shadow-2xl group">
        <Image
          src={previewUrl}
          alt={`Certificate preview for ${title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 800px"
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.01]"
        />
      </div>
    </div>
  );
};
