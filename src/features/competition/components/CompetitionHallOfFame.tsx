"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Award, Trophy } from "lucide-react";
import { WinnerGalleryEntry } from "../types/results";

export interface CompetitionHallOfFameProps {
  winners?: WinnerGalleryEntry[];
}

const WinnerAvatar: React.FC<{
  name: string;
  avatarUrl: string | null;
}> = ({ name, avatarUrl }) => {
  const [imgError, setImgError] = useState(false);
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "RM";

  return (
    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#E7BB45]/45 group-hover:border-[#E7BB45] transition-colors bg-[#FFFDF7] shadow-[0_6px_18px_rgba(80,0,20,0.14)] flex items-center justify-center">
      {avatarUrl && !imgError ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={80}
          height={80}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-base font-bold text-[#650018]">{initials}</span>
      )}
    </div>
  );
};

export const CompetitionHallOfFame: React.FC<CompetitionHallOfFameProps> = ({
  winners = [],
}) => {
  const displayWinners = winners.slice(0, 5);

  return (
    <section
      id="hall-of-fame-section"
      aria-labelledby="hall-of-fame-heading"
      className="w-full bg-gradient-to-br from-[#35000C] via-[#520012] to-[#700019] rounded-[28px] border border-[#D9A928]/25 shadow-[0_22px_55px_rgba(55,0,14,0.24)] p-6 sm:p-10 relative overflow-hidden"
    >
      {/* Decorative ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(231,187,69,0.11),transparent_38%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 sm:mb-12 gap-4">
        <div>
          <h2
            id="hall-of-fame-heading"
            className="text-2xl sm:text-3xl font-bold text-[#FFF9EF] tracking-tight flex items-center gap-3"
          >
            <Trophy className="w-6 h-6 text-[#E7BB45]" />
            Winners Gallery
          </h2>
          <p className="text-sm sm:text-base text-[#F4E5CF]/80 mt-1 font-medium">
            Celebrating Ravenshaw&apos;s finest achievers
          </p>
        </div>
      </div>

      {displayWinners.length > 0 ? (
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
          {displayWinners.map((winner) => (
            <div
              key={winner.resultId}
              className="group flex flex-col items-center p-6 bg-[#FFF9EF] border border-[#E7BB45]/30 rounded-[22px] shadow-[0_12px_30px_rgba(20,0,5,0.20)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(20,0,5,0.28)] hover:border-[#E7BB45]/60 h-full"
            >
              <Link
                href={`/profile/${winner.slug}`}
                className="flex flex-col items-center w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7BB45] rounded-xl"
              >
                <div className="relative mb-4">
                  <WinnerAvatar name={winner.fullName} avatarUrl={winner.avatarUrl} />
                  <div className="absolute -bottom-2 -right-2 p-1.5 rounded-full border shadow-md bg-[#FFF1B8] text-[#B27A00] border-[#E7BB45]">
                    <Award className="w-4 h-4 text-current" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#352A2E] text-center mb-1 group-hover:text-[#650018] transition-colors line-clamp-1">
                  {winner.fullName}
                </h3>
              </Link>

              <p className="text-sm text-[#6B5B60] font-medium text-center mb-4 line-clamp-1">
                {winner.departmentOrInstitution}
              </p>

              <Link
                href={`/competitions/${winner.competitionSlug}`}
                className="px-3 py-1.5 rounded-full text-xs font-semibold flex items-center justify-center w-full mt-auto bg-[#650018]/8 border border-[#650018]/15 text-[#650018] hover:bg-[#650018]/15 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#650018]"
                title={winner.competitionTitle}
              >
                <span className="line-clamp-1 truncate">{winner.competitionTitle}</span>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        /* Winners Gallery Empty State */
        <div className="relative z-10 flex flex-col items-center justify-center py-12 px-4 text-center">
          <div className="w-14 h-14 rounded-full bg-[#FFF9EF]/10 border border-[#E7BB45]/30 flex items-center justify-center text-[#E7BB45] mb-4">
            <Trophy className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-[#FFF9EF] mb-2">No Winners Published Yet</h3>
          <p className="text-[#F4E5CF]/80 font-medium text-sm max-w-md leading-relaxed">
            Competition champions will appear here after official results are published.
          </p>
        </div>
      )}
    </section>
  );
};
