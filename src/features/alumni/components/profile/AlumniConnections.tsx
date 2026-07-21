import React from "react";
import Link from "next/link";
import { Network, GraduationCap } from "lucide-react";
import { PublicAlumniProfile } from "../../types/alumni";

interface AlumniConnectionsProps {
  currentProfileSlug: string;
  batch?: string;
  departmentName?: string;
  allAlumni: PublicAlumniProfile[];
}

export const AlumniConnections: React.FC<AlumniConnectionsProps> = ({
  currentProfileSlug,
  batch,
  departmentName,
  allAlumni,
}) => {
  if (!batch && !departmentName) {
    return null;
  }

  const batchmates = batch
    ? allAlumni
        .filter(
          (a) =>
            a.slug !== currentProfileSlug &&
            a.batch === batch &&
            a.profileVerificationStatus === "approved"
        )
        .slice(0, 3)
    : [];

  const deptPeers = departmentName
    ? allAlumni
        .filter(
          (a) =>
            a.slug !== currentProfileSlug &&
            a.departmentName === departmentName &&
            a.profileVerificationStatus === "approved" &&
            !batchmates.some((b) => b.id === a.id)
        )
        .slice(0, 3)
    : [];

  if (batchmates.length === 0 && deptPeers.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="alumni-connections-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/60 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)]">
            <Network className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2
              id="alumni-connections-heading"
              className="text-xl sm:text-2xl font-black text-white tracking-tight"
            >
              Ravenshaw Connections
            </h2>
            <p className="text-xs text-white/70">
              Verified fellow alumni from shared academic batches and departments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {batchmates.length > 0 && (
            <div className="rm-glass-card rounded-2xl p-5 border border-white/10 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-rm-gold)]">
                From the Same Batch ({batch})
              </h3>
              <div className="space-y-3">
                {batchmates.map((peer) => (
                  <Link
                    key={peer.id}
                    href={`/profile/${peer.slug}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--color-rm-gold)]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-xs font-bold text-[var(--color-rm-gold)] shrink-0">
                        <GraduationCap className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-bold text-white">
                        {peer.publicDisplayName || peer.fullName}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[var(--color-rm-gold)]">
                      View
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {deptPeers.length > 0 && (
            <div className="rm-glass-card rounded-2xl p-5 border border-white/10 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[var(--color-rm-gold)]">
                From the Same Department ({departmentName})
              </h3>
              <div className="space-y-3">
                {deptPeers.map((peer) => (
                  <Link
                    key={peer.id}
                    href={`/profile/${peer.slug}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--color-rm-gold)]/40 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-xs font-bold text-[var(--color-rm-gold)] shrink-0">
                        <GraduationCap className="w-4 h-4" aria-hidden="true" />
                      </div>
                      <span className="text-sm font-bold text-white">
                        {peer.publicDisplayName || peer.fullName}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-[var(--color-rm-gold)]">
                      View
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
