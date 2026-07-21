"use client";

import React, { useMemo } from "react";
import { Camera, Calendar, Users, Star } from "lucide-react";
import { MemoryItem } from "../types/memory";

export interface MemoryStatisticsProps {
  memories: MemoryItem[];
}

export const MemoryStatistics = ({ memories }: MemoryStatisticsProps) => {
  const stats = useMemo(() => {
    const totalMemories = memories.length;

    const yearsSet = new Set(
      memories
        .map((item) => item.memoryYear)
        .filter(Boolean)
    );
    const totalYears = yearsSet.size;

    const communitiesSet = new Set(
      memories
        .map((item) => item.communityType)
        .filter(Boolean)
    );
    const totalCommunities = communitiesSet.size;

    const totalFeatured = memories.filter((item) => item.featured).length;

    return { totalMemories, totalYears, totalCommunities, totalFeatured };
  }, [memories]);

  if (stats.totalMemories === 0) {
    return null;
  }

  return (
    <section aria-label="Memory Archive Statistics" className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
      <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-[var(--color-rm-glass-border)] flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[var(--color-rm-gold)]/10 border border-[var(--color-rm-gold)]/20 flex items-center justify-center shrink-0">
          <Camera className="w-6 h-6 text-[var(--color-maroon)]" aria-hidden="true" />
        </div>
        <div>
          <span className="text-2xl sm:text-3xl font-extrabold text-white block rm-heading-primary">
            {stats.totalMemories}
          </span>
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">
            {stats.totalMemories === 1 ? "Memory Preserved" : "Memories Preserved"}
          </span>
        </div>
      </div>

      {stats.totalYears > 0 && (
        <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-[var(--color-rm-glass-border)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-rm-gold)]/10 border border-[var(--color-rm-gold)]/20 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-[var(--color-maroon)]" aria-hidden="true" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-white block rm-heading-primary">
              {stats.totalYears}
            </span>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              {stats.totalYears === 1 ? "Year Represented" : "Years Represented"}
            </span>
          </div>
        </div>
      )}

      {stats.totalCommunities > 0 && (
        <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-[var(--color-rm-glass-border)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-rm-gold)]/10 border border-[var(--color-rm-gold)]/20 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6 text-[var(--color-maroon)]" aria-hidden="true" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-white block rm-heading-primary">
              {stats.totalCommunities}
            </span>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              {stats.totalCommunities === 1 ? "Community Connected" : "Communities Connected"}
            </span>
          </div>
        </div>
      )}

      {stats.totalFeatured > 0 && (
        <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-[var(--color-rm-glass-border)] flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-rm-gold)]/10 border border-[var(--color-rm-gold)]/20 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 text-[var(--color-maroon)]" aria-hidden="true" />
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-extrabold text-white block rm-heading-primary">
              {stats.totalFeatured}
            </span>
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">
              {stats.totalFeatured === 1 ? "Featured Story" : "Featured Stories"}
            </span>
          </div>
        </div>
      )}
    </section>
  );
};
