"use client";

import React from "react";
import { Award, ShieldAlert, Sparkles, CreditCard } from "lucide-react";
import { CompetitionItem } from "../../types/competition";

export interface RegistrationFeeSummaryProps {
  competition: CompetitionItem;
}

export const RegistrationFeeSummary: React.FC<RegistrationFeeSummaryProps> = ({
  competition,
}) => {
  const isFree = !competition.registrationFee || competition.registrationFee <= 0;

  return (
    <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-white/15 bg-black/40 space-y-4">
      <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Award className="w-5 h-5 text-[var(--color-rm-gold)]" aria-hidden="true" />
          <h3 className="text-base font-extrabold text-white">
            Registration Fee Summary
          </h3>
        </div>
        <span className="text-lg sm:text-xl font-black text-[var(--color-rm-gold)]">
          {isFree ? "Free Registration" : `₹${competition.registrationFee} ${competition.currency || "INR"}`}
        </span>
      </div>

      <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
        {isFree
          ? "There is no registration fee required to participate in this competition."
          : `An official participation fee of ₹${competition.registrationFee} applies per registered entry per competition guidelines.`}
      </p>

      {/* Honest Architectural Status Banner */}
      <div className="p-4 rounded-xl bg-[var(--color-rm-maroon)]/40 border border-[var(--color-rm-gold)]/50 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-rm-gold)]">
          <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Online Payment Integration Is Being Prepared</span>
        </div>
        <p className="text-xs text-white/80 leading-relaxed">
          Secure online payment is not active yet. Per architectural integrity rules, we do
          not simulate fake payment gateways or test charges. Registration details remain
          safely structured for review.
        </p>
      </div>
    </div>
  );
};
