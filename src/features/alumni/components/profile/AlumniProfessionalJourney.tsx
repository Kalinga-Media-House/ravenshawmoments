import React from "react";
import { Briefcase, Building2, MapPin, Compass } from "lucide-react";
import { PublicAlumniProfile } from "../../types/alumni";

interface AlumniProfessionalJourneyProps {
  alumnus: PublicAlumniProfile;
}

export const AlumniProfessionalJourney: React.FC<
  AlumniProfessionalJourneyProps
> = ({ alumnus }) => {
  const hasProfessionalInfo =
    Boolean(alumnus.currentRole) ||
    Boolean(alumnus.currentOrganization) ||
    Boolean(alumnus.currentProfession) ||
    Boolean(alumnus.industry) ||
    (Array.isArray(alumnus.careerMilestones) &&
      alumnus.careerMilestones.length > 0);

  if (!hasProfessionalInfo) {
    return null;
  }

  const locationString = [alumnus.city, alumnus.state, alumnus.country]
    .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
    .join(", ");

  return (
    <section aria-labelledby="alumni-professional-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)]">
            <Compass className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="alumni-professional-heading"
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              Beyond Ravenshaw
            </h2>
            <p className="text-xs text-white/70">
              Professional journey and contributions after graduation.
            </p>
          </div>
        </div>

        <div className="rm-glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(alumnus.currentRole || alumnus.currentProfession) && (
              <div className="space-y-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Current Role / Profession
                </span>
                <p className="text-base font-black text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[var(--color-rm-gold)]" aria-hidden="true" />
                  <span>
                    {alumnus.currentRole || alumnus.currentProfession}
                  </span>
                </p>
              </div>
            )}

            {alumnus.currentOrganization && (
              <div className="space-y-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Organization / Company
                </span>
                <p className="text-base font-black text-[var(--color-rm-gold)] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-white/80" aria-hidden="true" />
                  <span>{alumnus.currentOrganization}</span>
                </p>
              </div>
            )}

            {locationString && (
              <div className="space-y-1">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">
                  Public Location
                </span>
                <p className="text-base font-bold text-white/90 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[var(--color-rm-gold)]" aria-hidden="true" />
                  <span>{locationString}</span>
                </p>
              </div>
            )}
          </div>

          {Array.isArray(alumnus.careerMilestones) &&
            alumnus.careerMilestones.length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-rm-gold)]">
                  Career Milestones
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-white/85">
                  {alumnus.careerMilestones.map((milestone, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-[var(--color-rm-gold)] mt-1">•</span>
                      <span>{milestone}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </div>
      </div>
    </section>
  );
};
