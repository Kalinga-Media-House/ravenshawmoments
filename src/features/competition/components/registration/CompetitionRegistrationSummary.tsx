"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Award,
  ExternalLink,
  Building2,
} from "lucide-react";
import { CompetitionItem } from "../../types/competition";

export interface CompetitionRegistrationSummaryProps {
  competition: CompetitionItem;
}

export const CompetitionRegistrationSummary: React.FC<
  CompetitionRegistrationSummaryProps
> = ({ competition }) => {
  const formattedStartDate = new Date(competition.startDate).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const formattedDeadline = competition.registrationDeadline
    ? new Date(competition.registrationDeadline).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const isFree = !competition.registrationFee || competition.registrationFee <= 0;

  return (
    <aside
      aria-label="Competition summary"
      className="rounded-3xl p-6 sm:p-7 space-y-6"
      style={{
        background: 'linear-gradient(135deg, rgba(50, 0, 13, 0.6) 0%, rgba(80, 6, 25, 0.8) 50%, rgba(105, 11, 39, 0.7) 100%)',
        border: '1px solid rgba(228, 181, 54, 0.28)'
      }}
    >
      {/* Cover image thumbnail */}
      {competition.coverImage && (
        <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black">
          <Image
            src={competition.coverImage}
            alt={competition.imageAlt || competition.title}
            fill
            sizes="(max-width: 768px) 100vw, 35vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span 
              className="px-2.5 py-1 rounded-full text-[10px] font-extrabold"
              style={{ background: 'rgba(50, 0, 13, 0.9)', border: '1px solid rgba(228, 181, 54, 0.40)', color: '#E4B536' }}
            >
              {competition.level} Level
            </span>
            <span className="px-2.5 py-1 rounded-full bg-black/80 border border-white/20 text-[10px] font-bold text-white">
              {competition.participationMode}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <span className="text-xs font-bold text-[var(--color-rm-gold)] uppercase tracking-wider block">
          Competition Summary
        </span>
        <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
          {competition.title}
        </h2>
        <p className="text-xs sm:text-sm text-white/75 line-clamp-2">
          {competition.shortDescription}
        </p>
      </div>

      <dl className="space-y-3 text-xs sm:text-sm border-t border-white/10 pt-4">
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10">
          <dt className="text-white/60 flex items-center gap-1.5 font-semibold">
            <Building2 className="w-3.5 h-3.5 text-[var(--color-rm-gold)]" />
            <span>Organizer</span>
          </dt>
          <dd className="font-extrabold text-white text-right truncate">
            {competition.organizerName}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10">
          <dt className="text-white/60 flex items-center gap-1.5 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-[var(--color-rm-gold)]" />
            <span>Date</span>
          </dt>
          <dd className="font-extrabold text-white">{formattedStartDate}</dd>
        </div>

        <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10">
          <dt className="text-white/60 flex items-center gap-1.5 font-semibold">
            <MapPin className="w-3.5 h-3.5 text-[var(--color-rm-gold)]" />
            <span>Venue / Mode</span>
          </dt>
          <dd className="font-extrabold text-white text-right truncate">
            {competition.venue} ({competition.mode})
          </dd>
        </div>

        {formattedDeadline && (
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10">
            <dt className="text-white/60 flex items-center gap-1.5 font-semibold">
              <Clock className="w-3.5 h-3.5 text-[var(--color-rm-gold)]" />
              <span>Deadline</span>
            </dt>
            <dd className="font-extrabold text-[var(--color-rm-gold)]">
              {formattedDeadline}
            </dd>
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pb-2 border-b border-white/10">
          <dt className="text-white/60 flex items-center gap-1.5 font-semibold">
            <Award className="w-3.5 h-3.5 text-[var(--color-rm-gold)]" />
            <span>Fee</span>
          </dt>
          <dd className="font-extrabold text-white">
            {isFree ? "Free Registration" : `₹${competition.registrationFee}`}
          </dd>
        </div>

        <div className="pt-1">
          <dt className="text-white/60 flex items-center gap-1.5 font-semibold mb-1">
            <Users className="w-3.5 h-3.5 text-[var(--color-rm-gold)]" />
            <span>Eligibility Summary</span>
          </dt>
          <dd className="text-white/85 text-xs leading-relaxed">
            {competition.eligibility}
          </dd>
        </div>
      </dl>

      <div className="pt-2">
        <Link
          href={`/competitions/${competition.slug}`}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
        >
          <span>View Full Competition Details</span>
          <ExternalLink className="w-3.5 h-3.5 text-[var(--color-rm-gold)]" />
        </Link>
      </div>
    </aside>
  );
};
