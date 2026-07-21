"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, CalendarDays, MapPin } from "lucide-react";
import { GalleryItem } from "../types/gallery";

interface GalleryLightboxProps {
  item: GalleryItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export const GalleryLightbox = ({
  item,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}: GalleryLightboxProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Focus trap & keyboard navigation
  useEffect(() => {
    if (!item) return;

    // Lock body scroll
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasNext) onNext();
      if (e.key === "ArrowLeft" && hasPrev) onPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose, onNext, onPrev, hasNext, hasPrev]);

  // Click outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-rm-bg-deep)]/95 backdrop-blur-sm p-4 sm:p-6 md:p-12"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-title"
          ref={overlayRef}
          onClick={handleOverlayClick}
        >
          {/* Main Content Area */}
          <div 
            className="relative flex flex-col lg:flex-row w-full max-w-[1280px] xl:max-w-[1360px] mx-auto rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] border border-[var(--color-rm-glass-border)] rm-glass-card max-h-[95vh] md:max-h-[90vh] overflow-y-auto lg:overflow-y-hidden" 
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Close Button - Attached to Card on Desktop, Screen on Mobile */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 lg:top-5 lg:right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 lg:bg-white/5 lg:hover:bg-white/10 text-[var(--color-rm-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] z-50 backdrop-blur-sm"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5 lg:w-6 lg:h-6" />
            </button>

            {/* Left Side: Large gallery image */}
            <div className="relative w-full lg:w-[62%] xl:w-[66%] aspect-[4/3] md:aspect-[16/9] lg:aspect-[16/10] shrink-0 bg-black">
              <Image
                src={item.imageUrl}
                alt={item.imageAlt || item.title}
                fill
                quality={90}
                className="object-cover"
                sizes="(max-width: 767px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), 65vw"
                priority
              />

              {/* Navigation Controls (Mobile + Desktop inside image) */}
              <div className="absolute inset-0 flex items-center justify-between px-3 md:px-5 pointer-events-none">
                {hasPrev ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); onPrev(); }}
                    className="pointer-events-auto p-2.5 md:p-3.5 rounded-full bg-black/40 hover:bg-black/70 text-[var(--color-rm-text-primary)] backdrop-blur-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] border border-white/10 shadow-sm"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-7 md:h-7" />
                  </button>
                ) : <div />}
                {hasNext ? (
                  <button
                    onClick={(e) => { e.stopPropagation(); onNext(); }}
                    className="pointer-events-auto p-2.5 md:p-3.5 rounded-full bg-black/40 hover:bg-black/70 text-[var(--color-rm-text-primary)] backdrop-blur-md transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] border border-white/10 shadow-sm"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5 md:w-7 md:h-7" />
                  </button>
                ) : <div />}
              </div>
            </div>

            {/* Right Side: Gallery information panel */}
            <div className="flex flex-col justify-center flex-grow p-5 sm:p-7 md:p-8 lg:p-10 xl:p-12 bg-transparent border-t lg:border-t-0 lg:border-l border-[var(--color-rm-glass-border)]">
              
              <div className="flex flex-col gap-4 lg:gap-5 h-full max-h-full overflow-y-auto">
                
                <div className="flex items-center gap-3">
                  <span className="text-[0.65rem] sm:text-xs font-bold tracking-widest text-[#12070B] uppercase px-3 py-1 bg-[var(--color-rm-gold)] rounded-full shadow-sm">
                    {item.category}
                  </span>
                  {item.communityName && (
                    <span className="text-[0.7rem] sm:text-xs font-bold tracking-widest text-[var(--color-rm-gold)] uppercase">
                      {item.communityName}
                    </span>
                  )}
                </div>
                
                <h2 id="lightbox-title" className="text-[clamp(1.5rem,3vw,2.2rem)] lg:text-[clamp(1.75rem,2.5vw,2.75rem)] font-bold rm-heading-primary leading-[1.15] mb-1">
                  {item.title}
                </h2>
                
                {item.description && (
                  <p className="text-[0.95rem] md:text-base rm-text-body leading-relaxed font-medium">
                    {item.description}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-4 sm:gap-6 mt-4 lg:mt-auto pt-5 lg:pt-8 border-t border-[var(--color-rm-glass-border)] text-[0.85rem] md:text-sm font-medium text-[var(--color-rm-text-primary)]/70">
                  {item.capturedAt && (
                    <div className="flex items-center gap-2.5">
                      <CalendarDays className="w-4 h-4 text-[var(--color-rm-gold)] shrink-0" aria-hidden="true" />
                      <span>{item.capturedAt}</span>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-[var(--color-rm-gold)] shrink-0" aria-hidden="true" />
                      <span className="truncate max-w-[200px] xl:max-w-[250px]">{item.location}</span>
                    </div>
                  )}
                </div>
                
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
