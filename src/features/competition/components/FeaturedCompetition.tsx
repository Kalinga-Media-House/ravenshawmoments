"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  ArrowRight,
  Globe,
} from "lucide-react";
import { CompetitionItem } from "../types/competition";
import { computeCompetitionStatus } from "../utils/competitionStatus";
import { innerPageHeroImages } from "@/config/innerPageHeroImages";

export interface FeaturedCompetitionProps {
  competitions: CompetitionItem[];
}

export const FeaturedCompetition: React.FC<FeaturedCompetitionProps> = ({
  competitions,
}) => {
  const [imageError, setImageError] = useState(false);

  const featuredItems = competitions.filter((item) => item.featured === true);
  if (featuredItems.length === 0) {
    return null;
  }

  const selectedFeatured = featuredItems.sort((a, b) => {
    const statusA = computeCompetitionStatus(a);
    const statusB = computeCompetitionStatus(b);

    const getScore = (s: string) => {
      if (s === "Registration Open") return 4;
      if (s === "Upcoming") return 3;
      if (s === "Ongoing") return 2;
      return 1;
    };

    const diff = getScore(statusB) - getScore(statusA);
    if (diff !== 0) return diff;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  })[0];

  if (!selectedFeatured) {
    return null;
  }

  const currentStatus = computeCompetitionStatus(selectedFeatured);
  const formattedStartDate = new Date(selectedFeatured.startDate).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const formattedDeadline = selectedFeatured.registrationDeadline
    ? new Date(selectedFeatured.registrationDeadline).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  // Prevent generic Unsplash/placeholder/demo images from showing (treat as no image uploaded)
  const isFallbackImage =
    !selectedFeatured.coverImage ||
    selectedFeatured.coverImage.includes("unsplash.com") ||
    selectedFeatured.coverImage.includes("placeholder") ||
    selectedFeatured.coverImage.includes("default.webp") ||
    selectedFeatured.coverImage.includes("/images/competitions/");

  const displayImage =
    !imageError && !isFallbackImage && selectedFeatured.coverImage?.trim()
      ? selectedFeatured.coverImage
      : "/hero/hero-1.webp";

  return (
    <section aria-labelledby="featured-competition-heading" className="w-full">
      <div 
        className="rounded-3xl overflow-hidden relative"
        style={{
          background: 'radial-gradient(circle at top right, rgba(225, 171, 48, 0.10), transparent 35%), linear-gradient(135deg, #32000D 0%, #4D0618 45%, #680A25 100%)',
          border: '1px solid rgba(224, 171, 45, 0.28)',
          boxShadow: '0 18px 50px rgba(61, 0, 18, 0.20), 0 5px 16px rgba(61, 0, 18, 0.12)'
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-6 sm:p-8 lg:p-10">
          {/* Image Block */}
          <div className="lg:col-span-5 relative min-h-[260px] sm:min-h-[320px] rounded-2xl overflow-hidden border border-white/10 bg-black/40">
            <Image
              src={displayImage}
              alt={selectedFeatured.imageAlt || selectedFeatured.title}
              fill
              sizes="(max-width: 1024px) 100vw, 42vw"
              className="object-cover object-center"
              onError={() => setImageError(true)}
            />
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(180deg, rgba(49, 0, 14, 0.04) 0%, rgba(49, 0, 14, 0.24) 100%)'
              }}
            />

            {/* Badges overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E4B536] text-[#3D0012] text-xs font-extrabold uppercase tracking-wider shadow-md">
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                Featured Competition
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-black/80 border border-white/20 text-white text-xs font-bold shadow-md">
                {currentStatus}
              </span>
            </div>
          </div>

          {/* Content Block */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#E4B536]/10 border border-[#E4B536]/30 text-xs font-bold text-[#E4B536]">
                  {selectedFeatured.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-semibold" style={{ color: 'rgba(255, 255, 255, 0.62)' }}>
                  {selectedFeatured.level} Level
                </span>
                {selectedFeatured.externalParticipantsAllowed && (
                  <span className="px-2.5 py-0.5 rounded-md bg-[#E4B536]/10 border border-[#E4B536]/30 text-xs font-bold text-[#E4B536] flex items-center gap-1">
                    <Globe className="w-3 h-3" aria-hidden="true" />
                    Open to Eligible External Participants
                  </span>
                )}
              </div>

              <div>
                <h2
                  id="featured-competition-heading"
                  className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug"
                  style={{ color: '#FFFFFF' }}
                >
                  {selectedFeatured.title}
                </h2>
                <p className="text-sm sm:text-base mt-2 leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.78)' }}>
                  {selectedFeatured.shortDescription}
                </p>
              </div>

              {/* Key metadata grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div 
                  className="p-3 rounded-xl flex items-center gap-3 transition-colors duration-300"
                  style={{ background: 'rgba(255, 255, 255, 0.055)', border: '1px solid rgba(255, 255, 255, 0.13)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.085)';
                    e.currentTarget.style.borderColor = 'rgba(228, 181, 54, 0.34)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.055)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.13)';
                  }}
                >
                  <div className="w-9 h-9 rounded-lg bg-black/20 flex items-center justify-center text-[#E4B536] shrink-0">
                    <Award className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold block" style={{ color: 'rgba(255, 255, 255, 0.62)' }}>
                      Organized By
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold truncate block" style={{ color: '#FFFFFF' }}>
                      {selectedFeatured.organizerName}
                    </span>
                  </div>
                </div>

                <div 
                  className="p-3 rounded-xl flex items-center gap-3 transition-colors duration-300"
                  style={{ background: 'rgba(255, 255, 255, 0.055)', border: '1px solid rgba(255, 255, 255, 0.13)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.085)';
                    e.currentTarget.style.borderColor = 'rgba(228, 181, 54, 0.34)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.055)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.13)';
                  }}
                >
                  <div className="w-9 h-9 rounded-lg bg-black/20 flex items-center justify-center text-[#E4B536] shrink-0">
                    <Calendar className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold block" style={{ color: 'rgba(255, 255, 255, 0.62)' }}>
                      Competition Date
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold block" style={{ color: '#E4B536' }}>
                      {formattedStartDate}
                    </span>
                  </div>
                </div>

                <div 
                  className="p-3 rounded-xl flex items-center gap-3 transition-colors duration-300"
                  style={{ background: 'rgba(255, 255, 255, 0.055)', border: '1px solid rgba(255, 255, 255, 0.13)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.085)';
                    e.currentTarget.style.borderColor = 'rgba(228, 181, 54, 0.34)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.055)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.13)';
                  }}
                >
                  <div className="w-9 h-9 rounded-lg bg-black/20 flex items-center justify-center text-[#E4B536] shrink-0">
                    <MapPin className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-bold block" style={{ color: 'rgba(255, 255, 255, 0.62)' }}>
                      Venue / Mode
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold truncate block" style={{ color: '#FFFFFF' }}>
                      {selectedFeatured.venue} ({selectedFeatured.mode})
                    </span>
                  </div>
                </div>

                {formattedDeadline && (
                  <div 
                    className="p-3 rounded-xl flex items-center gap-3 transition-colors duration-300"
                    style={{ background: 'rgba(255, 255, 255, 0.055)', border: '1px solid rgba(255, 255, 255, 0.13)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.085)';
                      e.currentTarget.style.borderColor = 'rgba(228, 181, 54, 0.34)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.055)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.13)';
                    }}
                  >
                    <div className="w-9 h-9 rounded-lg bg-black/20 flex items-center justify-center text-[#E4B536] shrink-0">
                      <Clock className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold block" style={{ color: 'rgba(255, 255, 255, 0.62)' }}>
                        Registration Deadline
                      </span>
                      <span className="text-xs sm:text-sm font-extrabold block" style={{ color: '#E4B536' }}>
                        {formattedDeadline}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Eligibility & Fee summary */}
              <div 
                className="p-3.5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                style={{
                  background: 'rgba(31, 0, 10, 0.48)',
                  border: '1px solid rgba(228, 181, 54, 0.18)',
                  color: 'rgba(255, 255, 255, 0.78)'
                }}
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 shrink-0" style={{ color: '#E4B536' }} aria-hidden="true" />
                  <span>
                    <strong style={{ color: '#FFFFFF' }}>Eligibility:</strong> {selectedFeatured.eligibility}
                  </span>
                </div>
                <div className="shrink-0 font-bold" style={{ color: '#E4B536' }}>
                  {selectedFeatured.registrationFee && selectedFeatured.registrationFee > 0
                    ? `Fee: ₹${selectedFeatured.registrationFee}`
                    : "Free Registration"}
                </div>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href={selectedFeatured.href}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-300 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4B536] group"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(228, 181, 54, 0.70)',
                  color: '#FFFFFF'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#E4B536';
                  e.currentTarget.style.color = '#3D0012';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span>Explore Competition</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
