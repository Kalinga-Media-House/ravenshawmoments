"use client";

import * as React from "react";
import { ProfileGalleryItem } from "@/types/profile";
import { cn } from "@/lib/utils";
import { Trash2, Star, Maximize2 } from "lucide-react";

export interface GalleryGridProps {
  items: ProfileGalleryItem[];
  isOwner?: boolean;
  onDelete?: (itemId: string) => void;
  onImageClick?: (item: ProfileGalleryItem) => void;
  className?: string;
}

export function GalleryGrid({
  items = [],
  isOwner = false,
  onDelete,
  onImageClick,
  className,
}: GalleryGridProps) {
  if (!items.length) return null;

  return (
    <div className={cn("grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#D4AF37]/60"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.media_url}
            alt={item.caption || "Profile Gallery Photo"}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex flex-col justify-between p-3.5">
            <div className="flex items-center justify-between">
              {item.is_cover ? (
                <span className="inline-flex items-center rounded-full font-bold border border-[#D4AF37]/40 bg-[#D4AF37] text-[#2A0810] gap-1 text-[10px] px-2 py-0.5 shadow-sm">
                  <Star className="size-3 fill-current" />
                  <span>Cover</span>
                </span>
              ) : <div />}

              {isOwner && onDelete && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-rose-600 text-white hover:bg-rose-700 size-8 shadow-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  title="Delete Photo"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>

            <div className="flex items-end justify-between gap-2">
              {item.caption ? (
                <p className="text-xs text-white line-clamp-2 font-semibold drop-shadow-sm leading-relaxed">
                  {item.caption}
                </p>
              ) : <div />}

              {onImageClick && (
                <button
                  type="button"
                  className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 size-8 rounded-xl bg-white/20 text-white backdrop-blur-xs hover:bg-[#D4AF37] hover:text-[#2A0810] shrink-0 ml-auto shadow-sm"
                  onClick={() => onImageClick(item)}
                  title="View Fullsize"
                >
                  <Maximize2 className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
