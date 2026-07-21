"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trophy, ChevronRight, Award } from "lucide-react";
import { LeaderboardEntry, ChampionSpotlightEntry } from "../types/results";

export interface CompetitionLeaderboardProps {
  leaderboard?: LeaderboardEntry[];
  champion?: ChampionSpotlightEntry | null;
}

const ParticipantAvatar: React.FC<{
  name: string;
  avatarUrl: string | null;
  size?: "sm" | "lg";
}> = ({ name, avatarUrl, size = "sm" }) => {
  const [imgError, setImgError] = useState(false);
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "RM";

  if (size === "lg") {
    return (
      <div className="relative mt-4">
        <div className="absolute inset-0 rounded-full bg-[#D4AF37]/20 blur-2xl pointer-events-none" />
        <div className="relative size-24 sm:size-28 rounded-full p-1.5 bg-gradient-to-br from-[#D4AF37] via-[#B5902B] to-[#806015] shadow-xl shrink-0 mx-auto">
          <div className="w-full h-full rounded-full p-1 bg-background overflow-hidden">
            {avatarUrl && !imgError ? (
              <Image
                src={avatarUrl}
                alt={name}
                width={112}
                height={112}
                className="w-full h-full rounded-full object-cover object-center"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#4A0E1B] to-[#2A0810] text-[#D4AF37] font-black text-2xl flex items-center justify-center select-none">
                {initials}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="size-9 rounded-full overflow-hidden shrink-0 border border-[#D4AF37]/40 bg-muted flex items-center justify-center">
      {avatarUrl && !imgError ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={36}
          height={36}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-xs font-black text-primary select-none">{initials}</span>
      )}
    </div>
  );
};

export const CompetitionLeaderboard: React.FC<CompetitionLeaderboardProps> = ({
  leaderboard = [],
  champion = null,
}) => {
  return (
    <section aria-labelledby="leaderboard-heading" className="w-full">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Left Side: Leaderboard Table */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                <Trophy className="size-5 text-[#D4AF37]" />
              </div>
              <h2
                id="leaderboard-heading"
                className="text-2xl sm:text-3xl font-black text-primary tracking-tight"
              >
                Current Leaderboard
              </h2>
            </div>
            <Link
              href="/competitions"
              className="text-sm font-bold text-primary/80 hover:text-primary transition-colors flex items-center gap-1 group"
            >
              <span>Full Rankings</span>
              <ChevronRight className="size-4 text-[#D4AF37] transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {leaderboard.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/60 border-b border-border/80">
                      <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                        Rank
                      </th>
                      <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                        Participant
                      </th>
                      <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-muted-foreground">
                        Department
                      </th>
                      <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-muted-foreground text-right">
                        Points
                      </th>
                      <th className="py-4 px-6 text-xs font-extrabold uppercase tracking-wider text-muted-foreground text-right">
                        Wins
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry) => (
                      <tr
                        key={`${entry.profileId}-${entry.leaderboardRank}`}
                        className="border-b border-border/60 hover:bg-muted/40 transition-colors group"
                      >
                        <td className="py-4 px-6">
                          <div
                            className={`size-8 rounded-full flex items-center justify-center font-black text-sm ${
                              entry.leaderboardRank === 1
                                ? "bg-amber-400 text-amber-950 shadow-md shadow-amber-400/20"
                                : entry.leaderboardRank === 2
                                ? "bg-slate-300 text-slate-800"
                                : entry.leaderboardRank === 3
                                ? "bg-amber-700/20 text-amber-800 dark:text-amber-300 border border-amber-600/30"
                                : "text-muted-foreground bg-muted font-bold"
                            }`}
                          >
                            {entry.leaderboardRank}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <Link
                            href={`/profile/${entry.slug}`}
                            className="flex items-center gap-3.5 group-hover:translate-x-1 transition-transform"
                          >
                            <ParticipantAvatar
                              name={entry.fullName}
                              avatarUrl={entry.avatarUrl}
                              size="sm"
                            />
                            <span className="font-bold text-foreground text-base group-hover:text-primary">
                              {entry.fullName}
                            </span>
                          </Link>
                        </td>

                        <td className="py-4 px-6 text-sm font-semibold text-muted-foreground">
                          {entry.departmentOrInstitution}
                        </td>

                        <td className="py-4 px-6 text-right font-black text-base text-primary">
                          {entry.totalPoints}
                        </td>

                        <td className="py-4 px-6 text-right font-bold text-sm text-muted-foreground">
                          {entry.wins}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card List View */}
              <div className="sm:hidden flex flex-col gap-3">
                {leaderboard.map((entry) => (
                  <Link
                    key={`${entry.profileId}-${entry.leaderboardRank}`}
                    href={`/profile/${entry.slug}`}
                    className="flex items-center justify-between p-4 rounded-2xl border border-border/80 bg-card shadow-xs hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`size-8 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                          entry.leaderboardRank === 1
                            ? "bg-amber-400 text-amber-950 shadow-xs"
                            : entry.leaderboardRank === 2
                            ? "bg-slate-300 text-slate-800"
                            : entry.leaderboardRank === 3
                            ? "bg-amber-700/20 text-amber-800 dark:text-amber-300 border border-amber-600/30"
                            : "text-muted-foreground bg-muted"
                        }`}
                      >
                        {entry.leaderboardRank}
                      </div>

                      <ParticipantAvatar
                        name={entry.fullName}
                        avatarUrl={entry.avatarUrl}
                        size="sm"
                      />

                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground text-sm truncate">
                          {entry.fullName}
                        </h3>
                        <p className="text-xs text-muted-foreground font-medium truncate">
                          {entry.departmentOrInstitution}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 ml-3">
                      <div className="font-black text-primary text-sm">
                        {entry.totalPoints} pts
                      </div>
                      <div className="text-xs text-muted-foreground font-semibold">{entry.wins} wins</div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            /* Leaderboard Empty State */
            <div className="rounded-2xl border border-border/80 bg-card shadow-xs p-10 text-center flex flex-col items-center justify-center min-h-[260px]">
              <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3">
                <Trophy className="size-7" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                No Rankings Published Yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Competition rankings will appear here once official evaluations are finalized and scores are published.
              </p>
            </div>
          )}
        </div>

        {/* Right Side: Winner Showcase / Champion Spotlight */}
        <div className="flex flex-col w-full lg:max-w-sm shrink-0">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-primary tracking-tight">
              Champion Spotlight
            </h2>
          </div>

          <div className="relative rounded-3xl overflow-hidden group border border-[#D4AF37]/40 transition-all shadow-xl flex flex-col h-full min-h-[420px] bg-gradient-to-br from-[#8F0028] via-[#6B001E] to-[#2A0810] text-white">
            <div className="absolute -top-20 -right-20 size-64 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 size-72 rounded-full border border-[#D4AF37]/15 pointer-events-none" />

            <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 text-center relative z-10 space-y-4 my-auto">
              {/* Trophy Badge */}
              <div className="size-14 rounded-2xl bg-[#D4AF37] flex items-center justify-center text-[#2A0810] shadow-lg">
                <Trophy className="size-7" />
              </div>

              {champion ? (
                <>
                  <ParticipantAvatar
                    name={champion.fullName}
                    avatarUrl={champion.avatarUrl}
                    size="lg"
                  />

                  <div>
                    <h3 className="text-2xl font-black text-white leading-tight">
                      {champion.fullName}
                    </h3>
                    <p className="text-[#D4AF37] font-semibold text-sm mt-0.5">
                      {champion.departmentOrInstitution}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-3 text-xs font-extrabold text-[#D4AF37] py-1">
                    <span className="px-3.5 py-1.5 rounded-xl bg-black/30 border border-[#D4AF37]/30">
                      {champion.totalPoints} Points
                    </span>
                    <span className="px-3.5 py-1.5 rounded-xl bg-black/30 border border-[#D4AF37]/30">
                      {champion.wins} Wins
                    </span>
                  </div>

                  <Link
                    href={`/profile/${champion.slug}`}
                    className="px-6 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white hover:bg-[#D4AF37] hover:text-[#2A0810] hover:border-[#D4AF37] text-sm font-bold transition-all duration-300 shadow-sm"
                  >
                    View Profile
                  </Link>
                </>
              ) : (
                /* Champion Spotlight Empty State */
                <div className="py-4 flex flex-col items-center space-y-3">
                  <div className="size-12 rounded-full bg-white/10 flex items-center justify-center text-[#D4AF37]">
                    <Award className="size-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">No Champion Yet</h3>
                  <p className="text-white/70 font-medium text-sm max-w-[240px] leading-relaxed">
                    Published competition results and leaderboard scores will determine our top performer.
                  </p>
                  <span className="px-5 py-2 rounded-xl bg-white/10 border border-white/15 text-white/60 text-xs font-bold uppercase tracking-wider">
                    Awaiting Results
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
