"use client";

import React from "react";
import { Trophy, RefreshCw } from "lucide-react";

export interface CompetitionsEmptyStateProps {
  onReset: () => void;
}

export const CompetitionsEmptyState: React.FC<CompetitionsEmptyStateProps> = ({
  onReset,
}) => {
  return (
    <div className="bg-[#FFFDF9] rounded-3xl p-8 sm:p-12 border border-[#D4AF37]/30 shadow-md text-center max-w-xl mx-auto space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-[#4B1724]/5 border border-[#D4AF37]/40 flex items-center justify-center mx-auto text-[#D4AF37] shadow-sm">
        <Trophy className="w-8 h-8" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl sm:text-2xl font-black text-[#4B1724]">
          No Competitions Found
        </h3>
        <p className="text-xs sm:text-sm text-[#62575A] font-medium leading-relaxed max-w-md mx-auto">
          We could not find a competition matching your search or selected filters. Try another keyword or clear the filters.
        </p>
      </div>

      <div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#4B1724] hover:bg-[#3A121B] hover:text-white border border-[#D4AF37]/60 text-xs sm:text-sm font-extrabold text-white transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4" aria-hidden="true" />
          <span>Clear Search and Filters</span>
        </button>
      </div>
    </div>
  );
};
