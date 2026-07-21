import React from "react";
import Image from "next/image";
import { Trophy, Award, Medal, Users } from "lucide-react";
import { PortalCategoryLeaderboardEntry } from "../../types/categoryPortal";

interface CategoryLeaderboardSectionProps {
  entries: PortalCategoryLeaderboardEntry[];
  categoryName: string;
}

export function CategoryLeaderboardSection({
  entries,
  categoryName
}: CategoryLeaderboardSectionProps) {
  if (entries.length === 0) {
    return (
      <div className="rounded-3xl border border-[#8A1735]/30 bg-[#2B070E]/40 p-8 text-center text-[#FFF9F0]">
        <Users className="mx-auto mb-3 h-10 w-10 text-[#D4AF37]/60" />
        <h3 className="text-xl font-bold">Category Leaderboard Empty</h3>
        <p className="mt-2 text-sm text-[#FFF9F0]/70 max-w-md mx-auto">
          No participant points have been recorded in {categoryName} yet. Points are awarded automatically when competition results are published.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#8A1735]/40 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FFF9F0] flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#D4AF37]" />
            {categoryName} Leaderboard
          </h2>
          <p className="text-sm text-[#FFF9F0]/70 mt-1">
            Authoritative rankings derived from published judging results in this category
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#8A1735]/40 bg-[#2B070E]/80 shadow-xl">
        <table className="w-full text-left border-collapse text-sm text-[#FFF9F0]">
          <thead>
            <tr className="border-b border-[#8A1735]/40 bg-[#4A0E17]/60 text-xs uppercase tracking-wider text-[#D4AF37]">
              <th scope="col" className="px-4 py-3.5 font-bold">Rank</th>
              <th scope="col" className="px-4 py-3.5 font-bold">Participant</th>
              <th scope="col" className="px-4 py-3.5 font-bold">Affiliation</th>
              <th scope="col" className="px-4 py-3.5 font-bold text-center">1st</th>
              <th scope="col" className="px-4 py-3.5 font-bold text-center">2nd</th>
              <th scope="col" className="px-4 py-3.5 font-bold text-center">3rd</th>
              <th scope="col" className="px-4 py-3.5 font-bold text-center">Podium</th>
              <th scope="col" className="px-4 py-3.5 font-bold text-right">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#8A1735]/20">
            {entries.map((entry) => {
              const isTopThree = entry.rank <= 3;
              return (
                <tr
                  key={`${entry.profileId}-${entry.rank}`}
                  className="hover:bg-[#4A0E17]/40 transition-colors"
                >
                  <td className="px-4 py-4 font-bold">
                    <span
                      className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-extrabold ${
                        entry.rank === 1
                          ? "bg-amber-500 text-black shadow"
                          : entry.rank === 2
                          ? "bg-slate-300 text-black shadow"
                          : entry.rank === 3
                          ? "bg-amber-700 text-white shadow"
                          : "text-[#FFF9F0]/70"
                      }`}
                    >
                      {entry.rank}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative h-9 w-9 overflow-hidden rounded-full border border-[#D4AF37]/40 bg-[#4A0E17] shrink-0">
                        {entry.avatarUrl ? (
                          <Image
                            src={entry.avatarUrl}
                            alt={entry.fullName}
                            fill
                            className="object-cover"
                            sizes="36px"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-bold text-[#D4AF37]">
                            {entry.fullName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#FFF9F0] truncate">
                          {entry.fullName}
                        </div>
                        <div className="text-xs text-[#FFF9F0]/60">
                          {entry.profileType}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs text-[#FFF9F0]/80 truncate max-w-[180px]">
                    {entry.departmentOrInstitution}
                  </td>
                  <td className="px-4 py-4 text-center font-semibold text-amber-300">
                    {entry.wins}
                  </td>
                  <td className="px-4 py-4 text-center font-semibold text-slate-300">
                    {entry.secondPlace}
                  </td>
                  <td className="px-4 py-4 text-center font-semibold text-amber-600">
                    {entry.thirdPlace}
                  </td>
                  <td className="px-4 py-4 text-center font-bold text-[#FFF9F0]">
                    {entry.podiumFinishes}
                  </td>
                  <td className="px-4 py-4 text-right font-extrabold text-base text-[#D4AF37]">
                    {entry.totalPoints}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
