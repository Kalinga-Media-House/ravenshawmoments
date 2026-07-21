import React from "react";
import Image from "next/image";
import { Images } from "lucide-react";
import { AchievementItem } from "../types/achievement";

export interface AchievementGalleryImage {
  url: string;
  alt?: string;
}

export interface AchievementGalleryProps {
  achievement: AchievementItem;
  images?: AchievementGalleryImage[];
}

export const AchievementGallery = ({ images }: AchievementGalleryProps) => {
  if (!images || images.length === 0) {
    return null;
  }

  return (
    <section className="rm-glass-card rounded-[2rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] w-full">
      <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/10">
        <Images className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />
        <h2 className="text-xl font-bold rm-heading-primary text-white">Achievement Gallery</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-white/5 border border-white/10 group"
          >
            <Image
              src={img.url}
              alt={img.alt || `Achievement Gallery Image ${index + 1}`}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
};
