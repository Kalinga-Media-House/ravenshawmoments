import React from "react";
import Link from "next/link";
import { Edit3, Lock, PlusCircle, LayoutDashboard } from "lucide-react";

interface AlumniOwnerActionsProps {
  isOwner: boolean;
}

export const AlumniOwnerActions: React.FC<AlumniOwnerActionsProps> = ({
  isOwner,
}) => {
  if (!isOwner) {
    return null;
  }

  return (
    <section aria-label="Profile Owner Actions" className="py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto rm-glass-card rounded-2xl p-4 sm:p-5 border border-[var(--color-rm-gold)]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <h2 className="text-sm font-black text-white uppercase tracking-wider">
            Your Profile Management
          </h2>
          <p className="text-xs text-white/70">
            You are signed in as the owner of this Alumni profile.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          <Link
            href="/dashboard/profile/edit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/40 text-[var(--color-rm-gold)] text-xs font-black uppercase tracking-wider hover:bg-[var(--color-rm-maroon)]/80 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Edit Profile</span>
          </Link>

          <Link
            href="/dashboard/profile/privacy"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/15 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Manage Privacy</span>
          </Link>

          <Link
            href="/memories/submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/15 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add Memory</span>
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/40 border border-white/15 text-[var(--color-rm-gold)] text-xs font-bold uppercase tracking-wider hover:border-[var(--color-rm-gold)] transition-colors"
          >
            <LayoutDashboard className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Dashboard</span>
          </Link>
        </div>
      </div>
    </section>
  );
};
