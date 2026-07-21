"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Award,
  ArrowRight,
  Globe,
  FileCheck,
} from "lucide-react";
import { CompetitionItem } from "../types/competition";
import { computeCompetitionStatus } from "../utils/competitionStatus";

export interface CompetitionCardProps {
  competition: CompetitionItem;
}

export const CompetitionCard: React.FC<CompetitionCardProps> = ({
  competition,
}) => {
  const [imageError, setImageError] = useState(false);
  const currentStatus = computeCompetitionStatus(competition);

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
      })
    : null;

  const renderOrganizerLink = () => {
    let href: string | null = null;
    if (competition.organizerType === "Department" && competition.organizerSlug) {
      href = `/departments/${competition.organizerSlug}`;
    } else if (competition.organizerType === "Hostel" && competition.organizerSlug) {
      href = `/hostels/${competition.organizerSlug}`;
    } else if (competition.organizerType === "Organization" && competition.organizerSlug) {
      href = `/organizations/${competition.organizerSlug}`;
    } else if (competition.eventSlug) {
      href = `/events/${competition.eventSlug}`;
    }

    if (href) {
      return (
        <Link
          href={href}
          className="hover:text-[var(--color-heritage-gold)] transition-colors underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-heritage-gold)] rounded text-foreground font-bold"
        >
          {competition.organizerName}
        </Link>
      );
    }
    return <span className="text-foreground font-bold">{competition.organizerName}</span>;
  };

  const isFallbackImage =
    !competition.coverImage ||
    competition.coverImage.includes("unsplash.com") ||
    competition.coverImage.includes("placeholder") ||
    competition.coverImage.includes("default.webp") ||
    competition.coverImage.includes("/images/competitions/");

  const displayImage =
    !imageError && !isFallbackImage && competition.coverImage?.trim()
      ? competition.coverImage
      : "/hero/hero-1.webp";

  return (
    <article className="rounded-3xl overflow-hidden flex flex-col justify-between group h-full heritage-card-glass transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:border-[#D4AF37]/60">
      <div>
        {/* Cover Image Block */}
        <div className="relative h-48 sm:h-52 w-full overflow-hidden border-b border-white/10 bg-black/40">
          <Image
            src={displayImage}
            alt={competition.imageAlt || competition.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[5]" />

          {/* Top overlays */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold tracking-wide shadow-md bg-black/80 text-white border border-white/20 backdrop-blur-xs">
              {currentStatus}
            </span>

            {competition.featured && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-md bg-[#D4AF37] text-[#2A0810] border border-[#D4AF37]">
                <Sparkles className="size-3.5 fill-[#2A0810]" />
                Featured
              </span>
            )}
          </div>
        </div>

        {/* Content Block */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Metadata badges */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]">
              {competition.category}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 border border-white/15 text-white/90">
              {competition.level} Level
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 border border-white/15 text-white/90 capitalize">
              {competition.participationMode}
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-extrabold leading-snug text-foreground group-hover:text-[var(--color-heritage-gold)] transition-colors">
              <Link
                href={competition.href}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded"
              >
                {competition.title}
              </Link>
            </h3>
            <p className="text-xs sm:text-sm font-medium mt-1.5 line-clamp-2 leading-relaxed heritage-card-muted">
              {competition.shortDescription}
            </p>
          </div>

          {/* Key metadata items */}
          <div className="space-y-2 text-xs pt-4 border-t border-white/10">
            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="font-semibold flex items-center gap-1.5 heritage-card-muted">
                <Award className="size-3.5 text-[#D4AF37]" />
                Organizer:
              </span>
              <span className="truncate max-w-[170px]">
                {renderOrganizerLink()}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold flex items-center gap-1.5 heritage-card-muted">
                <Calendar className="size-3.5 text-[#D4AF37]" />
                Date:
              </span>
              <span className="font-bold text-foreground">{formattedStartDate}</span>
            </div>

            {formattedDeadline && (
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold flex items-center gap-1.5 heritage-card-muted">
                  <Clock className="size-3.5 text-[#D4AF37]" />
                  Deadline:
                </span>
                <span className="font-bold text-[#D4AF37]">
                  {formattedDeadline}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold flex items-center gap-1.5 heritage-card-muted">
                <MapPin className="size-3.5 text-[#D4AF37]" />
                Venue:
              </span>
              <span className="font-bold text-foreground truncate max-w-[170px]">
                {competition.venue} {competition.mode !== "offline" ? `(${competition.mode})` : ""}
              </span>
            </div>
          </div>

          {/* External participant & Certificate Badges */}
          <div className="flex flex-col gap-1.5 pt-1">
            {competition.externalParticipantsAllowed && (
              <div className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center justify-between bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37]">
                <span className="flex items-center gap-1.5">
                  <Globe className="size-3.5 shrink-0 text-[#D4AF37]" />
                  Open to External Students
                </span>
              </div>
            )}

            {competition.certificateAvailable && (
              <div className="px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/90">
                <FileCheck className="size-3.5 text-[#D4AF37]" />
                <span>Certificate Available</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer action */}
      <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-4 flex items-center justify-between gap-3 bg-black/25 border-t border-white/10">
        <div className="text-xs font-extrabold flex items-center gap-1">
          {competition.registrationFee && competition.registrationFee > 0 ? (
            <>
              <span className="heritage-card-muted">Fee:</span>
              <span className="text-[#D4AF37] font-bold">₹{competition.registrationFee}</span>
            </>
          ) : (
            <span className="text-[#D4AF37] font-bold">Free Registration</span>
          )}
        </div>

        <Link
          href={competition.href}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 bg-white/10 border border-white/20 text-white hover:bg-[#D4AF37] hover:text-[#2A0810] hover:border-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
        >
          <span>View Details</span>
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
};
