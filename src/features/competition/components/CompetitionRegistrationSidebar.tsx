"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Building2,
  Mail,
  IndianRupee,
  Globe,
  Video
} from "lucide-react";
import { CompetitionItem } from "../types/competition";
import { computeRegistrationStatus, DEFAULT_COMPETITION_CURRENCY } from "../utils/competitionStatus";

export interface CompetitionRegistrationSidebarProps {
  competition: CompetitionItem;
}

export const CompetitionRegistrationSidebar: React.FC<CompetitionRegistrationSidebarProps> = ({
  competition,
}) => {
  const regStatus = computeRegistrationStatus(competition);

  const formattedStartDate = competition.startsAt 
    ? new Date(competition.startsAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : competition.startDate
      ? new Date(competition.startDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "To be announced";

  const startTime = competition.startsAt
    ? new Date(competition.startsAt).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : competition.startTime;

  const isRegistrationOpen = regStatus === "Registration Open";
  const isWaitlist = regStatus === "Waitlist Available";
  
  const getModeIcon = () => {
    switch(competition.mode?.toLowerCase()) {
      case 'online': return <Video className="w-5 h-5 text-stone-400" />;
      case 'hybrid': return <Globe className="w-5 h-5 text-stone-400" />;
      default: return <MapPin className="w-5 h-5 text-stone-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Action Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6 relative overflow-hidden">
        {/* Subtle decorative accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-rm-gold opacity-10 rounded-bl-full pointer-events-none" />

        <div className="space-y-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
            isRegistrationOpen ? 'bg-green-100 text-green-800' : 
            isWaitlist ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-600'
          }`}>
            {regStatus}
          </span>
          <h3 className="text-xl font-bold text-stone-900">
            {competition.registrationFee !== undefined
              ? competition.registrationFee > 0
                ? new Intl.NumberFormat("en-IN", { style: "currency", currency: competition.currency || DEFAULT_COMPETITION_CURRENCY, maximumFractionDigits: 0 }).format(competition.registrationFee)
                : "Free Entry"
              : "Fee: To be announced"}
          </h3>
          {competition.totalSeats && competition.availableSeats !== undefined && (
            <p className="text-sm text-stone-500 font-medium">
              {competition.availableSeats} / {competition.totalSeats} seats remaining
            </p>
          )}
          <p className="text-sm text-stone-500 font-medium">
            {competition.allowTeam ? `Team Size: ${competition.minTeamSize}-${competition.maxTeamSize} members` : 'Individual Participation'}
          </p>
        </div>

        {competition.registrationRequired && (
          <div className="pt-2">
            {isRegistrationOpen ? (
              <Link
                href={`/competitions/${competition.slug}/register`}
                className="block w-full py-3 px-4 bg-rm-maroon hover:bg-rm-maroon-dark text-white text-center rounded-xl font-bold transition-colors shadow-sm"
              >
                Register Now
              </Link>
            ) : isWaitlist ? (
              <Link
                href={`/competitions/${competition.slug}/register?waitlist=true`}
                className="block w-full py-3 px-4 bg-stone-800 hover:bg-stone-900 text-white text-center rounded-xl font-bold transition-colors shadow-sm"
              >
                Join Waitlist
              </Link>
            ) : (
              <button
                disabled
                className="block w-full py-3 px-4 bg-stone-100 text-stone-400 text-center rounded-xl font-bold cursor-not-allowed"
              >
                Registration Closed
              </button>
            )}
            {competition.registrationDeadline && (
              <p className="text-xs text-center text-stone-500 mt-3">
                Closes on {new Date(competition.registrationDeadline).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric"
                })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Quick Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-5">
        <h3 className="font-bold text-stone-900 border-b border-stone-100 pb-2">Event Details</h3>
        
        <ul className="space-y-4 text-sm text-stone-600">
          <li className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
            <div>
              <span className="block font-semibold text-stone-900">Date</span>
              <span>{formattedStartDate}</span>
            </div>
          </li>
          
          {startTime && (
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
              <div>
                <span className="block font-semibold text-stone-900">Time</span>
                <span>{startTime}</span>
              </div>
            </li>
          )}
          
          <li className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">{getModeIcon()}</div>
            <div>
              <span className="block font-semibold text-stone-900">
                {competition.mode ? competition.mode.charAt(0).toUpperCase() + competition.mode.slice(1) : 'Offline'}
              </span>
              <span>{competition.venueName || competition.venue || "Ravenshaw Campus"}</span>
              {competition.venueDetails && <span className="block text-xs mt-1 text-stone-500">{competition.venueDetails}</span>}
            </div>
          </li>

          <li className="flex items-start gap-3">
            <Users className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
            <div>
              <span className="block font-semibold text-stone-900">Eligibility</span>
              <span>{competition.eligibleParticipantTypes?.join(", ") || "Open to all students"}</span>
              {competition.externalParticipantsAllowed && (
                <span className="block text-xs mt-1 text-green-600 font-medium">External participants welcome</span>
              )}
            </div>
          </li>
        </ul>
      </div>

      {/* Organizer Card */}
      {competition.organizerName && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
          <h3 className="font-bold text-stone-900 border-b border-stone-100 pb-2">Organized By</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="block font-semibold text-stone-900">{competition.organizerName}</span>
                {competition.organizerType && (
                  <span className="text-stone-500">{competition.organizerType}</span>
                )}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="block font-semibold text-stone-900">Contact Support</span>
                <a href="mailto:support@ravenshawmoments.com" className="text-rm-maroon hover:underline">
                  support@ravenshawmoments.com
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
