"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  ArrowRight,
  MapPin,
  Award,
  Sparkles,
} from "lucide-react";
import { PublicAlumniProfile } from "../types/alumni";

interface AlumniCardProps {
  alumnus: PublicAlumniProfile;
  index: number;
}

export const AlumniCard: React.FC<AlumniCardProps> = ({ alumnus, index }) => {
  const cardRef = useRef<HTMLElement>(null);
  const profileUrl = alumnus.profileHref || `/profile/${alumnus.slug}`;

  const initials = alumnus.fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const locationString = [alumnus.city, alumnus.state, alumnus.country]
    .filter((part): part is string => typeof part === "string" && part.trim().length > 0)
    .join(", ");

  useEffect(() => {
    // Staggered fade-up animation on mount
    if (cardRef.current) {
      setTimeout(() => {
        if (cardRef.current) {
          cardRef.current.style.opacity = "1";
          cardRef.current.style.transform = "translateY(0)";
        }
      }, 80 + index * 80);
    }
  }, [index]);

  return (
    <article 
      ref={cardRef}
      className="group relative rounded-[18px] p-5 flex flex-col justify-between h-full bg-[#FFF9F4] border border-[#520016]/10"
      style={{
        opacity: 0,
        transform: "translateY(24px)",
        transition: "opacity 550ms ease-out, transform 550ms ease-out, box-shadow 300ms ease, border-color 300ms ease",
        boxShadow: "0 4px 15px rgba(82,0,22,0.03)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-5px)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(82,0,22,0.12)";
        e.currentTarget.style.borderColor = "rgba(82,0,22,0.2)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(82,0,22,0.03)";
        e.currentTarget.style.borderColor = "rgba(82,0,22,0.1)";
      }}
    >
      <div className="space-y-4">
        {/* Top: Avatar & Badges */}
        <div className="flex items-start justify-between gap-3">
          <div className="relative w-[76px] h-[76px] sm:w-[88px] sm:h-[88px] rounded-full overflow-hidden bg-[#520016] border-[3px] border-[#F2B936] shrink-0 flex items-center justify-center">
            {alumnus.profilePhoto && alumnus.profilePhotoPublic ? (
              <Image
                src={alumnus.profilePhoto}
                alt={alumnus.profilePhotoAlt || `${alumnus.fullName} photograph`}
                fill
                sizes="88px"
                className="object-cover"
              />
            ) : (
              <span className="text-[28px] font-black text-[#F2B936]">
                {initials}
              </span>
            )}
          </div>

          <div className="flex flex-col items-end gap-1.5 pt-1">
            {alumnus.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F2B936]/15 text-[#855B00] border border-[#F2B936]/30">
                <Sparkles className="w-3 h-3" aria-hidden="true" />
                <span>Featured</span>
              </span>
            )}
            {alumnus.profileVerificationStatus === "approved" && (
              <span
                title="Verified Profile"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200"
              >
                <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                <span>Verified</span>
              </span>
            )}
          </div>
        </div>

        {/* Name & Academic Credentials */}
        <div className="space-y-1">
          <Link
            href={profileUrl}
            className="text-[18px] sm:text-[20px] font-[750] text-[#520016] hover:text-[#8E0028] transition-colors leading-tight block truncate"
          >
            {alumnus.fullName}
          </Link>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-2 text-[13px] font-medium text-[#4A4346]">
            {alumnus.departmentName && (
              <span className="text-[#35000E] font-semibold">{alumnus.departmentName}</span>
            )}
            {alumnus.programme && (
              <span className="text-[#7A6F73] text-[12px]">({alumnus.programme})</span>
            )}
            {alumnus.batch && (
              <span className="text-[#520016] bg-[#520016]/5 px-2 rounded-full font-bold">
                Batch {alumnus.batch}
              </span>
            )}
            {!alumnus.batch && alumnus.graduationYear && (
              <span className="text-[#520016] bg-[#520016]/5 px-2 rounded-full font-bold">
                Class of {alumnus.graduationYear}
              </span>
            )}
          </div>
        </div>

        {/* Current Profession / Role / Organization */}
        {(alumnus.currentRole ||
          alumnus.currentOrganization ||
          alumnus.currentProfession) && (
          <div className="text-[13px] text-[#4A4346] bg-white rounded-xl px-3 py-2.5 border border-[#520016]/10 space-y-0.5">
            {alumnus.currentRole && (
              <p className="text-[#35000E] font-bold">{alumnus.currentRole}</p>
            )}
            {alumnus.currentOrganization && (
              <p className="text-[#8E0028] font-semibold">
                {alumnus.currentOrganization}
              </p>
            )}
            {!alumnus.currentRole &&
              !alumnus.currentOrganization &&
              alumnus.currentProfession && (
                <p className="text-[#4A4346]">{alumnus.currentProfession}</p>
              )}
          </div>
        )}

        {/* Public Location */}
        {locationString && (
          <div className="flex items-center gap-1.5 text-[12px] text-[#4A4346] font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#520016] shrink-0" aria-hidden="true" />
            <span className="truncate">{locationString}</span>
          </div>
        )}

        {/* Short Biography */}
        {alumnus.shortBio && (
          <p className="text-[13px] text-[#7A6F73] leading-relaxed line-clamp-2">
            {alumnus.shortBio}
          </p>
        )}

        {/* Achievement Highlight */}
        {alumnus.publicAchievements && alumnus.publicAchievements.length > 0 && (
          <div className="rounded-xl bg-[#520016]/5 p-3 border border-[#520016]/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#520016]">
              <Award className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Achievement Highlight</span>
            </div>
            <Link
              href={`/achievements/${alumnus.publicAchievements[0].slug}`}
              className="text-[12px] font-semibold text-[#35000E] hover:text-[#8E0028] transition-colors line-clamp-1 block"
            >
              {alumnus.publicAchievements[0].title}
            </Link>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="pt-4 mt-5 border-t border-[#520016]/10 flex items-center justify-between">
        <Link
          href={profileUrl}
          className="inline-flex items-center justify-center gap-2 w-full text-[13px] font-bold text-white bg-[#520016] hover:bg-[#68001C] py-2.5 rounded-lg transition-colors"
        >
          <span>View Profile</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};
