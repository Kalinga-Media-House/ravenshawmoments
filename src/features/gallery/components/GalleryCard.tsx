import React from "react";
import Image from "next/image";
import { CalendarDays, MapPin } from "lucide-react";
import { GalleryItem } from "../types/gallery";

interface GalleryCardProps {
  item: GalleryItem;
  onClick: (item: GalleryItem) => void;
}

export const GalleryCard = ({ item, onClick }: GalleryCardProps) => {
  return (
    <button
      onClick={() => onClick(item)}
      className="group w-full text-left relative flex flex-col heritage-card-glass rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-heritage-gold)] focus-visible:ring-offset-2 transition-all duration-300 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_12px_40px_-15px_rgba(176,24,70,0.2)]"
      aria-label={`View memory: ${item.title}`}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] sm:aspect-[3/4] md:aspect-[4/3] overflow-hidden bg-black shrink-0">
        <Image
          src={item.imageUrl}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-[1.05] motion-reduce:transition-none"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 transition-opacity duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-80" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="text-[0.65rem] sm:text-xs font-bold tracking-widest text-white uppercase px-3 py-1 bg-black/50 border border-white/20 backdrop-blur-md rounded-full shadow-sm">
            {item.category}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow">
        
        {/* Title */}
        <h3 className="text-[1.1rem] sm:text-[1.2rem] font-bold heritage-card-title mb-2 leading-tight group-hover:text-[var(--color-heritage-gold)] transition-colors duration-300">
          {item.title}
        </h3>

        {/* Community if available */}
        {item.communityName && (
          <p className="text-[0.85rem] font-bold text-[var(--color-heritage-gold)] mb-2">
            {item.communityName}
          </p>
        )}

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 mt-auto pt-2">
          {item.capturedAt && (
            <div className="flex items-center gap-1.5 text-[0.8rem] font-medium text-white/70">
              <CalendarDays className="w-3.5 h-3.5 text-[var(--color-heritage-gold)]" aria-hidden="true" />
              <span>{item.capturedAt}</span>
            </div>
          )}
          {item.location && (
            <div className="flex items-center gap-1.5 text-[0.8rem] font-medium text-white/70">
              <MapPin className="w-3.5 h-3.5 text-[var(--color-heritage-gold)]" aria-hidden="true" />
              <span className="truncate max-w-[120px] sm:max-w-[150px]">{item.location}</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
};
