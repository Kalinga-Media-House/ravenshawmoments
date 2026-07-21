"use client";

import React, { useMemo } from "react";
import { MemoryItem } from "../types/memory";
import { MemoryCard } from "./MemoryCard";

export interface RelatedMemoriesProps {
  currentMemory: MemoryItem;
  allMemories: MemoryItem[];
}

export const RelatedMemories: React.FC<RelatedMemoriesProps> = ({
  currentMemory,
  allMemories,
}) => {
  const relatedList = useMemo(() => {
    return allMemories
      .filter((item) => {
        if (item.id === currentMemory.id || item.slug === currentMemory.slug) {
          return false;
        }
        if (item.approved === false || item.publicVisibility === false) {
          return false;
        }
        return true;
      })
      .map((item) => {
        let score = 0;

        // Same event
        if (
          currentMemory.eventName &&
          item.eventName &&
          currentMemory.eventName === item.eventName
        ) {
          score += 10;
        }
        // Same department
        if (
          currentMemory.departmentName &&
          item.departmentName &&
          currentMemory.departmentName === item.departmentName
        ) {
          score += 8;
        }
        // Same hostel
        if (
          currentMemory.hostelName &&
          item.hostelName &&
          currentMemory.hostelName === item.hostelName
        ) {
          score += 8;
        }
        // Same organization
        if (
          currentMemory.organizationName &&
          item.organizationName &&
          currentMemory.organizationName === item.organizationName
        ) {
          score += 8;
        }
        // Same category
        if (currentMemory.category === item.category) {
          score += 5;
        }
        // Same year
        if (
          currentMemory.memoryYear &&
          item.memoryYear &&
          currentMemory.memoryYear === item.memoryYear
        ) {
          score += 3;
        }
        // Same batch
        if (
          currentMemory.batch &&
          item.batch &&
          currentMemory.batch === item.batch
        ) {
          score += 3;
        }

        return { item, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.item);
  }, [currentMemory, allMemories]);

  if (relatedList.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-memories-heading" className="w-full my-14 md:my-20">
      <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px]">
        <div className="mb-8">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-maroon)] block mb-2">
            EXPLORE THE ARCHIVE
          </span>
          <h2
            id="related-memories-heading"
            className="text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold text-white leading-tight"
          >
            More Memories to Revisit
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedList.map((item) => (
            <MemoryCard key={item.id} memory={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
