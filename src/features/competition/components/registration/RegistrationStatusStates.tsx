"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Users,
  ArrowLeft,
  BookOpen,
  ShieldAlert,
} from "lucide-react";
import { CompetitionItem } from "../../types/competition";

export interface RegistrationStatusProps {
  competition: CompetitionItem;
  onReturnToEdit?: () => void;
}

export const RegistrationPreparedState: React.FC<RegistrationStatusProps> = ({
  competition,
  onReturnToEdit,
}) => {
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
          Registration Entry Is Being Prepared
        </h2>
        <p className="text-sm sm:text-base text-white/75 max-w-lg mx-auto leading-relaxed">
          Your entry for <strong className="text-white">{competition.title}</strong> has been
          validated locally. Server-side registration and payment processing pipeline
          integration is being prepared.
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-left text-xs sm:text-sm text-white/80 space-y-2">
        <div className="flex items-center gap-2 text-[var(--color-rm-gold)] font-bold">
          <ShieldAlert className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Architectural Integrity Note</span>
        </div>
        <p className="text-white/70 leading-relaxed">
          Per architectural integrity rules, no fake database records, simulated payments, or false confirmations are created. Once the verified backend tables and RLS policies are connected, entries will be securely written to Supabase.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        {onReturnToEdit && (
          <button
            type="button"
            onClick={onReturnToEdit}
            className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-xs sm:text-sm font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            Return to Review Form
          </button>
        )}

        <Link
          href={`/competitions/${competition.slug}`}
          className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-rm-maroon)] hover:bg-[var(--color-rm-maroon)]/90 border border-[var(--color-rm-gold)]/60 text-xs sm:text-sm font-extrabold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
        >
          <BookOpen className="w-4 h-4" aria-hidden="true" />
          Competition Details
        </Link>

        <Link
          href="/competitions"
          className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          All Competitions
        </Link>
      </div>
    </div>
  );
};

export const RegistrationClosedState: React.FC<RegistrationStatusProps> = ({
  competition,
}) => {
  return (
    <div className="rm-glass-card rounded-3xl p-8 sm:p-12 border border-rose-500/30 bg-black/40 text-center max-w-2xl mx-auto space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center mx-auto text-rose-400 shadow-xl">
        <Lock className="w-8 h-8" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-400 block">
          Registration Closed
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Registration Is Currently Closed
        </h2>
        <p className="text-sm sm:text-base text-white/75 max-w-lg mx-auto leading-relaxed">
          The registration deadline for{" "}
          <strong className="text-white">{competition.title}</strong> has passed or entry limits
          have been reached.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href={`/competitions/${competition.slug}`}
          className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-rm-maroon)] hover:bg-[var(--color-rm-maroon)]/90 border border-[var(--color-rm-gold)]/60 text-xs sm:text-sm font-extrabold text-white transition-colors"
        >
          View Competition Details
        </Link>

        <Link
          href="/competitions"
          className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-bold text-white transition-colors"
        >
          Explore Open Competitions
        </Link>
      </div>
    </div>
  );
};

export const RegistrationNotOpenState: React.FC<RegistrationStatusProps> = ({
  competition,
}) => {
  const openDate = competition.registrationOpenAt
    ? new Date(competition.registrationOpenAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="rm-glass-card rounded-3xl p-8 sm:p-12 border border-amber-500/30 bg-black/40 text-center max-w-2xl mx-auto space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-amber-950/60 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
        <Clock className="w-8 h-8" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block">
          Upcoming Registration
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Registration Opens Soon
        </h2>
        <p className="text-sm sm:text-base text-white/75 max-w-lg mx-auto leading-relaxed">
          Online registration for <strong className="text-white">{competition.title}</strong> will
          open on <strong className="text-[var(--color-rm-gold)]">{openDate || "the scheduled date"}</strong>.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href={`/competitions/${competition.slug}`}
          className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-rm-maroon)] hover:bg-[var(--color-rm-maroon)]/90 border border-[var(--color-rm-gold)]/60 text-xs sm:text-sm font-extrabold text-white transition-colors"
        >
          View Competition Rules & Schedule
        </Link>
      </div>
    </div>
  );
};

export const RegistrationFullState: React.FC<RegistrationStatusProps> = ({
  competition,
}) => {
  return (
    <div className="rm-glass-card rounded-3xl p-8 sm:p-12 border border-rose-500/30 bg-black/40 text-center max-w-2xl mx-auto space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-rose-950/60 border border-rose-500/50 flex items-center justify-center mx-auto text-rose-400 shadow-xl">
        <Users className="w-8 h-8" aria-hidden="true" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-rose-400 block">
          Seats Full
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          All Available Seats Have Been Filled
        </h2>
        <p className="text-sm sm:text-base text-white/75 max-w-lg mx-auto leading-relaxed">
          This competition has reached its maximum participant capacity of{" "}
          {competition.totalSeats} seats.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          href={`/competitions/${competition.slug}`}
          className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-rm-maroon)] hover:bg-[var(--color-rm-maroon)]/90 border border-[var(--color-rm-gold)]/60 text-xs sm:text-sm font-extrabold text-white transition-colors"
        >
          View Competition Details
        </Link>
      </div>
    </div>
  );
};
