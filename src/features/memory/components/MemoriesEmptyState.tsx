"use client";

import React from "react";
import { Camera, RotateCcw } from "lucide-react";

export interface MemoriesEmptyStateProps {
  onReset: () => void;
}

export const MemoriesEmptyState = ({ onReset }: MemoriesEmptyStateProps) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-xl mx-auto my-12 p-8 sm:p-12 rm-glass-card rounded-3xl border border-[var(--color-rm-glass-border)] text-center flex flex-col items-center justify-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-rm-gold)]/10 border border-[var(--color-rm-gold)]/25 flex items-center justify-center mb-6">
        <Camera className="w-8 h-8 text-[var(--color-maroon)]" aria-hidden="true" />
      </div>

      <h3 className="text-2xl font-bold rm-heading-primary mb-3">
        No Memories Found
      </h3>

      <p className="text-sm sm:text-base rm-text-body text-black/75 font-medium max-w-md mb-8 leading-relaxed">
        We could not find a memory matching your search or selected filters. Try another keyword or clear the filters.
      </p>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[var(--color-rm-gold)] text-[#12070B] font-bold text-sm transition-all duration-300 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12070B]"
      >
        <RotateCcw className="w-4 h-4" aria-hidden="true" />
        Clear Search and Filters
      </button>
    </div>
  );
};
