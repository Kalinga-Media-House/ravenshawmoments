"use client";

import React from "react";
import Link from "next/link";
import {
  Clock,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import { CompetitionItem } from "../types/competition";
import { computeRegistrationStatus } from "../utils/competitionStatus";

export interface CompetitionRegistrationProps {
  competition: CompetitionItem;
}

export const CompetitionRegistration: React.FC<CompetitionRegistrationProps> = ({
  competition,
}) => {
  const regStatus = computeRegistrationStatus(competition);

  const formattedDeadline = competition.registrationDeadline
    ? new Date(competition.registrationDeadline).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const isRegistrationNotRequired = regStatus === "Registration Not Required";
  const isRegistrationClosed = regStatus === "Registration Closed";

  return (
    <aside aria-label="Competition registration summary" className="space-y-6">
      <div 
        className="rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 sticky top-28"
        style={{
          background: 'linear-gradient(145deg, #39000F 0%, #55071D 55%, #710D2B 100%)',
          border: '1px solid rgba(228, 181, 54, 0.28)'
        }}
      >
        <div className="flex items-center justify-between gap-3 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <span className="text-sm font-extrabold uppercase tracking-wider" style={{ color: '#E4B536' }}>
            Registration Status
          </span>
          <span 
            className="px-3 py-1 rounded-full text-xs font-bold shadow"
            style={{
              background: 'rgba(27, 0, 8, 0.84)',
              border: '1px solid rgba(255, 255, 255, 0.20)',
              color: '#FFFFFF'
            }}
          >
            {regStatus}
          </span>
        </div>

        {/* Fee & Seats */}
        {!isRegistrationNotRequired && (
          <div 
            className="flex items-center justify-between gap-4 p-4 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.10)'
            }}
          >
            <div>
              <span className="text-xs font-semibold block uppercase" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                Registration Fee
              </span>
              <span className="text-xl font-black" style={{ color: '#E4B536' }}>
                {competition.registrationFee && competition.registrationFee > 0
                  ? `₹${competition.registrationFee}`
                  : "Free Registration"}
              </span>
            </div>
            {typeof competition.availableSeats === "number" && (
              <div className="text-right">
                <span className="text-xs font-semibold block uppercase" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                  Seats Left
                </span>
                <span className="text-sm font-extrabold" style={{ color: '#FFFFFF' }}>
                  {competition.availableSeats} / {competition.totalSeats}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Deadline block */}
        {!isRegistrationNotRequired && formattedDeadline && (
          <div className="flex items-center gap-3 text-xs" style={{ color: 'rgba(255, 255, 255, 0.80)' }}>
            <Clock className="w-4 h-4 shrink-0" style={{ color: '#E4B536' }} aria-hidden="true" />
            <span>
              <strong style={{ color: '#FFFFFF' }}>Registration Deadline:</strong>{" "}
              {formattedDeadline}
            </span>
          </div>
        )}

        {/* Eligibility summary */}
        <div className="flex items-start gap-3 text-xs" style={{ color: 'rgba(255, 255, 255, 0.80)' }}>
          <Users className="w-4 h-4 shrink-0 mt-0.5" style={{ color: '#E4B536' }} aria-hidden="true" />
          <span>
            <strong style={{ color: '#FFFFFF' }}>Eligibility:</strong> {competition.eligibility}
          </span>
        </div>

        {/* Action Panel Behaviour */}
        {/* Action Panel Behaviour */}
        <div className="pt-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)' }}>
          {isRegistrationNotRequired ? (
            <div 
              className="p-4 rounded-2xl text-center space-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <span className="text-xs font-extrabold uppercase tracking-wide block" style={{ color: '#FFFFFF' }}>
                No Registration Required
              </span>
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.70)' }}>
                Participation is open without prior registration per event instructions.
              </p>
            </div>
          ) : isRegistrationClosed ? (
            <div 
              className="p-4 rounded-2xl text-center space-y-1"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
            >
              <span className="text-xs font-extrabold uppercase tracking-wide block" style={{ color: '#FFFFFF' }}>
                Registration Closed
              </span>
              <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.70)' }}>
                The registration deadline has passed or results have been published.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              <Link
                href={`/competitions/${competition.slug}/register`}
                className="w-full min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all duration-300 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4B536]"
                style={{
                  background: '#500619',
                  border: '1px solid rgba(228, 181, 54, 0.60)',
                  color: '#FFFFFF'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#690B27';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#500619';
                }}
              >
                <span>Register Online</span>
              </Link>
              {competition.externalRegistrationUrl && (
                <a
                  href={competition.externalRegistrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full min-h-[42px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E4B536]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.20)',
                    color: '#FFFFFF'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.10)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  <span className="text-xs font-bold">External Portal Link</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Team Participation Block (Section 12) */}
      {competition.teamAllowed && (
        <div 
          className="rounded-3xl p-6 sm:p-7 space-y-4"
          style={{
            background: '#410012',
            border: '1px solid rgba(228, 181, 54, 0.20)'
          }}
        >
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 shrink-0" style={{ color: '#E4B536' }} aria-hidden="true" />
            <h3 className="text-base font-extrabold" style={{ color: '#FFFFFF' }}>Team Participation</h3>
          </div>

          <dl className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center justify-between gap-3 pb-2" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <dt className="font-semibold" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>Team Size Range</dt>
              <dd className="font-extrabold" style={{ color: '#FFFFFF' }}>
                {competition.minimumTeamSize || 1} to {competition.maximumTeamSize || 10}{" "}
                members
              </dd>
            </div>

            <div className="flex items-center justify-between gap-3 pb-2" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <dt className="font-semibold" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>Team Leader Required</dt>
              <dd className="font-extrabold" style={{ color: '#E4B536' }}>
                {competition.teamLeaderRequired !== false ? "Yes" : "Optional"}
              </dd>
            </div>

            {competition.teamMemberEligibility && (
              <div className="pt-1">
                <dt className="font-semibold block mb-1" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                  Team Member Eligibility
                </dt>
                <dd className="leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.80)' }}>
                  {competition.teamMemberEligibility}
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}
    </aside>
  );
};
