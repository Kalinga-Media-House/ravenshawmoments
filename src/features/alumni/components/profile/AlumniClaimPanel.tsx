import React from "react";
import Link from "next/link";
import { UserCheck } from "lucide-react";

interface AlumniClaimPanelProps {
  isOwner: boolean;
  isClaimable?: boolean;
}

export const AlumniClaimPanel: React.FC<AlumniClaimPanelProps> = ({
  isOwner,
  isClaimable,
}) => {
  if (isOwner || !isClaimable) {
    return null;
  }

  return (
    <section aria-label="Profile Claim Panel" className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto rm-glass-card rounded-2xl p-5 border border-[var(--color-rm-gold)]/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[var(--color-rm-maroon)]/80 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)] shrink-0 mt-0.5 sm:mt-0">
            <UserCheck className="w-5 h-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-black text-white">
              Is This Your Profile?
            </h2>
            <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-2xl">
              Claim this profile through the approved verification process to
              manage your public information and preserve your Ravenshaw journey.
            </p>
          </div>
        </div>

        <Link
          href="/profile"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/40 text-[var(--color-rm-gold)] text-xs font-black uppercase tracking-wider hover:bg-[var(--color-rm-maroon)]/80 transition-all shrink-0 shadow-md"
        >
          Claim This Profile
        </Link>
      </div>
    </section>
  );
};
