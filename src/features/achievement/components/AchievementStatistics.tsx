import React from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Trophy, Star, Tags, Users } from "lucide-react";
import { AchievementItem } from "../types/achievement";

export interface AchievementStatisticsProps {
  achievements: AchievementItem[];
}

export const AchievementStatistics = ({ achievements }: AchievementStatisticsProps) => {
  const revealRef = useScrollReveal();

  if (!achievements || achievements.length === 0) return null;

  const totalAchievements = achievements.length;
  const featuredCount = achievements.filter(a => a.featured).length;
  
  // Calculate unique categories
  const categories = new Set(achievements.map(a => a.category));
  const categoryCount = categories.size;

  // Calculate unique communities (departments, hostels, organizations, teams)
  const communities = new Set();
  achievements.forEach(a => {
    if (a.departmentName) communities.add(a.departmentName);
    if (a.hostelName) communities.add(a.hostelName);
    if (a.organizationName) communities.add(a.organizationName);
    if (a.teamName) communities.add(a.teamName);
  });
  const communityCount = communities.size;

  return (
    <div 
      className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 rm-reveal" 
      ref={revealRef as React.RefObject<HTMLDivElement>}
    >
      <div className="rm-glass-card rounded-2xl p-6 border border-[var(--color-rm-glass-border)] flex flex-col items-center justify-center text-center">
        <div className="w-10 h-10 rounded-full bg-[var(--color-maroon)]/10 flex items-center justify-center mb-3">
          <Trophy className="w-5 h-5 text-[var(--color-maroon)]" />
        </div>
        <div className="text-3xl sm:text-4xl font-extrabold rm-heading-primary mb-1">
          {totalAchievements}
        </div>
        <div className="text-xs font-bold tracking-widest text-[var(--color-maroon)] uppercase">
          Preserved
        </div>
      </div>

      {featuredCount > 0 && (
        <div className="rm-glass-card rounded-2xl p-6 border border-[var(--color-rm-glass-border)] flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[var(--color-maroon)]/10 flex items-center justify-center mb-3">
            <Star className="w-5 h-5 text-[var(--color-maroon)]" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold rm-heading-primary mb-1">
            {featuredCount}
          </div>
          <div className="text-xs font-bold tracking-widest text-[var(--color-maroon)] uppercase">
            Featured
          </div>
        </div>
      )}

      {categoryCount > 0 && (
        <div className="rm-glass-card rounded-2xl p-6 border border-[var(--color-rm-glass-border)] flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[var(--color-maroon)]/10 flex items-center justify-center mb-3">
            <Tags className="w-5 h-5 text-[var(--color-maroon)]" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold rm-heading-primary mb-1">
            {categoryCount}
          </div>
          <div className="text-xs font-bold tracking-widest text-[var(--color-maroon)] uppercase">
            Categories
          </div>
        </div>
      )}

      {communityCount > 0 && (
        <div className="rm-glass-card rounded-2xl p-6 border border-[var(--color-rm-glass-border)] flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-[var(--color-maroon)]/10 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-[var(--color-maroon)]" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold rm-heading-primary mb-1">
            {communityCount}
          </div>
          <div className="text-xs font-bold tracking-widest text-[var(--color-maroon)] uppercase">
            Communities
          </div>
        </div>
      )}
    </div>
  );
};
