"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { CompetitionItem } from "../types/competition";
import { CompetitionCard } from "./CompetitionCard";

export interface RelatedCompetitionsProps {
  currentCompetition: CompetitionItem;
  related: CompetitionItem[];
  prevCompetition: CompetitionItem | null;
  nextCompetition: CompetitionItem | null;
}

export const RelatedCompetitions: React.FC<RelatedCompetitionsProps> = ({
  currentCompetition,
  related,
  prevCompetition,
  nextCompetition
}) => {
  return (
    <div className="space-y-12 pt-6">
      {/* Previous & Next Navigation */}
      {(prevCompetition || nextCompetition) && (
        <nav
          aria-label="Competition sequential navigation"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[var(--color-rm-ivory-dark)] pt-8"
        >
          {prevCompetition ? (
            <Link
              href={`/competitions/${prevCompetition.slug}`}
              className="p-5 rounded-2xl transition-all duration-300 flex items-center gap-4 group bg-white border border-[var(--color-rm-ivory-dark)] shadow-sm hover:shadow-md"
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 bg-[var(--color-rm-maroon-dark)]"
              >
                <ArrowLeft className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs uppercase font-bold text-gray-500 block">
                  Previous Competition
                </span>
                <span className="text-sm font-extrabold text-[var(--color-rm-maroon-dark)] group-hover:text-[var(--color-rm-gold)] transition-colors truncate block">
                  {prevCompetition.title}
                </span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextCompetition ? (
            <Link
              href={`/competitions/${nextCompetition.slug}`}
              className="p-5 rounded-2xl transition-all duration-300 flex items-center justify-end gap-4 text-right group bg-white border border-[var(--color-rm-ivory-dark)] shadow-sm hover:shadow-md"
            >
              <div className="min-w-0">
                <span className="text-xs uppercase font-bold text-gray-500 block">
                  Next Competition
                </span>
                <span className="text-sm font-extrabold text-[var(--color-rm-maroon-dark)] group-hover:text-[var(--color-rm-gold)] transition-colors truncate block">
                  {nextCompetition.title}
                </span>
              </div>
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 bg-[var(--color-rm-maroon-dark)]"
              >
                <ArrowRight className="w-5 h-5" />
              </div>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      )}

      {/* More Opportunities Section */}
      {related.length > 0 && (
        <section aria-labelledby="more-opportunities-heading" className="space-y-6">
          <div className="flex items-center justify-between border-b border-[var(--color-rm-ivory-dark)] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--color-rm-ivory)] border border-[var(--color-rm-gold)] text-[var(--color-rm-gold)]">
                <Sparkles className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2
                id="more-opportunities-heading"
                className="text-2xl sm:text-3xl font-black text-[var(--color-rm-maroon-dark)] tracking-tight"
              >
                More Opportunities
              </h2>
            </div>

            <Link
              href="/competitions"
              className="text-xs sm:text-sm font-bold text-[var(--color-rm-gold)] hover:underline flex items-center gap-1.5"
            >
              <span>View All Competitions</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((item) => (
              <CompetitionCard key={item.id} competition={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
