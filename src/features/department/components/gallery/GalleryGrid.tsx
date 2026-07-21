// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/gallery/GalleryGrid.tsx
// Purpose   : Responsive multi-column grid for departmental gallery media
// =============================================================================

import React from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { DepartmentGallery } from "@/types/department";
import { EmptyDepartmentState } from "../shared/EmptyDepartmentState";

export interface GalleryGridProps {
  items: DepartmentGallery[];
  onSelectItem?: (item: DepartmentGallery) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ items, onSelectItem }) => {
  if (items.length === 0) {
    return (
      <EmptyDepartmentState
        title="Gallery Empty"
        description="No photos or media albums have been uploaded to this department gallery yet."
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelectItem?.(item)}
          className="group relative aspect-square overflow-hidden rounded-2xl border border-border/80 bg-card cursor-pointer shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#D4AF37]/60"
        >
          {item.cover_url ? (
            <Image
              src={item.cover_url}
              alt={item.title || "Department Album"}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground/40">
              <ImageIcon className="size-8" aria-hidden="true" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <p className="text-sm font-bold text-white line-clamp-2 leading-snug">{item.title}</p>
            {item.item_count !== undefined && (
              <p className="text-xs font-semibold text-[#D4AF37] mt-1">{item.item_count} items</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
