"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Image as ImageIcon,
} from "lucide-react";

export interface GalleryPhoto {
  id: string;
  title: string;
  imageUrl: string;
  category?: string;
  date?: string;
}

export interface MinimalGalleryGridProps {
  photos: GalleryPhoto[];
  departmentName?: string;
}

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMTAiIGhlaWdodD0iMTAwIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRkFGOEZFIi8+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnKSIgb3BhY2l0eT0iMC4wNiIvPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iZyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzVBMDAxNiIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0Q0QUYzNyIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjwvc3ZnPg==";

export const MinimalGalleryGrid: React.FC<MinimalGalleryGridProps> = ({
  photos,
  departmentName = "Department",
}) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const nextPhoto = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (lightboxIndex !== null && photos.length > 1) {
        setLightboxIndex((lightboxIndex + 1) % photos.length);
      }
    },
    [lightboxIndex, photos.length]
  );

  const prevPhoto = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      if (lightboxIndex !== null && photos.length > 1) {
        setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
      }
    },
    [lightboxIndex, photos.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
      if (e.key === "Home") setLightboxIndex(0);
      if (e.key === "End") setLightboxIndex(photos.length - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [lightboxIndex, closeLightbox, nextPhoto, prevPhoto, photos.length]);

  const [touchStart, setTouchStart] = useState<number | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if ("touches" in e) {
      setTouchStart(e.targetTouches[0].clientX);
    } else {
      setTouchStart(e.clientX);
    }
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (touchStart === null) return;
      let touchEnd;
      if ("changedTouches" in e) {
        touchEnd = e.changedTouches[0].clientX;
      } else {
        touchEnd = e.clientX;
      }
      const diff = touchStart - touchEnd;
      if (diff > 50) nextPhoto();
      if (diff < -50) prevPhoto();
      setTouchStart(null);
    },
    [touchStart, nextPhoto, prevPhoto]
  );

  if (!photos || photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 my-12 bg-card border border-border/80 rounded-3xl shadow-xs">
        <ImageIcon className="size-14 text-[#D4AF37]/60 mb-5" />
        <h3 className="text-2xl font-bold text-foreground">No Photos Uploaded</h3>
        <p className="text-sm text-muted-foreground mt-1">There are currently no photos in this gallery.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 my-12 sm:my-16">
        {photos.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "100px" }}
            transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.4) }}
            onClick={() => setLightboxIndex(idx)}
            className="group relative rounded-2xl overflow-hidden bg-card border border-border/80 shadow-xs hover:shadow-xl hover:border-[#D4AF37]/60 cursor-pointer transition-all duration-300"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-muted">
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                loading="lazy"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-90">
                <div className="size-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40 shadow-sm">
                  <Maximize2 className="size-4" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {photos.length >= 8 && (
        <div className="mt-8 mb-16 flex justify-center">
          <button className="px-8 py-3 rounded-full bg-card border border-border/80 hover:border-[#D4AF37] hover:bg-muted text-foreground text-sm font-bold shadow-xs transition-all duration-300 flex items-center gap-2 group">
            <span>Load More Photos</span>
            <ChevronRight className="size-4 text-muted-foreground group-hover:text-[#D4AF37] transition-all duration-300 group-hover:translate-x-0.5" />
          </button>
        </div>
      )}

      <AnimatePresence>
        {lightboxIndex !== null && (
          <LightboxViewer
            photos={photos}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onNext={nextPhoto}
            onPrev={prevPhoto}
            touchStart={touchStart}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          />
        )}
      </AnimatePresence>
    </>
  );
};

interface LightboxViewerProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  onClose: () => void;
  onNext: (e?: React.MouseEvent) => void;
  onPrev: (e?: React.MouseEvent) => void;
  touchStart: number | null;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

