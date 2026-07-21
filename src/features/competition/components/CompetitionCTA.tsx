"use client";

import React from "react";
import Link from "next/link";
import { Trophy, Award, Sparkles } from "lucide-react";

export interface CompetitionCTAProps {
  onExploreOpen?: () => void;
}

export const CompetitionCTA: React.FC<CompetitionCTAProps> = ({
  onExploreOpen,
}) => {
  return (
    <section aria-labelledby="competition-cta-heading" className="w-full pt-8">
      <div className="relative overflow-hidden rm-glass-card rounded-3xl p-8 sm:p-12 lg:p-14 border border-[var(--color-rm-gold)]/40 bg-[linear-gradient(135deg,rgba(40,4,12,0.88)_0%,rgba(18,7,11,0.95)_100%)] text-center max-w-4xl mx-auto shadow-2xl">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[var(--color-rm-maroon)]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[var(--color-rm-gold)]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/50 flex items-center justify-center text-[var(--color-rm-gold)] shadow-xl">
            <Trophy className="w-7 h-7" aria-hidden="true" />
          </div>

          <div className="space-y-3">
            <h2
              id="competition-cta-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight"
            >
              Ready to Take the Challenge?
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
              Explore opportunities, prepare your ideas, showcase your talent, and become part of the achievements that inspire future Ravenshawvians.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto pt-2">
            <button
              type="button"
              onClick={onExploreOpen}
              className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--color-rm-maroon)] hover:bg-[var(--color-rm-maroon)]/90 border border-[var(--color-rm-gold)]/60 text-xs sm:text-sm font-extrabold text-white transition-all duration-300 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
            >
              <Sparkles className="w-4 h-4 text-[var(--color-rm-gold)]" aria-hidden="true" />
              <span>Explore Open Competitions</span>
            </button>

            <Link
              href="/achievements"
              className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/25 text-xs sm:text-sm font-bold text-white transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
            >
              <Award className="w-4 h-4 text-[var(--color-rm-gold)]" aria-hidden="true" />
              <span>View Achievements</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
