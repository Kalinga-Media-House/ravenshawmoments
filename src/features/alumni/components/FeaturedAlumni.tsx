import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, ShieldCheck, Award } from "lucide-react";
import { PublicAlumniProfile } from "../types/alumni";

interface FeaturedAlumniProps {
  alumni: PublicAlumniProfile[];
}

export const FeaturedAlumni: React.FC<FeaturedAlumniProps> = ({ alumni }) => {
  const featuredList = alumni
    .filter((a) => Boolean(a.featured))
    .slice(0, 3);

  if (featuredList.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="featured-alumni-heading" className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--color-rm-gold)]">
              <Sparkles className="w-4 h-4" aria-hidden="true" />
              <span>INSPIRING JOURNEYS</span>
            </div>
            <h2
              id="featured-alumni-heading"
              className="text-2xl sm:text-3xl font-black text-white tracking-tight"
            >
              Featured Alumni
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-white/70">
            Celebrating legacy, achievement, and lifelong connection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredList.map((alumnus) => {
            const initials = alumnus.fullName
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            const profileUrl = alumnus.profileHref || `/profile/${alumnus.slug}`;

            return (
              <div
                key={alumnus.id}
                className="rm-glass-card rounded-2xl p-6 border border-[var(--color-rm-gold)]/40 hover:border-[var(--color-rm-gold)] transition-all duration-300 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  {/* Top: Avatar & Badges */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/30 shrink-0 flex items-center justify-center">
                      {alumnus.profilePhoto && alumnus.profilePhotoPublic ? (
                        <Image
                          src={alumnus.profilePhoto}
                          alt={alumnus.profilePhotoAlt || `${alumnus.fullName} photograph`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-lg font-black text-[var(--color-rm-gold)]">
                          {initials}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[var(--color-rm-gold)]/20 text-[var(--color-rm-gold)] border border-[var(--color-rm-gold)]/30">
                        Featured Alumni
                      </span>
                      {alumnus.profileVerificationStatus === "approved" && (
                        <span
                          title="Verified Profile"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                        >
                          <ShieldCheck className="w-3 h-3" aria-hidden="true" />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Name & Academic metadata */}
                  <div className="space-y-1">
                    <Link
                      href={profileUrl}
                      className="text-xl font-black text-white hover:text-[var(--color-rm-gold)] transition-colors block leading-tight"
                    >
                      {alumnus.fullName}
                    </Link>
                    <div className="text-xs font-bold text-white/70 space-x-2">
                      {alumnus.departmentName && (
                        <span>{alumnus.departmentName}</span>
                      )}
                      {alumnus.batch && (
                        <span className="text-[var(--color-rm-gold)]">
                          Batch {alumnus.batch}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Professional Role / Company */}
                  {(alumnus.currentRole || alumnus.currentOrganization) && (
                    <div className="text-xs font-bold text-white/90 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
                      {alumnus.currentRole && <span>{alumnus.currentRole}</span>}
                      {alumnus.currentRole && alumnus.currentOrganization && (
                        <span className="text-white/40"> at </span>
                      )}
                      {alumnus.currentOrganization && (
                        <span className="text-[var(--color-rm-gold)]">
                          {alumnus.currentOrganization}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Short Bio */}
                  {alumnus.shortBio && (
                    <p className="text-xs sm:text-sm text-white/75 leading-relaxed line-clamp-3">
                      {alumnus.shortBio}
                    </p>
                  )}

                  {/* Achievement Highlight */}
                  {alumnus.publicAchievements && alumnus.publicAchievements.length > 0 && (
                    <div className="rounded-xl bg-[var(--color-rm-maroon)]/40 p-3 border border-white/10 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[var(--color-rm-gold)]">
                        <Award className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Achievement Highlight</span>
                      </div>
                      <Link
                        href={`/achievements/${alumnus.publicAchievements[0].slug}`}
                        className="text-xs font-bold text-white/90 hover:text-[var(--color-rm-gold)] transition-colors line-clamp-2 block"
                      >
                        {alumnus.publicAchievements[0].title}
                      </Link>
                    </div>
                  )}
                </div>

                {/* View Profile Action */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <Link
                    href={profileUrl}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[var(--color-rm-gold)] hover:text-white transition-colors"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
