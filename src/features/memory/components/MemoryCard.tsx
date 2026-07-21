"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Building2,
  Home as HomeIcon,
  Users,
  Trophy,
  ArrowRight,
  Star,
  Image as ImageIcon,
} from "lucide-react";
import { MemoryItem } from "../types/memory";

export interface MemoryCardProps {
  memory: MemoryItem;
}

export const MemoryCard = ({ memory }: MemoryCardProps) => {
  const [imageError, setImageError] = useState(false);

  const getCommunityIcon = () => {
    switch (memory.communityType) {
      case "Departments":
        return <Building2 className="w-3.5 h-3.5 text-[var(--color-maroon)]" aria-hidden="true" />;
      case "Hostels":
        return <HomeIcon className="w-3.5 h-3.5 text-[var(--color-maroon)]" aria-hidden="true" />;
      case "Organizations":
        return <Users className="w-3.5 h-3.5 text-[var(--color-maroon)]" aria-hidden="true" />;
      case "Achievements":
        return <Trophy className="w-3.5 h-3.5 text-[var(--color-maroon)]" aria-hidden="true" />;
      default:
        return null;
    }
  };

  const getCommunityName = () => {
    return (
      memory.departmentName ||
      memory.hostelName ||
      memory.organizationName ||
      memory.eventName ||
      memory.achievementName
    );
  };

  const communityName = getCommunityName();

  return (
    <article className="group h-full flex flex-col rm-glass-card rounded-[1.75rem] overflow-hidden border border-[var(--color-rm-glass-border)] transition-all duration-300 [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--color-rm-gold)]/40 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_12px_32px_rgba(176,24,70,0.22)]">
      {/* Image Header */}
      <div className="relative w-full aspect-[16/10] bg-black/5 overflow-hidden">
        {!imageError && memory.coverImage ? (
          <Image
            src={memory.coverImage}
            alt={memory.imageAlt || memory.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/5 text-black/40 p-4 text-center">
            <ImageIcon className="w-10 h-10 mb-2 opacity-60" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-wider">Memory Archive</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#12070B] via-[#12070B]/20 to-transparent opacity-60" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
          <span className="px-3 py-1 rounded-full text-[0.6875rem] font-bold tracking-wider uppercase bg-[#12070B]/85 text-[var(--color-maroon)] border border-[var(--color-rm-gold)]/30 backdrop-blur-md">
            {memory.category}
          </span>

          {memory.featured && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.6875rem] font-bold tracking-wider uppercase bg-[var(--color-rm-gold)] text-[#12070B]"
              aria-label="Featured Memory"
            >
              <Star className="w-3 h-3 fill-current" aria-hidden="true" />
              Featured
            </span>
          )}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-black/65 mb-3">
            {memory.capturedAt && (
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[var(--color-maroon)] shrink-0" aria-hidden="true" />
                <span>{memory.capturedAt}</span>
              </div>
            )}

            {memory.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[var(--color-maroon)] shrink-0" aria-hidden="true" />
                <span className="line-clamp-1">{memory.location}</span>
              </div>
            )}
          </div>

          <h3 className="text-lg font-bold rm-heading-primary leading-snug mb-2 group-hover:text-[var(--color-maroon)] transition-colors line-clamp-2">
            {memory.title}
          </h3>

          <p className="text-sm rm-text-body text-black/75 font-medium leading-relaxed line-clamp-3 mb-4">
            {memory.shortDescription}
          </p>
        </div>

        {/* Footer Area */}
        <div className="pt-4 mt-auto border-t border-black/10 flex items-center justify-between gap-3">
          {communityName ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-black/80 line-clamp-1">
              {getCommunityIcon()}
              <span className="line-clamp-1">{communityName}</span>
            </div>
          ) : (
            <span className="text-xs font-semibold text-white/50">Ravenshaw Moments</span>
          )}

          <Link
            href={`/memories/${memory.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-maroon)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] rounded shrink-0"
          >
            Explore Memory
            <ArrowRight
              className="w-3.5 h-3.5 transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
};
