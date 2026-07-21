import React from "react";
import { GraduationCap, Calendar, Building2, BookOpen } from "lucide-react";
import { PublicAlumniProfile } from "../../types/alumni";

interface AlumniJourneyProps {
  alumnus: PublicAlumniProfile;
}

export const AlumniJourney: React.FC<AlumniJourneyProps> = ({ alumnus }) => {
  const hasAcademicInfo =
    Boolean(alumnus.departmentName) ||
    Boolean(alumnus.batch) ||
    Boolean(alumnus.graduationYear) ||
    Boolean(alumnus.programme) ||
    Boolean(alumnus.academicLevel);

  if (!hasAcademicInfo) {
    return null;
  }

  const milestones = [
    alumnus.admissionYear
      ? {
          year: alumnus.admissionYear,
          title: "Joined Ravenshaw University",
          description: [
            alumnus.academicLevel && `${alumnus.academicLevel} Studies`,
            alumnus.departmentName && `Department of ${alumnus.departmentName}`,
          ]
            .filter(Boolean)
            .join(" : "),
        }
      : null,
    alumnus.programme || alumnus.departmentName
      ? {
          year: alumnus.batch ? `Batch ${alumnus.batch}` : "Academic Life",
          title: alumnus.programme || "Academic Programme",
          description: alumnus.departmentName
            ? `Specialization in ${alumnus.departmentName}`
            : undefined,
        }
      : null,
    alumnus.graduationYear || alumnus.batch
      ? {
          year: alumnus.graduationYear || alumnus.batch || "",
          title: "Alumnus of Ravenshaw University",
          description: "Graduation and entry into the lifelong alumni community.",
        }
      : null,
  ].filter(Boolean);

  return (
    <section aria-labelledby="alumni-journey-heading" className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)]">
            <GraduationCap className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="alumni-journey-heading"
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              My Ravenshaw Journey
            </h2>
            <p className="text-xs text-white/70">
              Academic chapter at Ravenshaw University.
            </p>
          </div>
        </div>

        {/* Milestone Timeline / Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {milestones.map((milestone, idx) => (
            <div
              key={idx}
              className="rm-glass-card rounded-2xl p-5 border border-white/10 space-y-3 flex flex-col justify-between hover:border-[var(--color-rm-gold)]/40 transition-colors"
            >
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[var(--color-rm-gold)]/20 text-[var(--color-rm-gold)] border border-[var(--color-rm-gold)]/30">
                  <Calendar className="w-3 h-3" aria-hidden="true" />
                  <span>{milestone?.year}</span>
                </span>
                <h3 className="text-base font-black text-white">
                  {milestone?.title}
                </h3>
              </div>
              {milestone?.description && (
                <p className="text-xs text-white/75 leading-relaxed">
                  {milestone.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Concise Summary Metadata Row */}
        <div className="rm-glass-card rounded-2xl p-5 border border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {alumnus.departmentName && (
            <div className="space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">
                Department
              </span>
              <p className="text-sm font-black text-white flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-[var(--color-rm-gold)]" aria-hidden="true" />
                <span>{alumnus.departmentName}</span>
              </p>
            </div>
          )}

          {alumnus.programme && (
            <div className="space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">
                Programme
              </span>
              <p className="text-sm font-black text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[var(--color-rm-gold)]" aria-hidden="true" />
                <span>{alumnus.programme}</span>
              </p>
            </div>
          )}

          {alumnus.batch && (
            <div className="space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">
                Batch
              </span>
              <p className="text-sm font-black text-[var(--color-rm-gold)]">
                {alumnus.batch}
              </p>
            </div>
          )}

          {alumnus.graduationYear && (
            <div className="space-y-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-white/60">
                Graduation Year
              </span>
              <p className="text-sm font-black text-white">
                {alumnus.graduationYear}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
