import React from "react";
import { Trophy, RefreshCcw } from "lucide-react";

export interface AchievementsEmptyStateProps {
  onClear: () => void;
}

export const AchievementsEmptyState = ({ onClear }: AchievementsEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 rm-glass-card rounded-[2rem] text-center border border-[var(--color-rm-glass-border)]">
      <div className="w-16 h-16 rounded-full bg-[var(--color-maroon)]/10 flex items-center justify-center mb-6">
        <Trophy className="w-8 h-8 text-[var(--color-maroon)] opacity-50" aria-hidden="true" />
      </div>
      <h3 className="text-2xl font-bold rm-heading-primary mb-3 text-white">No Achievements Found</h3>
      <p className="text-[1rem] rm-text-body font-medium text-muted-foreground mb-8 max-w-md">
        We could not find an achievement matching your search or selected filters. Try another keyword or clear the filters.
      </p>
      <button 
        onClick={onClear}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black/5 hover:bg-black/10 text-foreground border border-border rounded-xl font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)]"
      >
        <RefreshCcw className="w-4 h-4" aria-hidden="true" />
        Clear Search and Filters
      </button>
    </div>
  );
};
