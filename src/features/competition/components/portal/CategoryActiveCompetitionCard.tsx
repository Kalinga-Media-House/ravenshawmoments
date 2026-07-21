"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { CategoryActiveCompetition } from "../../types/categoryPortal";

interface CategoryActiveCompetitionCardProps {
  competition: CategoryActiveCompetition | null;
  categoryName: string;
}

export function CategoryActiveCompetitionCard({
  competition,
  categoryName
}: CategoryActiveCompetitionCardProps) {
  const [countdownText, setCountdownText] = useState<string>("");

  useEffect(() => {
    if (!competition?.registrationCloseAt) {
      const t = setTimeout(() => setCountdownText(""), 0);
      return () => clearTimeout(t);
    }

    const updateCountdown = () => {
      const closeTime = new Date(competition.registrationCloseAt!).getTime();
      const now = Date.now();
      const diff = closeTime - now;

      if (diff <= 0) {
        setCountdownText("Registration window closed");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setCountdownText(`${days}d ${hours}h remaining`);
      } else {
        setCountdownText(`${hours}h ${minutes}m remaining`);
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 60000);
    return () => clearInterval(timer);
  }, [competition?.registrationCloseAt]);

  if (!competition) {
    return (
      <div className="rounded-3xl border border-[#8A1735]/30 bg-[#2B070E]/60 p-8 text-center text-[#FFF9F0]">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#4A0E17] text-[#D4AF37]">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-bold">No Active Competitions Open</h3>
        <p className="mt-2 text-sm text-[#FFF9F0]/70 max-w-md mx-auto">
          There are currently no open or upcoming registrations for {categoryName}. Check back soon or explore our previous winners and leaderboard below.
        </p>
      </div>
    );
  }

  const isRegistrationOpen = competition.statusLabel === "Registration Open";

  return (
    <article className="overflow-hidden rounded-3xl border border-[#D4AF37]/40 bg-gradient-to-br from-[#4A0E17]/90 to-[#2B070E] shadow-2xl text-[#FFF9F0]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
        {/* Cover Image & Status Badge */}
        <div className="md:col-span-4 relative overflow-hidden rounded-2xl min-h-[200px] border border-[#8A1735]/40">
          <Image
            src={competition.coverImage}
            alt={competition.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow ${
                isRegistrationOpen
                  ? "bg-emerald-600/90 text-white"
                  : "bg-amber-600/90 text-white"
              }`}
            >
              {competition.statusLabel}
            </span>
            <span className="inline-flex items-center rounded-full bg-[#4A0E17]/90 px-3 py-1 text-xs font-semibold text-[#D4AF37] border border-[#D4AF37]/30">
              {competition.level} Level
            </span>
          </div>
        </div>

        {/* Competition Content & Details */}
        <div className="md:col-span-8 flex flex-col justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
              <span className="text-xs uppercase tracking-wider text-[#D4AF37] font-semibold">
                Featured Opportunity
              </span>
              {competition.isPaid && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#8A1735]/80 px-3 py-1 text-xs font-medium text-[#FFF9F0]">
                  <CreditCard className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Fee: {competition.feeLabel} (Payment Required)
                </span>
              )}
              {!competition.isPaid && (
                <span className="inline-flex items-center rounded-full bg-emerald-950/80 border border-emerald-500/30 px-3 py-1 text-xs font-medium text-emerald-300">
                  Free Entry
                </span>
              )}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#FFF9F0]">
              {competition.title}
            </h3>

            <p className="mt-2 text-sm sm:text-base text-[#FFF9F0]/80 leading-relaxed">
              {competition.shortDescription}
            </p>

            {/* Metadata Grid */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-[#FFF9F0]/85">
              {competition.competitionDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>Event: {new Date(competition.competitionDate).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Venue/Mode: {competition.venueOrMode}</span>
              </div>
              {competition.registrationCloseAt && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <span>
                    Deadline: {new Date(competition.registrationCloseAt).toLocaleDateString()}
                    {countdownText ? ` (${countdownText})` : ""}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span className="truncate">Eligibility: {competition.eligibilitySummary}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <Link
              href={`/competitions/${competition.slug}/register`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#2B070E] shadow-lg hover:bg-[#e0be47] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white min-h-[44px]"
            >
              <span>Register Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={`/competitions/${competition.slug}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#FFF9F0]/30 bg-[#4A0E17]/60 px-6 py-3 text-sm font-semibold text-[#FFF9F0] hover:bg-[#8A1735]/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] min-h-[44px]"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
