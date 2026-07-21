"use client";

import React, { useMemo } from "react";
import { MemoryItem } from "../types/memory";
import { MemoryCard } from "./MemoryCard";

export interface MemoryTimelineProps {
  memories: MemoryItem[];
}

export const MemoryTimeline = ({ memories }: MemoryTimelineProps) => {
  const groupedByYear = useMemo(() => {
    const map = new Map<string, MemoryItem[]>();

    memories.forEach((item) => {
      const yr = item.memoryYear || "Earlier Memories";
      const existing = map.get(yr) || [];
      existing.push(item);
      map.set(yr, existing);
    });

    const sortedYears = Array.from(map.keys()).sort((a, b) => {
      if (a === "Earlier Memories") return 1;
      if (b === "Earlier Memories") return -1;
      return Number(b) - Number(a);
    });

    return sortedYears.map((yr) => ({
      yearLabel: yr,
      items: map.get(yr) || [],
    }));
  }, [memories]);

  if (memories.length === 0) {
    return null;
  }

  return (
    <div className="w-full space-y-12">
      {groupedByYear.map(({ yearLabel, items }) => (
        <section key={yearLabel} aria-label={`Memories from ${yearLabel}`} className="w-full">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xl sm:text-2xl font-extrabold rm-heading-primary text-[var(--color-maroon)]">
              {yearLabel}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[var(--color-rm-gold)]/40 to-transparent" />
            <span className="text-xs font-bold uppercase tracking-wider text-white/50">
              {items.length} {items.length === 1 ? "Memory" : "Memories"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
