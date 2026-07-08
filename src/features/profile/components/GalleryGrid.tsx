"use client";

import * as React from "react";
import { ProfileGalleryItem } from "@/types/profile";
import { cn } from "@/lib/utils";
import { Trash2, Star, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
          className="group relative aspect-square w-full overflow-hidden rounded-xl border bg-muted/30 shadow-2xs transition-all hover:shadow-md"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.media_url}
            alt={item.caption || "Profile Gallery Photo"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 flex flex-col justify-between p-3">
            <div className="flex items-center justify-between">
              {item.is_cover ? (
                <Badge className="bg-amber-500 hover:bg-amber-600 text-white gap-1 text-[10px] px-1.5 py-0">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  <span>Cover</span>
                </Badge>
              ) : <div />}

              {isOwner && onDelete && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-7 w-7 rounded-lg opacity-90 hover:opacity-100 shadow-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  title="Delete Photo"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            <div className="flex items-end justify-between gap-2">
              {item.caption ? (
                <p className="text-xs text-white line-clamp-2 font-medium drop-shadow-xs">
                  {item.caption}
                </p>
              ) : <div />}

              {onImageClick && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-7 w-7 rounded-lg bg-white/20 text-white backdrop-blur-xs hover:bg-white/40 shrink-0 ml-auto"
                  onClick={() => onImageClick(item)}
                  title="View Fullsize"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
