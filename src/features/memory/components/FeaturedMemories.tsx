"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, MapPin, ArrowRight } from "lucide-react";
import { MemoryItem } from "../types/memory";

export interface FeaturedMemoriesProps {
  memories: MemoryItem[];
}

export const FeaturedMemories = ({ memories }: FeaturedMemoriesProps) => {
  const featuredList = memories.filter((item) => item.featured && item.approved);

  if (featuredList.length === 0) {
    return null;
  }

  const primary = featuredList[0];
  const supporting = featuredList.slice(1, 3);

  return (
    <section aria-label="Featured Memories" className="w-full mb-16">
      <div className="flex items-center gap-2.5 mb-6">
        <Star className="w-5 h-5 text-[var(--color-maroon)] fill-current" aria-hidden="true" />
        <h2 className="text-2xl font-bold rm-heading-primary">Featured Memories</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Primary Featured Card */}
        <div className={supporting.length > 0 ? "lg:col-span-7" : "lg:col-span-12"}>
          <Link
            href={primary.href}
            className="group relative block w-full h-full min-h-[380px] sm:min-h-[440px] rounded-[2rem] overflow-hidden border border-[var(--color-rm-glass-border)] bg-[#12070B] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)]"
          >
            <Image
              src={primary.coverImage}
              alt={primary.imageAlt || primary.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover transition-transform duration-700 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12070B] via-[#12070B]/50 to-transparent opacity-90" />

            <div className="absolute top-6 left-6 right-6 flex items-center justify-between gap-2 z-10">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-[var(--color-rm-gold)] text-[#12070B]">
                {primary.category}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase bg-black/10 text-white backdrop-blur-md border border-black/20">
                <Star className="w-3.5 h-3.5 fill-current text-[var(--color-maroon)]" aria-hidden="true" />
                Featured Story
              </span>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-10">
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-medium text-muted-foreground mb-3">
                {primary.capturedAt && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />
                    <span>{primary.capturedAt}</span>
                  </div>
                )}
                {primary.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />
                    <span>{primary.location}</span>
                  </div>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold rm-heading-primary mb-3 group-hover:text-[var(--color-maroon)] transition-colors">
                {primary.title}
              </h3>

              <p className="text-sm sm:text-base rm-text-body font-medium text-black/80 line-clamp-2 max-w-2xl mb-4">
                {primary.shortDescription}
              </p>

              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[var(--color-maroon)] group-hover:underline">
                Explore Memory
                <ArrowRight
                  className="w-4 h-4 transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </span>
            </div>
          </Link>
        </div>

        {/* Supporting Featured Cards */}
        {supporting.length > 0 && (
          <div className="lg:col-span-5 flex flex-col gap-6">
            {supporting.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="group relative flex-1 min-h-[200px] rounded-[1.75rem] overflow-hidden border border-[var(--color-rm-glass-border)] bg-[#12070B] transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)]"
              >
                <Image
                  src={item.coverImage}
                  alt={item.imageAlt || item.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12070B] via-[#12070B]/60 to-transparent opacity-90" />

                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-wider text-[var(--color-maroon)] block mb-1">
                    {item.category}
                  </span>
                  <h4 className="text-lg font-bold rm-heading-primary mb-2 group-hover:text-[var(--color-maroon)] transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-black/80 group-hover:text-[var(--color-maroon)]">
                    Explore Memory
                    <ArrowRight
                      className="w-3.5 h-3.5 transition-transform duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
