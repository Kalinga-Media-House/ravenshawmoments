"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { MemoryItem } from "../types/memory";

export interface MemoryGalleryProps {
  memory: MemoryItem;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({ memory }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const images = memory.galleryImages || [];

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    triggerRef.current?.focus();
  }, []);

  // Handle escape key and left/right arrows inside lightbox
  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev - 1 + images.length) % images.length : null
        );
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) =>
          prev !== null ? (prev + 1) % images.length : null
        );
      }
    };

    // Lock background scroll
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex, images.length, closeLightbox]);

  if (images.length === 0) {
    return null;
  }

  const currentImage = selectedIndex !== null ? images[selectedIndex] : null;

  return (
    <section aria-labelledby="memory-gallery-heading" className="w-full my-12 md:my-16">
      <div className="max-w-[1200px] mx-auto">
        <h2
          id="memory-gallery-heading"
          className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-maroon)] mb-6 text-center"
        >
          More From This Memory
        </h2>

        {/* Responsive Grid: 1 col mobile, 2 tablet, 3 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((imgSrc, idx) => (
            <button
              key={idx}
              ref={idx === 0 ? triggerRef : undefined}
              onClick={() => setSelectedIndex(idx)}
              className="group relative aspect-[16/10] rounded-2xl overflow-hidden rm-glass-card border border-[var(--color-rm-glass-border)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] transition-all duration-300 hover:border-[var(--color-rm-gold)]/40 hover:-translate-y-1"
              aria-label={`View full image ${idx + 1} of ${images.length}`}
            >
              <Image
                src={imgSrc}
                alt={`${memory.title} photograph ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-[var(--color-rm-maroon)]/80 border border-[var(--color-rm-gold)] flex items-center justify-center text-white">
                  <ZoomIn className="w-5 h-5" aria-hidden="true" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      {currentImage && selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-5xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar Controls */}
            <div className="w-full flex items-center justify-between mb-3 px-2">
              <span className="text-xs sm:text-sm font-bold text-black/80">
                Image {selectedIndex + 1} of {images.length}
              </span>
              <button
                ref={closeButtonRef}
                onClick={closeLightbox}
                className="w-11 h-11 rounded-full bg-black/10 hover:bg-white/20 flex items-center justify-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] transition-colors"
                aria-label="Close lightbox"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {/* Main Lightbox Image */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] max-h-[75vh] rounded-2xl overflow-hidden border border-black/20 bg-black/60">
              <Image
                src={currentImage}
                alt={`${memory.title} full photograph ${selectedIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            {/* Previous & Next Navigation */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedIndex((prev) =>
                      prev !== null
                        ? (prev - 1 + images.length) % images.length
                        : null
                    )
                  }
                  className="absolute left-2 sm:-left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 border border-black/20 flex items-center justify-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" aria-hidden="true" />
                </button>
                <button
                  onClick={() =>
                    setSelectedIndex((prev) =>
                      prev !== null ? (prev + 1) % images.length : null
                    )
                  }
                  className="absolute right-2 sm:-right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/80 border border-black/20 flex items-center justify-center text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
