import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Star, CheckCircle, Calendar, Award } from "lucide-react";
import { AchievementItem } from "../types/achievement";

export interface AchievementCardProps {
  achievement: AchievementItem;
}

export const AchievementCard = ({ achievement }: AchievementCardProps) => {
  const dateObj = new Date(achievement.achievedAt);
  const isValidDate = !isNaN(dateObj.getTime());
  const displayDate = isValidDate ? dateObj.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  }) : null;

  return (
    <Link 
      href={`/achievements/${achievement.slug}`}
      className="group flex flex-col h-full rm-glass-card rounded-2xl overflow-hidden interactive-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-rm-bg-deep)] transition-all duration-300 [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1 [@media(hover:hover)_and_(pointer:fine)]:hover:border-[var(--color-maroon)]/50 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_12px_30px_rgba(176,24,70,0.15)]"
    >
      {achievement.coverImage && (
        <div className="relative w-full aspect-[16/9] overflow-hidden bg-black/5 border-b border-black/10">
          <Image
            src={achievement.coverImage}
            alt={achievement.imageAlt || achievement.title}
            fill
            className="object-cover transition-transform duration-700 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      
      {/* Subtle Top Accent */}
      {!achievement.coverImage && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-rm-accent)] to-[var(--color-maroon)] opacity-40 transition-opacity duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:opacity-100" />
      )}
      
      <div className="flex flex-col flex-grow p-6 sm:p-8">
        <div className="flex items-start gap-2 flex-wrap mb-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] sm:text-[0.7rem] font-bold tracking-widest text-[var(--color-maroon)] uppercase bg-[var(--color-maroon)]/10 border border-[var(--color-maroon)]/20">
            {achievement.category}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[0.65rem] sm:text-[0.7rem] font-bold tracking-widest text-black/70 uppercase bg-black/5 border border-black/10">
            {achievement.level}
          </span>
          {achievement.verified && (
            <span 
              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.65rem] sm:text-[0.7rem] font-bold tracking-widest text-green-400 uppercase bg-green-400/10 border border-green-400/20"
              aria-label="Verified Achievement"
            >
              <CheckCircle className="w-3 h-3" aria-hidden="true" />
              Verified
            </span>
          )}
          {achievement.featured && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.65rem] sm:text-[0.7rem] font-bold tracking-widest text-[var(--color-maroon)] uppercase bg-[var(--color-maroon)]/20 border border-[var(--color-maroon)]/40">
              <Star className="w-3 h-3" aria-hidden="true" />
              Featured
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold rm-heading-primary mb-3 leading-tight tracking-tight transition-colors duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-[var(--color-maroon)] text-white">
          {achievement.title}
        </h3>
        
        <p className="text-[0.95rem] rm-text-body leading-relaxed font-medium mb-6 flex-grow text-black/80">
          {achievement.shortDescription}
        </p>

        <div className="flex flex-col gap-3 mt-auto pt-5 border-t border-[var(--color-rm-glass-border)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[0.65rem] sm:text-[0.7rem] font-bold text-[var(--color-maroon)] tracking-wider uppercase mb-0.5">
                {achievement.achieverType}
              </p>
              <p className="text-[0.95rem] font-bold rm-heading-primary tracking-tight">
                {achievement.achieverName}
              </p>
              {(achievement.departmentName || achievement.hostelName || achievement.organizationName) && (
                <p className="text-xs font-medium text-black/60 mt-0.5">
                  {achievement.departmentName || achievement.hostelName || achievement.organizationName}
                </p>
              )}
            </div>
            <div className="w-8 h-8 rounded-full bg-black/5 border border-[var(--color-rm-glass-border)] flex items-center justify-center shrink-0 transition-colors duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:bg-[var(--color-maroon)]/20 [@media(hover:hover)_and_(pointer:fine)]:group-hover:border-[var(--color-maroon)]/40">
              <ArrowUpRight className="w-4 h-4 text-[var(--color-maroon)] transition-all duration-300 [@media(hover:hover)_and_(pointer:fine)]:group-hover:text-[var(--color-maroon-dark)]" strokeWidth={2} aria-hidden="true" />
            </div>
          </div>

          {(achievement.awardName || displayDate) && (
            <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2 text-xs font-medium text-black/60">
              {achievement.awardName && (
                <div className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-[var(--color-maroon)]" aria-hidden="true" />
                  <span>{achievement.awardName}</span>
                </div>
              )}
              {displayDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[var(--color-maroon)]" aria-hidden="true" />
                  <span>{displayDate}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};
