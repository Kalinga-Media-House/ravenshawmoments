"use client";

import React from "react";
import Link from "next/link";
import { Building2, Calendar, ArrowRight, Award } from "lucide-react";
import { CompetitionItem } from "../types/competition";

export interface CompetitionOrganizerProps {
  competition: CompetitionItem;
}

export const CompetitionOrganizer: React.FC<CompetitionOrganizerProps> = ({
  competition,
}) => {
  const getOrganizerRoute = () => {
    if (competition.organizerType === "Department" && competition.organizerSlug) {
      return `/departments/${competition.organizerSlug}`;
    }
    if (competition.organizerType === "Hostel" && competition.organizerSlug) {
      return `/hostels/${competition.organizerSlug}`;
    }
    if (competition.organizerType === "Organization" && competition.organizerSlug) {
      return `/organizations/${competition.organizerSlug}`;
    }
    return null;
  };

  const organizerRoute = getOrganizerRoute();

  return (
    <div className="space-y-6">
      {/* Organized By block */}
      <section aria-labelledby="organized-by-heading">
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
              <Building2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <h2
              id="organized-by-heading"
              className="text-xl sm:text-2xl font-black tracking-tight"
              style={{ color: '#FFFFFF' }}
            >
              Organized By
            </h2>
          </div>

          <div 
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-2xl"
            style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
          >
            <div className="space-y-1.5">
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#E4B536' }}>
                {competition.organizerType || "Organization"} Organizer
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold" style={{ color: '#FFFFFF' }}>
                {competition.organizerName}
              </h3>
              <p className="text-xs sm:text-sm" style={{ color: 'rgba(255, 255, 255, 0.75)' }}>
                Official {(competition.organizerType || "organization").toLowerCase()} coordinator for the{" "}
                {competition.title}.
              </p>
            </div>

            {organizerRoute ? (
              <Link
                href={organizerRoute}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow shrink-0"
                style={{ background: '#500619', border: '1px solid rgba(228, 181, 54, 0.60)', color: '#FFFFFF' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#690B27';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#500619';
                }}
              >
                <span>View Organizer</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            ) : (
              <span 
                className="px-4 py-2 rounded-xl text-xs font-bold shrink-0"
                style={{ background: 'rgba(255, 255, 255, 0.10)', color: 'rgba(255, 255, 255, 0.80)' }}
              >
                Institutional Unit
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Part of This Event block when relationship exists */}
      {competition.eventSlug && (
        <section aria-labelledby="part-of-event-heading">
          <div 
            className="rounded-3xl p-6 sm:p-8 lg:p-10 space-y-6"
            style={{
              background: 'linear-gradient(145deg, #39000F 0%, #55071D 55%, #710D2B 100%)',
              border: '1px solid rgba(228, 181, 54, 0.28)',
              boxShadow: '0 10px 28px rgba(61, 0, 18, 0.16)'
            }}
          >
            <div className="flex items-center gap-3 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#32000D', border: '1px solid rgba(228, 181, 54, 0.50)', color: '#E4B536' }}>
                <Calendar className="w-5 h-5" aria-hidden="true" />
              </div>
              <h2
                id="part-of-event-heading"
                className="text-xl sm:text-2xl font-black tracking-tight"
                style={{ color: '#FFFFFF' }}
              >
                Part of This Event
              </h2>
            </div>

            <div 
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-2xl"
              style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.10)' }}
            >
              <div className="space-y-1.5">
                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#E4B536' }}>
                  Associated Campus Event
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold" style={{ color: '#FFFFFF' }}>
                  {competition.eventName || competition.title}
                </h3>
                <p className="text-xs sm:text-sm" style={{ color: 'rgba(255, 255, 255, 0.80)' }}>
                  Discover schedule, performances, and overall championship details for this
                  event.
                </p>
              </div>

              <Link
                href={`/events/${competition.eventSlug}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow shrink-0"
                style={{ background: '#500619', border: '1px solid rgba(228, 181, 54, 0.60)', color: '#FFFFFF' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#690B27';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#500619';
                }}
              >
                <span>View Event</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
