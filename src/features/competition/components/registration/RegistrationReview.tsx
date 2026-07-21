"use client";

import React from "react";
import {
  CheckCircle2,
  Edit3,
  User,
  Users,
  Mail,
  Award,
  ShieldCheck,
} from "lucide-react";
import { CompetitionItem } from "../../types/competition";
import {
  CompetitionRegistrationFormData,
  RegistrationStep,
} from "../../types/registration";
import { evaluateEligibility } from "./EligibilityCheck";

export interface RegistrationReviewProps {
  competition: CompetitionItem;
  formData: CompetitionRegistrationFormData;
  onEditStep: (step: RegistrationStep) => void;
}

export const RegistrationReview: React.FC<RegistrationReviewProps> = ({
  competition,
  formData,
  onEditStep,
}) => {
  const eligibility = evaluateEligibility(competition, formData);
  const isTeam =
    competition.teamAllowed || competition.participationMode === "Team";

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-black text-white">
            Review Your Registration Entry
          </h3>
          <p className="text-xs text-white/70">
            Please verify all details below before preparing your registration entry.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[var(--color-rm-maroon)] text-xs font-bold text-[var(--color-rm-gold)]">
          Step 4 of 4
        </span>
      </div>

      {/* 1. Participant & Origin Summary */}
      <section className="p-5 rounded-2xl bg-black/40 border border-white/15 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-[var(--color-rm-gold)] font-bold">
            <User className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm uppercase tracking-wider">
              Participant Information
            </span>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-rm-gold)] hover:text-white transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Edit</span>
          </button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div>
            <dt className="text-white/60 font-semibold">Origin</dt>
            <dd className="font-extrabold text-white">
              {formData.participantOrigin}
            </dd>
          </div>

          {formData.participantOrigin === "Ravenshawvian" ? (
            <>
              <div>
                <dt className="text-white/60 font-semibold">Connection</dt>
                <dd className="font-extrabold text-[var(--color-rm-gold)]">
                  Ravenshaw {formData.ravenshawParticipantType}
                </dd>
              </div>
              <div>
                <dt className="text-white/60 font-semibold">Full Name</dt>
                <dd className="font-extrabold text-white">{formData.fullName}</dd>
              </div>
              <div>
                <dt className="text-white/60 font-semibold">Department</dt>
                <dd className="font-extrabold text-white">{formData.department}</dd>
              </div>
              <div>
                <dt className="text-white/60 font-semibold">Academic Level / Batch</dt>
                <dd className="font-extrabold text-white">
                  {formData.academicLevel} ({formData.batchOrSession})
                </dd>
              </div>
            </>
          ) : (
            <>
              <div>
                <dt className="text-white/60 font-semibold">Full Name</dt>
                <dd className="font-extrabold text-white">{formData.fullName}</dd>
              </div>
              <div>
                <dt className="text-white/60 font-semibold">Institution</dt>
                <dd className="font-extrabold text-[var(--color-rm-gold)]">
                  {formData.externalInstitutionName}
                </dd>
              </div>
              <div>
                <dt className="text-white/60 font-semibold">Course & Level</dt>
                <dd className="font-extrabold text-white">
                  {formData.externalProgramme} ({formData.externalAcademicLevel})
                </dd>
              </div>
            </>
          )}
        </dl>
      </section>

      {/* 2. Participation / Team Summary */}
      <section className="p-5 rounded-2xl bg-black/40 border border-white/15 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-[var(--color-rm-gold)] font-bold">
            <Users className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm uppercase tracking-wider">
              Participation Mode
            </span>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-rm-gold)] hover:text-white transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Edit</span>
          </button>
        </div>

        {isTeam ? (
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-white/60 font-semibold block">Team Name</span>
                <strong className="text-white">{formData.teamName || "N/A"}</strong>
              </div>
              <div>
                <span className="text-white/60 font-semibold block">Team Leader</span>
                <strong className="text-white">
                  {formData.teamLeaderName || formData.fullName}
                </strong>
              </div>
            </div>

            <div>
              <span className="text-white/60 font-semibold block mb-1">
                Registered Team Members ({formData.teamMembers.length})
              </span>
              {formData.teamMembers.length > 0 ? (
                <ul className="space-y-1 pl-2">
                  {formData.teamMembers.map((m, i) => (
                    <li key={m.id} className="text-white/85">
                      {i + 1}. {m.fullName} ({m.academicLevel}
                      {m.departmentName ? ` - ${m.departmentName}` : ""})
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-white/60 italic">
                  No additional members listed
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-white/80">
            <strong>Individual Entry:</strong> Participating as an individual contestant.
          </div>
        )}
      </section>

      {/* 3. Contact & Eligibility Summary */}
      <section className="p-5 rounded-2xl bg-black/40 border border-white/15 space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 text-[var(--color-rm-gold)] font-bold">
            <Mail className="w-4 h-4" aria-hidden="true" />
            <span className="text-sm uppercase tracking-wider">
              Contact & Eligibility
            </span>
          </div>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-rm-gold)] hover:text-white transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Edit</span>
          </button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div>
            <dt className="text-white/60 font-semibold">Email Address</dt>
            <dd className="font-extrabold text-white">{formData.email}</dd>
          </div>
          <div>
            <dt className="text-white/60 font-semibold">Phone / WhatsApp</dt>
            <dd className="font-extrabold text-white">{formData.phone}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-white/60 font-semibold">Eligibility Status</dt>
            <dd className="font-extrabold text-emerald-300">
              {eligibility.status}: {eligibility.headline}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
};
