"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  MapPin,
  Award,
  Users,
  FileCheck,
  Tag,
  Globe,
  AlertCircle,
  HelpCircle,
  Mail,
} from "lucide-react";
import { CompetitionItem } from "../types/competition";

export interface CompetitionInformationProps {
  competition: CompetitionItem;
}

export const CompetitionInformation: React.FC<CompetitionInformationProps> = ({
  competition,
}) => {
  const formattedStartDate = new Date(competition.startDate).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );

  const formattedRegOpen = competition.registrationOpenAt
    ? new Date(competition.registrationOpenAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const formattedDeadline = competition.registrationDeadline
    ? new Date(competition.registrationDeadline).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const renderOrganizerLink = () => {
    let href: string | null = null;
    if (competition.organizerType === "Department" && competition.organizerSlug) {
      href = `/departments/${competition.organizerSlug}`;
    } else if (competition.organizerType === "Hostel" && competition.organizerSlug) {
      href = `/hostels/${competition.organizerSlug}`;
    } else if (
      competition.organizerType === "Organization" &&
      competition.organizerSlug
    ) {
      href = `/organizations/${competition.organizerSlug}`;
    }

    if (href) {
      return (
        <Link
          href={href}
          className="hover:underline font-bold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#E4B536] rounded"
          style={{ color: '#E4B536' }}
        >
          {competition.organizerName}
        </Link>
      );
    }
    return <span className="font-bold" style={{ color: '#FFFFFF' }}>{competition.organizerName}</span>;
  };

  return (
    <aside aria-label="Competition quick information" className="space-y-6">
      {/* Quick Information Panel */}
      <div 
        className="rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6"
        style={{
          background: 'linear-gradient(145deg, #39000F 0%, #55071D 55%, #710D2B 100%)',
          border: '1px solid rgba(228, 181, 54, 0.28)'
        }}
      >
        <div className="flex items-center gap-2.5 pb-4" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#32000D', border: '1px solid rgba(228, 181, 54, 0.40)', color: '#E4B536' }}>
            <Award className="w-4 h-4" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-black tracking-tight" style={{ color: '#FFFFFF' }}>
            Competition Details
          </h2>
        </div>

        <dl className="space-y-4 text-xs sm:text-sm">
          {/* Competition Date */}
          <div className="flex items-start justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <dt className="font-semibold flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
              <Calendar
                className="w-4 h-4 shrink-0"
                style={{ color: '#E4B536' }}
                aria-hidden="true"
              />
              <span>Competition Date</span>
            </dt>
            <dd className="font-extrabold text-right" style={{ color: '#FFFFFF' }}>
              {formattedStartDate}
              {competition.startTime && (
                <span className="block text-xs font-normal" style={{ color: 'rgba(255, 255, 255, 0.70)' }}>
                  Starts at {competition.startTime}
                </span>
              )}
            </dd>
          </div>

          {/* Registration Opening */}
          {formattedRegOpen && (
            <div className="flex items-start justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <dt className="font-semibold flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                <Clock
                  className="w-4 h-4 shrink-0"
                  style={{ color: '#E4B536' }}
                  aria-hidden="true"
                />
                <span>Registration Opening</span>
              </dt>
              <dd className="font-bold text-right" style={{ color: '#FFFFFF' }}>{formattedRegOpen}</dd>
            </div>
          )}

          {/* Registration Deadline */}
          {formattedDeadline && (
            <div className="flex items-start justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <dt className="font-semibold flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                <Clock
                  className="w-4 h-4 shrink-0"
                  style={{ color: '#E4B536' }}
                  aria-hidden="true"
                />
                <span>Registration Deadline</span>
              </dt>
              <dd className="font-extrabold text-right" style={{ color: '#E4B536' }}>
                {formattedDeadline}
              </dd>
            </div>
          )}

          {/* Venue & Mode */}
          <div className="flex items-start justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <dt className="font-semibold flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
              <MapPin
                className="w-4 h-4 shrink-0"
                style={{ color: '#E4B536' }}
                aria-hidden="true"
              />
              <span>Venue</span>
            </dt>
            <dd className="font-bold text-right" style={{ color: '#FFFFFF' }}>
              {competition.venue}
              <span className="block text-xs font-normal" style={{ color: '#E4B536' }}>
                {competition.mode} Mode
              </span>
            </dd>
          </div>

          {/* Category & Level */}
          <div className="flex items-start justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <dt className="font-semibold flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
              <Tag
                className="w-4 h-4 shrink-0"
                style={{ color: '#E4B536' }}
                aria-hidden="true"
              />
              <span>Category</span>
            </dt>
            <dd className="font-bold text-right" style={{ color: '#FFFFFF' }}>
              {competition.category} ({competition.level} Level)
            </dd>
          </div>

          {/* Organizer */}
          {competition.organizerName && (
            <div className="flex items-start justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <dt className="font-semibold flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                <Award
                  className="w-4 h-4 shrink-0"
                  style={{ color: '#E4B536' }}
                  aria-hidden="true"
                />
                <span>Organized By</span>
              </dt>
              <dd className="text-right">{renderOrganizerLink()}</dd>
            </div>
          )}

          {/* Participation Mode */}
          <div className="flex items-start justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <dt className="font-semibold flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
              <Users
                className="w-4 h-4 shrink-0"
                style={{ color: '#E4B536' }}
                aria-hidden="true"
              />
              <span>Participation Type</span>
            </dt>
            <dd className="font-bold text-right">
              <p className="text-xs sm:text-sm">
                <strong style={{ color: '#FFFFFF' }}>Participation Mode:</strong>{" "}
                {competition.participationMode || "Not Specified"}
              </p>
              {competition.teamAllowed &&
                competition.minimumTeamSize &&
                competition.maximumTeamSize && (
                  <span className="block text-xs font-normal" style={{ color: 'rgba(255, 255, 255, 0.70)' }}>
                    Team size: {competition.minimumTeamSize} to {competition.maximumTeamSize}{" "}
                    members
                  </span>
                )}
            </dd>
          </div>

          {/* Available Seats */}
          {typeof competition.availableSeats === "number" &&
            typeof competition.totalSeats === "number" && (
              <div className="flex items-start justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <dt className="font-semibold" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>Available Seats</dt>
                <dd className="font-extrabold text-right" style={{ color: '#FFFFFF' }}>
                  {competition.availableSeats} of {competition.totalSeats} seats
                </dd>
              </div>
            )}

          {/* Fee */}
          <div className="flex items-start justify-between gap-4 pb-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)' }}>
            <dt className="font-semibold" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>Registration Fee</dt>
            <dd className="font-extrabold text-right" style={{ color: '#E4B536' }}>
              {competition.registrationFee && competition.registrationFee > 0
                ? `₹${competition.registrationFee}`
                : "Free Registration"}
            </dd>
          </div>

          {/* Certificate Availability */}
          {competition.certificateAvailable && (
            <div className="flex items-center justify-between gap-4 pt-1">
              <dt className="font-semibold flex items-center gap-2" style={{ color: 'rgba(255, 255, 255, 0.60)' }}>
                <FileCheck
                  className="w-4 h-4 shrink-0"
                  style={{ color: '#E4B536' }}
                  aria-hidden="true"
                />
                <span>Certificate</span>
              </dt>
              <dd className="font-bold text-right" style={{ color: '#FFFFFF' }}>
                Verified Certificate Available
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Important Information Block */}
      {competition.importantInformation &&
        competition.importantInformation.length > 0 && (
          <div 
            className="rounded-3xl p-6 sm:p-7 space-y-4"
            style={{
              background: '#410012',
              border: '1px solid rgba(228, 181, 54, 0.20)'
            }}
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle
                className="w-5 h-5 shrink-0"
                style={{ color: '#E4B536' }}
                aria-hidden="true"
              />
              <h3 className="text-base font-extrabold" style={{ color: '#FFFFFF' }}>
                Important Information
              </h3>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm" style={{ color: 'rgba(255, 255, 255, 0.80)' }}>
              {competition.importantInformation.map((info, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                    style={{ background: '#E4B536' }}
                    aria-hidden="true"
                  />
                  <span>{typeof info === "string" ? info : info.content}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
    </aside>
  );
};
