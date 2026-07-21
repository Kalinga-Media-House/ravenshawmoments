import React from "react";
import { Sparkles } from "lucide-react";
import { AchievementItem } from "../types/achievement";
import { ACHIEVEMENT_ITEMS } from "../data/achievements";
import { AchievementCard } from "./AchievementCard";

export interface RelatedAchievementsProps {
  currentAchievement: AchievementItem;
}

export const RelatedAchievements = ({ currentAchievement }: RelatedAchievementsProps) => {
  const allOtherAchievements = ACHIEVEMENT_ITEMS.filter(
    (item) => item.slug !== currentAchievement.slug
  );

  if (allOtherAchievements.length === 0) {
    return null;
  }

  // Score related achievements based on similarity prioritization
  const scoredAchievements = allOtherAchievements.map((item) => {
    let score = 0;
    if (item.category === currentAchievement.category) score += 40;
    if (item.achieverType === currentAchievement.achieverType) score += 25;
    if (item.level === currentAchievement.level) score += 15;
    if (item.departmentName && item.departmentName === currentAchievement.departmentName) score += 20;
    if (item.hostelName && item.hostelName === currentAchievement.hostelName) score += 20;
    if (item.organizationName && item.organizationName === currentAchievement.organizationName) score += 20;
    if (item.teamName && item.teamName === currentAchievement.teamName) score += 20;

    const currentTags = currentAchievement.tags || [];
    const itemTags = item.tags || [];
    const sharedTagsCount = itemTags.filter((t) => currentTags.includes(t)).length;
    score += sharedTagsCount * 5;

    return { item, score };
  });

  scoredAchievements.sort((a, b) => b.score - a.score);

  const relatedList = scoredAchievements.slice(0, 3).map((entry) => entry.item);

  if (relatedList.length === 0) {
    return null;
  }

  return (
    <section className="w-full mt-16 pt-12 border-t border-[var(--color-rm-glass-border)]">
      <div className="flex items-center gap-2.5 mb-8">
        <Sparkles className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />
        <h2 className="text-2xl font-bold rm-heading-primary text-white">
          More Stories of Excellence
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {relatedList.map((item) => (
          <div key={item.id} className="h-full">
            <AchievementCard achievement={item} />
          </div>
        ))}
      </div>
    </section>
  );
};
