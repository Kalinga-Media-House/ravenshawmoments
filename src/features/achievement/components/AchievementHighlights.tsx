import React from "react";
import { Sparkles } from "lucide-react";
import { AchievementItem } from "../types/achievement";

export interface AchievementHighlightsProps {
  achievement: AchievementItem;
  highlights?: string[];
}

export const AchievementHighlights = ({ highlights }: AchievementHighlightsProps) => {
  if (!highlights || highlights.length === 0) {
    return null;
  }

  return (
    <section className="rm-glass-card rounded-[2rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] w-full">
      <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/10">
        <Sparkles className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />
        <h2 className="text-xl font-bold rm-heading-primary text-white">Achievement Highlights</h2>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {highlights.map((highlight, index) => (
          <li
            key={index}
            className="p-4 rounded-xl bg-white/5 border border-white/10 text-sm font-medium text-white/90 leading-relaxed"
          >
            {highlight}
          </li>
        ))}
      </ul>
    </section>
  );
};
