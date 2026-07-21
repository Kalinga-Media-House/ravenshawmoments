"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, X, ChevronLeft, ChevronRight } from "lucide-react";
import { CompetitionItem } from "../types/competition";

export interface CompetitionGalleryProps {
  competition: CompetitionItem;
}

export const CompetitionGallery: React.FC<CompetitionGalleryProps> = ({
  competition,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!competition.galleryImages || competition.galleryImages.length === 0) {
    return null;
  }

  const images = competition.galleryImages;

  const openLightbox = (idx: number) => setSelectedIndex(idx);
  const closeLightbox = () => setSelectedIndex(null);
  const showPrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
    }
  };
  const showNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % images.length);
    }
  };

  return (
    <section aria-labelledby="competition-gallery-heading">
      <div className="rm-glass-card rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/15 bg-black/40 space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/50 flex items-center justify-center text-[var(--color-rm-gold)]">
            <ImageIcon className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2
            id="competition-gallery-heading"
            className="text-xl sm:text-2xl font-black text-white tracking-tight"
          >
            Competition Gallery
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => openLightbox(idx)}
              aria-label={`View enlarged gallery image: ${img.alt}`}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] transition-all duration-300"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                <span className="text-xs font-bold text-white truncate">
                  {img.caption || img.alt}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedIndex !== null && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged competition gallery image"
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          >
            <button
              type="button"
              onClick={closeLightbox}
              aria-label="Close image lightbox"
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous image"
              className="absolute left-4 sm:left-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="relative max-w-4xl max-h-[80vh] w-full aspect-[16/10] rounded-2xl overflow-hidden border border-white/20">
              <Image
                src={images[selectedIndex].url}
                alt={images[selectedIndex].alt}
                fill
                className="object-contain"
              />
            </div>

            <button
              type="button"
              onClick={showNext}
              aria-label="Next image"
              className="absolute right-4 sm:right-8 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
