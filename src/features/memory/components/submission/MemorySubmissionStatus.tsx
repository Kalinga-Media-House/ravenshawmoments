"use client";

import React from "react";
import Link from "next/link";
import { Clock, ArrowLeft, BookOpen, ShieldAlert } from "lucide-react";

export interface MemorySubmissionStatusProps {
  onReturnToEdit?: () => void;
}

export const MemorySubmissionStatus: React.FC<MemorySubmissionStatusProps> = ({
  onReturnToEdit,
}) => {
  // FUTURE INTEGRATION NOTE:
  // When the server-side submission service and moderation workflow are enabled,
  // this component can also render the "Memory Submitted for Review" state with
  // actual submission tracking reference ID. Currently, per architectural mandate,
  // we do not simulate fake backend storage.

  return (
    <div className="rm-glass-card rounded-3xl p-8 sm:p-12 border border-white/15 bg-black/40 text-center max-w-2xl mx-auto space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-[var(--color-rm-maroon)] border border-[var(--color-rm-gold)]/50 flex items-center justify-center mx-auto text-[var(--color-rm-gold)] shadow-xl">
        <Clock className="w-8 h-8" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-rm-gold)] block">
          Development Status
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Memory Submission Is Being Prepared
        </h2>
        <p className="text-sm sm:text-base text-white/70 max-w-lg mx-auto leading-relaxed">
          The contribution form is ready, but secure submission and review integration is not active yet.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs sm:text-sm text-white/80 space-y-2">
        <div className="flex items-center gap-2 text-[var(--color-rm-gold)] font-bold">
          <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Architectural Integrity Note</span>
        </div>
        <p className="text-white/70 leading-relaxed">
          To protect community privacy and preserve data integrity, submissions require authenticated server-side validation and secure Supabase Storage pipeline integration before publication. Your entered form state has been validated locally.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        {onEditButton(onReturnToEdit)}

        <Link
          href="/memories"
          className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-rm-maroon)] hover:bg-[var(--color-rm-maroon)]/90 border border-[var(--color-rm-gold)]/60 text-xs sm:text-sm font-extrabold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          Explore Memories
        </Link>

        <Link
          href="/"
          className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Return Home
        </Link>
      </div>
    </div>
  );
};

function onEditButton(onReturnToEdit?: () => void) {
  if (!onReturnToEdit) return null;
  return (
    <button
      type="button"
      onClick={onReturnToEdit}
      className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-xs sm:text-sm font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
    >
      Return to Review Form
    </button>
  );
}
