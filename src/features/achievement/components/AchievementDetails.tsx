import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Trophy,
  Star,
  CheckCircle,
  Calendar,
  Award,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { AchievementItem } from "../types/achievement";
import { AchievementRecognition } from "./AchievementRecognition";
import { AchieverProfile } from "./AchieverProfile";
import { AchievementCommunity } from "./AchievementCommunity";
import { AchievementHighlights } from "./AchievementHighlights";
import { AchievementJourney } from "./AchievementJourney";
import { AchievementGallery } from "./AchievementGallery";
import { AchievementShare } from "./AchievementShare";
import { RelatedAchievements } from "./RelatedAchievements";

export interface AchievementDetailsProps {
  achievement: AchievementItem;
  prevAchievement?: AchievementItem;
  nextAchievement?: AchievementItem;
}

export const AchievementDetails = ({
  achievement,
  prevAchievement,
  nextAchievement,
}: AchievementDetailsProps) => {
  const dateObj = new Date(achievement.achievedAt);
  const isValidDate = !isNaN(dateObj.getTime());
  const displayDate = isValidDate
    ? dateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  // Split description into paragraphs if multiple lines exist
  const paragraphs = (achievement.fullDescription || achievement.shortDescription)
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <article className="w-full">
      {/* Top Back Navigation & Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-8 flex flex-col gap-4">
        <Link
          href="/achievements"
          className="inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/70 hover:text-[var(--color-rm-gold)] transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] rounded-lg py-1"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back to All Achievements
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-xs font-bold tracking-widest uppercase text-white/50">
          <Link
            href="/"
            className="hover:text-[var(--color-rm-gold)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] rounded"
          >
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href="/achievements"
            className="hover:text-[var(--color-rm-gold)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] rounded"
          >
            Achievements
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[var(--color-rm-gold)] break-words line-clamp-1 max-w-[280px] sm:max-w-md">
            {achievement.title}
          </span>
        </div>
      </nav>

      {/* Compact Premium Hero Section */}
      <header className="mb-12">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest text-[#12070B] uppercase bg-[var(--color-rm-gold)]">
            {achievement.category}
          </span>
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest text-[var(--color-rm-gold)] uppercase bg-white/5 border border-white/10">
            {achievement.level}
          </span>
          {achievement.featured && (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest text-[var(--color-rm-gold)] uppercase bg-[var(--color-rm-gold)]/20 border border-[var(--color-rm-gold)]/40">
              <Star className="w-3.5 h-3.5" aria-hidden="true" />
              Featured
            </span>
          )}
          {achievement.verified && (
            <span
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-widest text-green-400 uppercase bg-green-400/10 border border-green-400/20"
              aria-label="Verified Achievement"
            >
              <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
              Verified
            </span>
          )}
        </div>

        <h1 className="text-[clamp(2rem,4vw,3.5rem)] font-extrabold rm-heading-primary leading-tight tracking-tight text-white mb-6 text-balance">
          {achievement.title}
        </h1>

        <p className="text-lg sm:text-xl rm-text-body leading-relaxed font-medium text-white/80 max-w-3xl mb-8">
          {achievement.shortDescription}
        </p>

        {/* Hero Quick Metadata */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-[var(--color-rm-glass-border)] text-sm font-medium text-white/70">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)]">
              {achievement.achieverType}:
            </span>
            <span className="font-bold text-white">{achievement.achieverName}</span>
          </div>

          {(achievement.departmentName || achievement.hostelName || achievement.organizationName) && (
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[var(--color-rm-gold)]" aria-hidden="true" />
              <span>
                {[
                  achievement.departmentName,
                  achievement.hostelName,
                  achievement.organizationName,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}

          {achievement.awardName && (
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--color-rm-gold)]" aria-hidden="true" />
              <span>{achievement.awardName}</span>
            </div>
          )}

          {displayDate && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[var(--color-rm-gold)]" aria-hidden="true" />
              <time dateTime={achievement.achievedAt}>{displayDate}</time>
            </div>
          )}
        </div>
      </header>

      {/* Achievement Cover Presentation (Balanced Two-Column Editorial Layout) */}
      {achievement.coverImage ? (
        <section className="mb-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 relative aspect-[16/10] sm:aspect-[16/9] lg:aspect-auto rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 shadow-2xl">
            <Image
              src={achievement.coverImage}
              alt={achievement.imageAlt || achievement.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
              priority
            />
          </div>

          <div className="lg:col-span-5 flex flex-col justify-between rm-glass-card rounded-[2rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)]">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-rm-gold)] block mb-3">
                Achievement Spotlight
              </span>
              <h2 className="text-2xl font-bold rm-heading-primary text-white mb-4">
                {achievement.title}
              </h2>
              <p className="text-base text-white/80 font-medium leading-relaxed mb-6">
                {achievement.shortDescription}
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Category</span>
                <span className="font-bold text-white">{achievement.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Level</span>
                <span className="font-bold text-white">{achievement.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Achieved By</span>
                <span className="font-bold text-[var(--color-rm-gold)]">
                  {achievement.achieverName}
                </span>
              </div>
              {displayDate && (
                <div className="flex justify-between">
                  <span className="text-white/60">Date</span>
                  <span className="font-medium text-white">{displayDate}</span>
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}

      {/* Main Content Sections */}
      <div className="space-y-12">
        {/* About This Achievement */}
        <section className="rm-glass-card rounded-[2rem] p-6 sm:p-10 border border-[var(--color-rm-glass-border)] w-full">
          <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-white/10">
            <Trophy className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />
            <h2 className="text-2xl font-bold rm-heading-primary text-white">
              About This Achievement
            </h2>
          </div>

          <div className="max-w-3xl space-y-6 text-base sm:text-lg rm-text-body leading-relaxed font-medium text-white/85">
            {paragraphs.map((para, idx) => (
              <p key={idx}>{para}</p>
            ))}
          </div>
        </section>

        {/* Recognition Summary Panel */}
        <AchievementRecognition achievement={achievement} />

        {/* Verification Information Panel (Only when verified) */}
        {achievement.verified && (
          <section className="rm-glass-card rounded-[2rem] p-6 sm:p-8 border border-green-400/30 bg-green-950/20 w-full">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-bold text-white">Verified Achievement</h3>
                <p className="text-sm font-medium text-white/70">
                  This achievement record has been verified as part of the official Ravenshaw Moments archive.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Achiever Profile */}
        <AchieverProfile achievement={achievement} />

        {/* Community Connection */}
        <AchievementCommunity achievement={achievement} />

        {/* Optional Highlights */}
        <AchievementHighlights achievement={achievement} />

        {/* Optional Journey */}
        <AchievementJourney achievement={achievement} />

        {/* Optional Gallery */}
        <AchievementGallery achievement={achievement} />

        {/* Celebrate and Share */}
        <AchievementShare title={achievement.title} slug={achievement.slug} />

        {/* Previous and Next Achievement Navigation */}
        {(prevAchievement || nextAchievement) && (
          <nav
            aria-label="Previous and Next Achievement"
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-8 border-t border-[var(--color-rm-glass-border)]"
          >
            {prevAchievement ? (
              <Link
                href={`/achievements/${prevAchievement.slug}`}
                className="group rm-glass-card rounded-2xl p-6 border border-[var(--color-rm-glass-border)] hover:border-[var(--color-rm-gold)]/50 transition-all flex flex-col justify-between"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-rm-gold)] mb-2">
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Previous Achievement
                </span>
                <span className="text-base font-bold rm-heading-primary text-white line-clamp-2">
                  {prevAchievement.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextAchievement ? (
              <Link
                href={`/achievements/${nextAchievement.slug}`}
                className="group rm-glass-card rounded-2xl p-6 border border-[var(--color-rm-glass-border)] hover:border-[var(--color-rm-gold)]/50 transition-all flex flex-col justify-between text-right sm:items-end"
              >
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--color-rm-gold)] mb-2">
                  Next Achievement
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="text-base font-bold rm-heading-primary text-white line-clamp-2">
                  {nextAchievement.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}

        {/* Related Achievements */}
        <RelatedAchievements currentAchievement={achievement} />

        {/* Bottom Back Navigation */}
        <div className="pt-8">
          <Link
            href="/achievements"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back to All Achievements
          </Link>
        </div>
      </div>
    </article>
  );
};
