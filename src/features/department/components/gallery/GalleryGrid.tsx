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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelectItem?.(item)}
          className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted cursor-pointer shadow-2xs transition-transform hover:scale-[1.02]"
        >
          {item.cover_url ? (
            <Image
              src={item.cover_url}
              alt={item.title || "Department Album"}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/40">
              <ImageIcon className="h-8 w-8" aria-hidden="true" />
            </div>
          )}

          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <p className="text-xs font-medium text-white line-clamp-2">{item.title}</p>
            {item.item_count !== undefined && (
              <p className="text-2xs text-white/80">{item.item_count} items</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
