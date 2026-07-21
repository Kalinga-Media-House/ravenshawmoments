"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ProfileGalleryItem } from "@/types/profile";

interface AlumniGalleryProps {
  galleryItems?: ProfileGalleryItem[];
}

export const AlumniGallery: React.FC<AlumniGalleryProps> = ({
  galleryItems,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const items = Array.isArray(galleryItems) ? galleryItems : [];

  if (items.length === 0) {
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (selectedIndex === null) return;
    if (e.key === "Escape") setSelectedIndex(null);
    if (e.key === "ArrowLeft") {
      setSelectedIndex((prev) =>
        prev !== null ? (prev > 0 ? prev - 1 : items.length - 1) : null
      );
    }
    if (e.key === "ArrowRight") {
      setSelectedIndex((prev) =>
        prev !== null ? (prev < items.length - 1 ? prev + 1 : 0) : null
      );
    }
  };

  return (
    <section aria-labelledby="alumni-gallery-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)]">
            <Camera className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="alumni-gallery-heading"
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              My Ravenshaw Gallery
            </h2>
            <p className="text-xs text-white/70">
              Approved public campus photographs and historical moments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className="group relative h-44 sm:h-52 rounded-2xl overflow-hidden bg-black/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)]"
            >
              <Image
                src={item.media_url}
                alt={item.caption || `Alumni gallery photograph ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {item.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 text-left">
                  <p className="text-xs text-white/90 line-clamp-1 font-medium">
                    {item.caption}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Accessible Lightbox Dialog */}
      {selectedIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image Preview Lightbox"
          onKeyDown={handleKeyDown}
          tabIndex={0}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <button
            type="button"
            onClick={() => setSelectedIndex(null)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={() =>
              setSelectedIndex((prev) =>
                prev !== null ? (prev > 0 ? prev - 1 : items.length - 1) : null
              )
            }
            className="absolute left-4 sm:left-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" aria-hidden="true" />
          </button>

          <div className="relative max-w-4xl max-h-[80vh] w-full h-full flex flex-col items-center justify-center">
            <div className="relative w-full h-[70vh]">
              <Image
                src={items[selectedIndex].media_url}
                alt={items[selectedIndex].caption || "Gallery image preview"}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>
            {items[selectedIndex].caption && (
              <p className="mt-3 text-sm text-white/90 text-center max-w-xl">
                {items[selectedIndex].caption}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() =>
              setSelectedIndex((prev) =>
                prev !== null
                  ? prev < items.length - 1
                    ? prev + 1
                    : 0
                  : null
              )
            }
            className="absolute right-4 sm:right-8 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
};
