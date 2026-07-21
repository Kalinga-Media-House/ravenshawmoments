import React from "react";
import Link from "next/link";
import { Users, Building2, Home as HomeIcon, ArrowUpRight } from "lucide-react";
import { AchievementItem } from "../types/achievement";

export interface AchievementCommunityProps {
  achievement: AchievementItem;
}

export const AchievementCommunity = ({ achievement }: AchievementCommunityProps) => {
  const hasCommunity =
    Boolean(achievement.departmentName) ||
    Boolean(achievement.hostelName) ||
    Boolean(achievement.organizationName) ||
    Boolean(achievement.teamName);

  if (!hasCommunity) {
    return null;
  }

  return (
    <section className="rm-glass-card rounded-[2rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] w-full">
      <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/10">
        <Users className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />
        <h2 className="text-xl font-bold rm-heading-primary text-white">
          Part of the Ravenshaw Community
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievement.departmentName && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] block mb-1 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
                Department
              </span>
              <p className="text-base font-semibold text-white">{achievement.departmentName}</p>
            </div>
            {achievement.departmentSlug ? (
              <Link
                href={`/departments/${achievement.departmentSlug}`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-rm-gold)] hover:underline"
              >
                Explore Department
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        )}

        {achievement.hostelName && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] block mb-1 flex items-center gap-1.5">
                <HomeIcon className="w-3.5 h-3.5" aria-hidden="true" />
                Hostel
              </span>
              <p className="text-base font-semibold text-white">{achievement.hostelName}</p>
            </div>
            {achievement.hostelSlug ? (
              <Link
                href={`/hostels/${achievement.hostelSlug}`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-rm-gold)] hover:underline"
              >
                Explore Hostel
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        )}

        {achievement.organizationName && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] block mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                Organization
              </span>
              <p className="text-base font-semibold text-white">{achievement.organizationName}</p>
            </div>
            {achievement.organizationSlug ? (
              <Link
                href={`/organizations/${achievement.organizationSlug}`}
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[var(--color-rm-gold)] hover:underline"
              >
                Explore Organization
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            ) : null}
          </div>
        )}

        {achievement.teamName && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] block mb-1 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" aria-hidden="true" />
                Team
              </span>
              <p className="text-base font-semibold text-white">{achievement.teamName}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
