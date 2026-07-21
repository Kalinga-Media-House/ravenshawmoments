import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Star, Calendar, Award } from "lucide-react";
import { AchievementItem } from "../types/achievement";

export interface FeaturedAchievementProps {
  achievement: AchievementItem;
}

export const FeaturedAchievement = ({ achievement }: FeaturedAchievementProps) => {
  const dateObj = new Date(achievement.achievedAt);
  const isValidDate = !isNaN(dateObj.getTime());
  const displayDate = isValidDate ? dateObj.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric"
  }) : null;

  return (
    <div className="w-full flex flex-col h-full rm-reveal mb-12">
      <Link 
        href={`/achievements/${achievement.slug}`}
        className="group flex flex-col lg:flex-row relative h-full rm-glass-card rounded-3xl overflow-hidden interactive-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-rm-bg-deep)] transition-all duration-500 [@media(hover:hover)_and_(pointer:fine)]:hover:shadow-[0_24px_48px_-12px_rgba(176,24,70,0.15)] [@media(hover:hover)_and_(pointer:fine)]:hover:-translate-y-1"
      >
        {/* Image Section (Left on Desktop, Top on Mobile) */}
        {achievement.coverImage && (
          <div className="relative w-full lg:w-2/5 aspect-video lg:aspect-auto overflow-hidden bg-black/5 border-b lg:border-b-0 lg:border-r border-border shrink-0">
            <Image
              src={achievement.coverImage}
              alt={achievement.imageAlt || achievement.title}
              fill
              className="object-cover transition-transform duration-700 [@media(hover:hover)_and_(pointer:fine)]:group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 40vw"
              priority
            />
          </div>
        )}

        {/* Content Section */}
        <div className="relative z-10 flex flex-col flex-grow p-8 sm:p-10 lg:p-12">
          
          {/* Subtle Maroon Accent Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-maroon)]/10 via-transparent to-[var(--color-maroon)]/5 transition-colors duration-700 pointer-events-none" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-[var(--color-maroon)]/10 to-transparent rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-3 mb-8 sm:mb-10 relative z-10">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-[0.75rem] font-bold tracking-widest text-white uppercase bg-[var(--color-maroon)] shadow-[0_0_15px_rgba(143,0,40,0.4)]">
              <Star className="w-3.5 h-3.5 mr-1.5 text-white" aria-hidden="true" />
              Featured
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[0.75rem] font-bold tracking-widest text-[var(--color-maroon)] uppercase bg-black/5 border border-border">
              {achievement.category}
            </span>
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[0.75rem] font-bold tracking-widest text-muted-foreground uppercase bg-black/5 border border-border">
              {achievement.level}
            </span>
            {achievement.verified && (
              <span 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.75rem] font-bold tracking-widest text-green-600 uppercase bg-green-500/10 border border-green-500/20"
                aria-label="Verified Achievement"
              >
                <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                Verified
              </span>
            )}
          </div>

          <div className="flex flex-col flex-grow justify-center mb-8 sm:mb-10 relative z-10">
            <h3 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-extrabold rm-heading-primary mb-6 tracking-tight leading-tight drop-shadow-sm text-balance max-w-3xl">
              {achievement.title}
            </h3>
            <p className="text-[clamp(1rem,1.5vw,1.2rem)] rm-text-body leading-relaxed font-medium max-w-2xl text-muted-foreground">
              {achievement.fullDescription || achievement.shortDescription}
            </p>
          </div>

          {/* Bottom Info & Action */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mt-auto pt-8 border-t border-[var(--color-rm-glass-border)] relative z-10">
            <div>
              <p className="text-[0.8rem] font-bold text-[var(--color-maroon)] tracking-wider uppercase mb-1">
                {achievement.achieverType}
              </p>
              <p className="text-xl sm:text-2xl font-bold rm-heading-primary tracking-tight">
                {achievement.achieverName}
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm font-medium text-muted-foreground">
                {(achievement.departmentName || achievement.hostelName || achievement.organizationName) && (
                  <div>{achievement.departmentName || achievement.hostelName || achievement.organizationName}</div>
                )}
                {achievement.awardName && (
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />
                    <span>{achievement.awardName}</span>
                  </div>
                )}
                {displayDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />
                    <span>{displayDate}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center text-[var(--color-maroon)] font-bold tracking-wide transition-colors group-hover:text-[var(--color-maroon-dark)] whitespace-nowrap">
              Explore Achievement
              <ArrowRight className="w-5 h-5 ml-2.5 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] [@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-2" strokeWidth={2.5} aria-hidden="true" />
            </div>
          </div>

        </div>
      </Link>
    </div>
  );
};
