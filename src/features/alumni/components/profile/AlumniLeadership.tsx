import React from "react";
import { Award, Shield } from "lucide-react";
import { PublicAlumniProfile } from "../../types/alumni";

interface AlumniLeadershipProps {
  alumnus: PublicAlumniProfile;
}

export const AlumniLeadership: React.FC<AlumniLeadershipProps> = ({
  alumnus,
}) => {
  const leadershipItems = [
    ...(Array.isArray(alumnus.crHistory) ? alumnus.crHistory : []),
    ...(Array.isArray(alumnus.bmcHistory) ? alumnus.bmcHistory : []),
    ...(Array.isArray(alumnus.roleHistory) ? alumnus.roleHistory : []),
  ];

  if (leadershipItems.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="alumni-leadership-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)]">
            <Award className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="alumni-leadership-heading"
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              Leadership and Service
            </h2>
            <p className="text-xs text-white/70">
              Approved student leadership roles and service to the Ravenshaw community.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {leadershipItems.map((item, idx) => (
            <div
              key={idx}
              className="rm-glass-card rounded-2xl p-5 border border-white/10 flex items-start gap-4 hover:border-[var(--color-rm-gold)]/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--color-rm-maroon)]/80 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)] shrink-0">
                <Shield className="w-5 h-5" aria-hidden="true" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-white">{item}</h3>
                <p className="text-xs text-white/70">
                  Verified campus service leadership contribution.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
