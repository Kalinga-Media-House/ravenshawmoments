import React from "react";
import { Users } from "lucide-react";
import { PublicAlumniProfile } from "../../types/alumni";
import { AlumniCard } from "../AlumniCard";

interface RelatedAlumniProps {
  currentProfileSlug: string;
  departmentName?: string;
  batch?: string;
  allAlumni: PublicAlumniProfile[];
}

export const RelatedAlumni: React.FC<RelatedAlumniProps> = ({
  currentProfileSlug,
  departmentName,
  batch,
  allAlumni,
}) => {
  const filtered = allAlumni.filter(
    (a) =>
      a.slug !== currentProfileSlug &&
      a.profileVerificationStatus === "approved"
  );

  if (filtered.length === 0) {
    return null;
  }

  // Prioritize same batch first, then same department
  const sorted = [...filtered].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    if (batch && a.batch === batch) scoreA += 2;
    if (departmentName && a.departmentName === departmentName) scoreA += 1;
    if (batch && b.batch === batch) scoreB += 2;
    if (departmentName && b.departmentName === departmentName) scoreB += 1;
    return scoreB - scoreA;
  });

  const displayAlumni = sorted.slice(0, 4);

  return (
    <section aria-labelledby="related-alumni-heading" className="py-10 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)]">
            <Users className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="related-alumni-heading"
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              More Ravenshaw Journeys
            </h2>
            <p className="text-xs text-white/70">
              Discover fellow alumni across departments, hostels, and generations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayAlumni.map((alumnus, index) => (
            <AlumniCard key={alumnus.id} alumnus={alumnus} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
