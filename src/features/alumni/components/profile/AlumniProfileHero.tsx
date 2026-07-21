import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap,
  ShieldCheck,
  Sparkles,
  MapPin,
  Building2,
  Calendar,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import { PublicAlumniProfile } from "../../types/alumni";

interface AlumniProfileHeroProps {
  alumnus: PublicAlumniProfile;
}

export const AlumniProfileHero: React.FC<AlumniProfileHeroProps> = ({
  alumnus,
}) => {
  const initials = alumnus.fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const locationString = [alumnus.city, alumnus.state, alumnus.country]
    .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
    .join(", ");

  return (
    <section aria-labelledby="alumni-hero-heading" className="relative pt-24 sm:pt-28 pb-10 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden -mt-[72px] sm:-mt-[76px] min-[1150px]:-mt-20">
      {/* Heritage cinematic black gradients */}
      <div 
        className="absolute inset-0 pointer-events-none -z-10" 
        style={{ background: "linear-gradient(to right, rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.45))" }} 
      />

      <div className="pt-[72px] sm:pt-[76px] min-[1150px]:pt-20 max-w-6xl mx-auto space-y-6">
        {/* Top Navigation Row: Back Link & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <Link
            href="/alumni"
            className="inline-flex items-center gap-1.5 font-bold text-[var(--color-rm-gold)] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Alumni Directory</span>
          </Link>

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-white/60 font-bold uppercase tracking-wider">
            <Link href="/" className="hover:text-[var(--color-rm-gold)] transition-colors">
              Home
            </Link>
            <span className="text-white/30" aria-hidden="true">/</span>
            <Link href="/alumni" className="hover:text-[var(--color-rm-gold)] transition-colors">
              Alumni
            </Link>
            <span className="text-white/30" aria-hidden="true">/</span>
            <span className="text-white truncate max-w-[200px]">
              {alumnus.fullName}
            </span>
          </nav>
        </div>

        {/* Hero Identity Panel */}
        <div className="rm-glass-card rounded-3xl p-6 sm:p-8 md:p-10 border border-[var(--color-rm-gold)]/35">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
            {/* Left: Profile Photo / Frame */}
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-3xl overflow-hidden bg-[var(--color-rm-maroon)] border-2 border-[var(--color-rm-gold)]/40 shrink-0 flex items-center justify-center shadow-xl">
              {alumnus.profilePhoto && alumnus.profilePhotoPublic ? (
                <Image
                  src={alumnus.profilePhoto}
                  alt={alumnus.profilePhotoAlt || `${alumnus.fullName} profile photograph`}
                  fill
                  sizes="(max-width: 768px) 144px, 176px"
                  className="object-cover"
                />
              ) : (
                <span className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--color-rm-gold)]">
                  {initials}
                </span>
              )}
            </div>

            {/* Right: Identity & Summary */}
            <div className="flex-1 space-y-4">
              {/* Badges Row */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--color-rm-maroon)]/80 text-[var(--color-rm-gold)] border border-[var(--color-rm-gold)]/40">
                  <GraduationCap className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Alumnus</span>
                </span>

                {alumnus.featured && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[var(--color-rm-gold)]/20 text-[var(--color-rm-gold)] border border-[var(--color-rm-gold)]/40">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Featured Alumni</span>
                  </span>
                )}

                {alumnus.profileVerificationStatus === "approved" && (
                  <span
                    title="Verified Profile"
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Verified Profile</span>
                  </span>
                )}
              </div>

              {/* Name & Academic Meta */}
              <div className="space-y-1.5">
                <h1
                  id="alumni-hero-heading"
                  className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight"
                >
                  {alumnus.publicDisplayName || alumnus.fullName}
                </h1>

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-bold text-white/80">
                  {alumnus.departmentName && (
                    <span className="inline-flex items-center gap-1.5 text-white">
                      <Building2 className="w-4 h-4 text-[var(--color-rm-gold)] shrink-0" aria-hidden="true" />
                      <span>{alumnus.departmentName}</span>
                    </span>
                  )}

                  {alumnus.programme && (
                    <span className="text-white/60">
                      ({alumnus.programme})
                    </span>
                  )}

                  {alumnus.batch && (
                    <span className="inline-flex items-center gap-1.5 text-[var(--color-rm-gold)]">
                      <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Batch {alumnus.batch}</span>
                    </span>
                  )}

                  {!alumnus.batch && alumnus.graduationYear && (
                    <span className="inline-flex items-center gap-1.5 text-[var(--color-rm-gold)]">
                      <Calendar className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Class of {alumnus.graduationYear}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Professional Role & Company */}
              {(alumnus.currentRole ||
                alumnus.currentOrganization ||
                alumnus.currentProfession) && (
                <div className="inline-flex flex-wrap items-center gap-2 text-xs sm:text-sm font-bold bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5">
                  <Briefcase className="w-4 h-4 text-[var(--color-rm-gold)] shrink-0" aria-hidden="true" />
                  {alumnus.currentRole && (
                    <span className="text-white font-black">{alumnus.currentRole}</span>
                  )}
                  {alumnus.currentRole && alumnus.currentOrganization && (
                    <span className="text-white/40">at</span>
                  )}
                  {alumnus.currentOrganization && (
                    <span className="text-[var(--color-rm-gold)]">
                      {alumnus.currentOrganization}
                    </span>
                  )}
                  {!alumnus.currentRole &&
                    !alumnus.currentOrganization &&
                    alumnus.currentProfession && (
                      <span className="text-white/90">{alumnus.currentProfession}</span>
                    )}
                </div>
              )}

              {/* Location */}
              {locationString && (
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-white/70">
                  <MapPin className="w-4 h-4 text-[var(--color-rm-gold)] shrink-0" aria-hidden="true" />
                  <span>{locationString}</span>
                </div>
              )}

              {/* Short Bio Excerpt */}
              {alumnus.shortBio && (
                <p className="text-xs sm:text-sm md:text-base text-white/80 leading-relaxed max-w-3xl">
                  {alumnus.shortBio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
