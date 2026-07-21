import React from "react";
import { HeartHandshake } from "lucide-react";

interface AlumniContributionsProps {
  memoriesCount: number;
  galleryCount: number;
  achievementsCount: number;
  certificatesCount: number;
}

export const AlumniContributions: React.FC<AlumniContributionsProps> = ({
  memoriesCount,
  galleryCount,
  achievementsCount,
  certificatesCount,
}) => {
  const totalContributions =
    memoriesCount + galleryCount + achievementsCount + certificatesCount;

  if (totalContributions === 0) {
    return null;
  }

  const items = [
    memoriesCount > 0
      ? { label: "Public Memories Shared", count: memoriesCount }
      : null,
    galleryCount > 0
      ? { label: "Campus Photographs Contributed", count: galleryCount }
      : null,
    achievementsCount > 0
      ? { label: "Verified Honors & Awards", count: achievementsCount }
      : null,
    certificatesCount > 0
      ? { label: "Verified Certificates", count: certificatesCount }
      : null,
  ].filter(Boolean);

  return (
    <section aria-labelledby="alumni-contributions-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)]">
            <HeartHandshake className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="alumni-contributions-heading"
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              Contributions to the Community
            </h2>
            <p className="text-xs text-white/70">
              Community involvement and archival records shared across generations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="rm-glass-card rounded-2xl p-5 border border-white/10 text-center space-y-1 hover:border-[var(--color-rm-gold)]/40 transition-colors"
            >
              <p className="text-2xl sm:text-3xl font-black text-[var(--color-rm-gold)]">
                {item?.count}
              </p>
              <p className="text-xs font-bold text-white/80">{item?.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
