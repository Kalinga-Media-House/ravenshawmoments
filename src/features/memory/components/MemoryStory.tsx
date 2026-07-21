"use client";

import React from "react";
import { MemoryItem } from "../types/memory";

export interface MemoryStoryProps {
  memory: MemoryItem;
}

export const MemoryStory: React.FC<MemoryStoryProps> = ({ memory }) => {
  const storyContent = memory.fullStory || memory.shortDescription;

  if (!storyContent) {
    return null;
  }

  // Split story into paragraphs by newline
  const paragraphs = storyContent
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section aria-labelledby="memory-story-heading" className="w-full my-10 md:my-14">
      <div className="max-w-[760px] mx-auto">
        <h2
          id="memory-story-heading"
          className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-maroon)] mb-4"
        >
          The Story Behind This Memory
        </h2>

        <div className="space-y-6 text-base sm:text-lg md:text-xl leading-relaxed text-white/90 font-normal">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="first:text-lg first:sm:text-xl first:font-medium">
              {para}
            </p>
          ))}
        </div>

        {memory.tags && memory.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t border-black/10 flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-black/60 mr-2">
              Tags:
            </span>
            {memory.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-black/5 text-black/80 border border-black/10"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