const LightboxViewer = React.memo(
  ({
    photos,
    currentIndex,
    onClose,
    onNext,
    onPrev,
    onTouchStart,
    onTouchEnd,
  }: LightboxViewerProps) => {
    const currentPhoto = photos[currentIndex];

    const getCardStyles = (index: number) => {
      const offset = index - currentIndex;
      const absOffset = Math.abs(offset);
      const sign = Math.sign(offset);

      if (absOffset === 0) {
        return { x: "0%", scale: 1, opacity: 1, filter: "blur(0px)", zIndex: 10 };
      }
      if (absOffset === 1) {
        return { x: `${sign * 55}%`, scale: 0.25, opacity: 0.6, filter: "blur(2px)", zIndex: 9 };
      }
      if (absOffset === 2) {
        return { x: `${sign * 68}%`, scale: 0.18, opacity: 0.3, filter: "blur(4px)", zIndex: 8 };
      }
      if (absOffset === 3) {
        return { x: `${sign * 78}%`, scale: 0.13, opacity: 0.1, filter: "blur(6px)", zIndex: 7 };
      }
      return { x: `${sign * 90}%`, scale: 0.1, opacity: 0, filter: "blur(10px)", zIndex: 0 };
    };

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center select-none touch-none overflow-hidden size-full"
        onClick={onClose}
        style={{ transform: "translateZ(0)" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-[10000] size-11 sm:size-12 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors border border-white/10 backdrop-blur-md shadow-xl"
          aria-label="Close lightbox"
        >
          <X className="size-6" />
        </button>

        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={onPrev}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[10000] size-12 rounded-full bg-black/20 hover:bg-black/50 text-white flex items-center justify-center transition-colors border border-transparent hover:border-white/20 hidden sm:flex backdrop-blur-md"
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-8" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[10000] size-12 rounded-full bg-black/20 hover:bg-black/50 text-white flex items-center justify-center transition-colors border border-transparent hover:border-white/20 hidden sm:flex backdrop-blur-md"
              aria-label="Next photo"
            >
              <ChevronRight className="size-8" />
            </button>
          </>
        )}

        <div
          className="relative flex items-center justify-center perspective-[1000px] w-[96vw] h-[68vh] md:w-[94vw] md:h-[76vh] lg:w-[92vw] lg:h-[80vh] xl:w-[min(92vw,1600px)] xl:h-[min(84vh,900px)]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onMouseDown={(e) => onTouchStart(e as any)}
          onMouseUp={(e) => onTouchEnd(e as any)}
        >
          {photos.map((photo, index) => {
            if (Math.abs(index - currentIndex) > 3) return null;

            const styles = getCardStyles(index);
            const isCenter = index === currentIndex;

            return (
              <motion.div
                key={`lightbox-img-${photo.id}`}
                initial={false}
                animate={{
                  x: styles.x,
                  scale: styles.scale,
                  opacity: styles.opacity,
                  filter: styles.filter,
                  zIndex: styles.zIndex,
                }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`absolute inset-0 m-auto flex items-center justify-center w-[88%] h-[52vh] md:w-[82%] md:h-[72%] xl:w-[72%] xl:h-[78%] ${
                  isCenter ? "pointer-events-auto cursor-auto" : "pointer-events-none"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                style={{ transformOrigin: "center center" }}
              >
                <div className="relative size-full flex items-center justify-center">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.title}
                    fill
                    sizes={isCenter ? "100vw" : "50vw"}
                    quality={isCenter ? 100 : 70}
                    className="object-contain"
                    priority={Math.abs(index - currentIndex) <= 1}
                    draggable={false}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="absolute bottom-6 sm:bottom-8 left-0 w-full flex flex-col items-center justify-center pointer-events-none z-[10000]">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={`title-${currentIndex}`}
            className="text-white text-base sm:text-xl font-bold text-center max-w-2xl px-4 tracking-wide drop-shadow-md mb-2"
          >
            {currentPhoto.title}
          </motion.h2>

          <div className="flex flex-col items-center gap-2">
            <div className="text-white/75 text-xs sm:text-sm font-medium font-mono bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
              {currentIndex + 1} / {photos.length}
            </div>

            <div className="flex gap-1.5 mt-1 opacity-60">
              {photos.map((_, i) => (
                <div
                  key={`dot-${i}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex ? "w-4 bg-white" : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

LightboxViewer.displayName = "LightboxViewer";
