import React from "react";
import Image from "next/image";
import { Trophy, Award, Medal, UserCircle } from "lucide-react";
import { CategoryWinnerEdition, CategoryWinnerPodium } from "../../types/categoryPortal";

const LEVEL_DISPLAY_LABELS: Record<string, string> = {
  department: "Department Level",
  university: "University Level",
  state: "State Level"
};

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

interface CategoryWinnersGalleryProps {
  edition: CategoryWinnerEdition | null;
  categoryName: string;
}

export function CategoryWinnersGallery({
  edition,
  categoryName
}: CategoryWinnersGalleryProps) {
  if (!edition || edition.levelGroups.length === 0) {
    return (
      <div className="rounded-3xl border border-[#8A1735]/30 bg-[#2B070E]/40 p-8 text-center text-[#FFF9F0]">
        <Trophy className="mx-auto mb-3 h-10 w-10 text-[#D4AF37]/60" />
        <h3 className="text-xl font-bold">No Published Winners Yet</h3>
        <p className="mt-2 text-sm text-[#FFF9F0]/70 max-w-md mx-auto">
          Official monthly results for {categoryName} have not been published yet. Results appear here once finalized by the judging committee.
        </p>
      </div>
    );
  }

  const periodLabel = `${MONTH_NAMES[edition.editionMonth - 1]} ${edition.editionYear}`;

  const renderPodiumBadge = (outcome: "first" | "second" | "third") => {
    switch (outcome) {
      case "first":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 px-3 py-1 text-xs font-bold text-amber-300">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            1st Place
          </span>
        );
      case "second":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-300/20 border border-slate-300/40 px-3 py-1 text-xs font-bold text-slate-200">
            <Medal className="w-3.5 h-3.5 text-slate-300" />
            2nd Place
          </span>
        );
      case "third":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-800/30 border border-amber-700/40 px-3 py-1 text-xs font-bold text-amber-600">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            3rd Place
          </span>
        );
    }
  };

  const renderPodiumCard = (winner: CategoryWinnerPodium) => (
    <div
      key={winner.resultId}
      className="flex flex-col justify-between rounded-2xl border border-[#8A1735]/40 bg-[#4A0E17]/40 p-5 shadow-lg hover:border-[#D4AF37]/50 transition-all"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {renderPodiumBadge(winner.outcome)}
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#D4AF37]/40 bg-[#2B070E] text-[#D4AF37]">
            <UserCircle className="h-8 w-8" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-[#FFF9F0] truncate">
              {winner.displayName}
            </h4>
            <p className="text-xs text-[#FFF9F0]/70 truncate">
              {winner.publicAffiliation}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="space-y-8">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#8A1735]/40 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFF9F0] flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#D4AF37]" />
            Current Monthly Winners
          </h2>
          <p className="text-sm text-[#FFF9F0]/70 mt-1">
            Authoritative published winners for the most recent period:{" "}
            <strong className="text-[#D4AF37] font-semibold">{periodLabel}</strong>
          </p>
        </div>
      </div>

      {/* Render each available level group */}
      <div className="space-y-10">
        {edition.levelGroups.map((levelGroup) => (
          <div key={levelGroup.level} className="space-y-6">
            <h3 className="text-lg font-bold text-[#D4AF37] border-l-4 border-[#D4AF37] pl-3">
              {LEVEL_DISPLAY_LABELS[levelGroup.level] || levelGroup.level}
            </h3>

            <div className="space-y-8 pl-4">
              {levelGroup.competitions.map((competition) => (
                <div key={competition.competitionId} className="space-y-4">
                  <h4 className="text-md font-semibold text-[#FFF9F0]/90">
                    {competition.competitionTitle}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {competition.podium.map(renderPodiumCard)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
