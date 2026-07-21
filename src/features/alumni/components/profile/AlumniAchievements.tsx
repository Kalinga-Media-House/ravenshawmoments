import React from "react";
import Link from "next/link";
import { Trophy, ArrowUpRight } from "lucide-react";
import { AchievementSummary } from "@/types/profile";

interface AlumniAchievementsProps {
  achievements?: AchievementSummary[];
}

export const AlumniAchievements: React.FC<AlumniAchievementsProps> = ({
  achievements,
}) => {
  const items = Array.isArray(achievements) ? achievements : [];

  if (items.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="alumni-achievements-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)]">
            <Trophy className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="alumni-achievements-heading"
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              Achievements and Recognition
            </h2>
            <p className="text-xs text-white/70">
              Verified public honors, awards, and milestones.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((ach) => (
            <div
              key={ach.id}
              className="rm-glass-card rounded-2xl p-5 border border-white/10 flex items-start justify-between gap-4 hover:border-[var(--color-rm-gold)]/40 transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-rm-gold)] uppercase tracking-wider">
                  <span>{ach.category_name || "Honor"}</span>
                  {ach.achievement_date && (
                    <>
                      <span className="text-white/30">•</span>
                      <span>{ach.achievement_date}</span>
                    </>
                  )}
                </div>
                <h3 className="text-base font-black text-white">{ach.title}</h3>
                {ach.issuing_organization && (
                  <p className="text-xs text-white/75 leading-relaxed">
                    Issued by: {ach.issuing_organization}
                  </p>
                )}
              </div>

              {ach.slug && (
                <Link
                  href={`/achievements/${ach.slug}`}
                  className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-[var(--color-rm-gold)] hover:border-[var(--color-rm-gold)]/50 shrink-0 transition-colors"
                  aria-label={`View achievement ${ach.title}`}
                >
                  <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
