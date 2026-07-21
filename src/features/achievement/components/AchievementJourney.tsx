import React from "react";
import { Milestone } from "lucide-react";
import { AchievementItem } from "../types/achievement";

export interface JourneyMilestone {
  date: string;
  title: string;
  description?: string;
  institution?: string;
  location?: string;
}

export interface AchievementJourneyProps {
  achievement: AchievementItem;
  journey?: JourneyMilestone[];
}

export const AchievementJourney = ({ journey }: AchievementJourneyProps) => {
  if (!journey || journey.length === 0) {
    return null;
  }

  return (
    <section className="rm-glass-card rounded-[2rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] w-full">
      <div className="flex items-center gap-2.5 pb-4 mb-8 border-b border-white/10">
        <Milestone className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />
        <h2 className="text-xl font-bold rm-heading-primary text-white">The Journey</h2>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l-2 border-[var(--color-rm-gold)]/40 space-y-8">
        {journey.map((item, index) => (
          <div key={index} className="relative">
            <span
              className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[var(--color-rm-gold)] border-4 border-[#12070B]"
              aria-hidden="true"
            />
            <time className="text-xs font-bold uppercase tracking-widest text-[var(--color-rm-gold)]">
              {item.date}
            </time>
            <h3 className="text-lg font-bold text-white mt-1">{item.title}</h3>
            {item.description && (
              <p className="text-sm font-medium text-white/80 mt-2 leading-relaxed">
                {item.description}
              </p>
            )}
            {(item.institution || item.location) && (
              <p className="text-xs font-medium text-white/60 mt-2">
                {[item.institution, item.location].filter(Boolean).join(" | ")}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
