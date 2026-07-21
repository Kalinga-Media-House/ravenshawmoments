"use client";

import React from "react";
import { Users, Globe, ShieldCheck } from "lucide-react";
import { CompetitionItem } from "../types/competition";

export interface CompetitionEligibilityProps {
  competition: CompetitionItem;
}

export const CompetitionEligibility: React.FC<CompetitionEligibilityProps> = ({
  competition,
}) => {
  return (
    <section aria-labelledby="who-can-participate-heading" className="space-y-6">
      <div 
        className="rounded-3xl p-6 sm:p-8 lg:p-10 space-y-6"
        style={{
          background: 'linear-gradient(135deg, #32000D 0%, #500619 50%, #690B27 100%)',
          border: '1px solid rgba(228, 181, 54, 0.28)',
          boxShadow: '0 10px 28px rgba(61, 0, 18, 0.16)'
        }}
      >
        <div className="flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#32000D', border: '1px solid rgba(228, 181, 54, 0.50)', color: '#E4B536' }}>
            <Users className="w-5 h-5" aria-hidden="true" />
          </div>
          <h2
            id="who-can-participate-heading"
            className="text-xl sm:text-2xl font-black tracking-tight"
            style={{ color: '#FFFFFF' }}
          >
            Who Can Participate?
          </h2>
        </div>

        {/* Primary eligibility statement */}
        <div 
          className="p-4 sm:p-5 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.10)'
          }}
        >
          <p className="text-sm sm:text-base font-bold leading-relaxed" style={{ color: '#FFFFFF' }}>
            {competition.eligibility}
          </p>
        </div>

        {/* Ravenshaw participant explanation */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#E4B536' }}>
            Ravenshaw Community Participants
          </h3>
          <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.80)' }}>
            Eligible categories include Ravenshaw University{" "}
            {competition.eligibleParticipantTypes?.join(", ")}. Your Ravenshaw Moments
            profile may be used to verify approved academic and community information during
            registration.
          </p>
        </div>

        {/* External participant eligibility when supported */}
        {competition.externalParticipantsAllowed && (
          <div 
            className="p-5 rounded-2xl space-y-3"
            style={{
              background: '#410012',
              border: '1px solid rgba(228, 181, 54, 0.40)'
            }}
          >
            <div className="flex items-center gap-2 font-extrabold text-xs sm:text-sm uppercase tracking-wide" style={{ color: '#E4B536' }}>
              <Globe className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>External College & University Participation</span>
            </div>

            <p className="text-xs sm:text-sm font-medium leading-relaxed" style={{ color: '#FFFFFF' }}>
              Eligible participants from other colleges or universities may participate.
              Competition-specific eligibility conditions apply.
            </p>

            <p className="text-xs leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
              Participants from other colleges or universities may participate only in
              eligible State Level competitions when explicitly permitted by the competition
              configuration. College or university information and current academic level may
              be required during registration.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
