import React from "react";
import { Award, Trophy, MapPin, Calendar, Building2, Star } from "lucide-react";
import { AchievementItem } from "../types/achievement";

export interface AchievementRecognitionProps {
  achievement: AchievementItem;
}

export const AchievementRecognition = ({ achievement }: AchievementRecognitionProps) => {
  const dateObj = new Date(achievement.achievedAt);
  const isValidDate = !isNaN(dateObj.getTime());
  const formattedDate = isValidDate
    ? dateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  const hasAnyRecognitionData =
    Boolean(achievement.awardName) ||
    Boolean(achievement.recognition) ||
    Boolean(achievement.rank) ||
    Boolean(achievement.position) ||
    Boolean(achievement.level) ||
    Boolean(achievement.institutionName) ||
    Boolean(achievement.eventName) ||
    Boolean(achievement.location) ||
    Boolean(formattedDate);

  if (!hasAnyRecognitionData) {
    return null;
  }

  return (
    <div className="rm-glass-card rounded-[2rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] w-full">
      <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/10">
        <Trophy className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />
        <h2 className="text-xl font-bold rm-heading-primary text-white">Recognition</h2>
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {achievement.awardName && (
          <div className="flex flex-col">
            <dt className="text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" aria-hidden="true" />
              Award Name
            </dt>
            <dd className="text-base font-semibold text-white">{achievement.awardName}</dd>
          </div>
        )}

        {achievement.recognition && (
          <div className="flex flex-col">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
              Recognition Details
            </dt>
            <dd className="text-base font-medium text-white/90">{achievement.recognition}</dd>
          </div>
        )}

        {achievement.rank && (
          <div className="flex flex-col">
            <dt className="text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] mb-1">
              Rank
            </dt>
            <dd className="text-base font-semibold text-white">{achievement.rank}</dd>
          </div>
        )}

        {achievement.position && (
          <div className="flex flex-col">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
              Position
            </dt>
            <dd className="text-base font-medium text-white/90">{achievement.position}</dd>
          </div>
        )}

        {achievement.level && (
          <div className="flex flex-col">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[var(--color-rm-gold)]" aria-hidden="true" />
              Achievement Level
            </dt>
            <dd className="text-base font-medium text-white/90">{achievement.level}</dd>
          </div>
        )}

        {achievement.institutionName && (
          <div className="flex flex-col">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-white/60" aria-hidden="true" />
              Institution
            </dt>
            <dd className="text-base font-medium text-white/90">{achievement.institutionName}</dd>
          </div>
        )}

        {achievement.eventName && (
          <div className="flex flex-col">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1">
              Event
            </dt>
            <dd className="text-base font-medium text-white/90">{achievement.eventName}</dd>
          </div>
        )}

        {achievement.location && (
          <div className="flex flex-col">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-white/60" aria-hidden="true" />
              Location
            </dt>
            <dd className="text-base font-medium text-white/90">{achievement.location}</dd>
          </div>
        )}

        {formattedDate && (
          <div className="flex flex-col">
            <dt className="text-xs font-bold uppercase tracking-wider text-white/60 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-white/60" aria-hidden="true" />
              Achievement Date
            </dt>
            <dd className="text-base font-medium text-white/90">{formattedDate}</dd>
          </div>
        )}
      </dl>
    </div>
  );
};
