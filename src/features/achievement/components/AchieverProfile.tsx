import React from "react";
import Link from "next/link";
import { User, ArrowRight, Building2, Users } from "lucide-react";
import { AchievementItem } from "../types/achievement";

export interface AchieverProfileProps {
  achievement: AchievementItem;
}

export const AchieverProfile = ({ achievement }: AchieverProfileProps) => {
  if (!achievement.achieverName) {
    return null;
  }

  const getHeading = () => {
    switch (achievement.achieverType) {
      case "Department":
        return "About the Department";
      case "Hostel":
        return "About the Hostel";
      case "Organization":
        return "About the Organization";
      case "Team":
        return "About the Team";
      default:
        return "Meet the Achiever";
    }
  };

  const getIcon = () => {
    if (achievement.achieverType === "Team" || achievement.achieverType === "Organization") {
      return <Users className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />;
    }
    if (achievement.achieverType === "Department" || achievement.achieverType === "Hostel") {
      return <Building2 className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />;
    }
    return <User className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />;
  };

  return (
    <section className="rm-glass-card rounded-[2rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] w-full">
      <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/10">
        {getIcon()}
        <h2 className="text-xl font-bold rm-heading-primary text-white">{getHeading()}</h2>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-widest text-[var(--color-rm-gold)] uppercase bg-[var(--color-rm-gold)]/10 border border-[var(--color-rm-gold)]/20 mb-2">
            {achievement.achieverType}
          </span>
          <h3 className="text-2xl font-bold rm-heading-primary text-white">
            {achievement.achieverName}
          </h3>

          {(achievement.departmentName || achievement.hostelName || achievement.organizationName) && (
            <p className="text-sm font-medium text-white/70 mt-1">
              {[achievement.departmentName, achievement.hostelName, achievement.organizationName]
                .filter(Boolean)
                .join(" | ")}
            </p>
          )}
        </div>

        {achievement.achieverProfileSlug && (
          <Link
            href={`/profile/${achievement.achieverProfileSlug}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-rm-gold)]/15 hover:bg-[var(--color-rm-gold)]/25 text-[var(--color-rm-gold)] border border-[var(--color-rm-gold)]/30 rounded-xl font-bold text-sm transition-all whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            View Full Profile
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </section>
  );
};
