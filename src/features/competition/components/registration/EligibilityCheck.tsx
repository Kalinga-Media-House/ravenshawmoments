"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from "lucide-react";
import { CompetitionItem, ParticipantType } from "../../types/competition";
import {
  CompetitionRegistrationFormData,
  EligibilityEvaluationResult,
} from "../../types/registration";

export interface EligibilityCheckProps {
  competition: CompetitionItem;
  formData: CompetitionRegistrationFormData;
}

export function evaluateEligibility(
  competition: CompetitionItem,
  formData: CompetitionRegistrationFormData
): EligibilityEvaluationResult {
  const isExternal = formData.participantOrigin === "External";

  // 1. Check if external participant when external participation is blocked
  if (isExternal && competition.externalParticipantsAllowed !== true) {
    return {
      status: "Not Eligible",
      headline: "External Participation Not Permitted",
      message:
        "Based on the available competition rules, this registration cannot continue because the competition is currently open only to eligible Ravenshaw participants.",
    };
  }

  // 2. Check Ravenshaw participant type against eligibleParticipantTypes
  if (!isExternal) {
    const allowedTypes = competition.eligibleParticipantTypes || ["Student"];
    if (!allowedTypes.includes(formData.ravenshawParticipantType as ParticipantType)) {
      return {
        status: "Not Eligible",
        headline: `${formData.ravenshawParticipantType} Participation Unsupported`,
        message: `Based on the available competition rules, this registration cannot continue because the competition is restricted to: ${allowedTypes.join(
          ", "
        )}.`,
      };
    }
  }

  // 3. Check if review is required for external participants
  if (isExternal) {
    return {
      status: "Eligibility Review Required",
      headline: "External Participant Verification Required",
      message:
        "Your registration requires verification before confirmation. Our event coordinators will verify institutional credentials prior to stage or event check-in.",
      details: [
        `Verified Institution: ${formData.externalInstitutionName || "Pending entry"}`,
        `Competition Level: ${competition.level} Level`,
      ],
    };
  }

  // 4. Default Ravenshawvian eligible
  return {
    status: "Eligible",
    headline: "You Are Eligible to Participate",
    message:
      "You meet the currently available eligibility requirements for this competition.",
    details: [
      `Participant Connection: Ravenshaw ${formData.ravenshawParticipantType}`,
      `Verified Rule: ${competition.eligibility}`,
    ],
  };
}

export const EligibilityCheck: React.FC<EligibilityCheckProps> = ({
  competition,
  formData,
}) => {
  const evalResult = evaluateEligibility(competition, formData);

  const isEligible = evalResult.status === "Eligible";
  const isReview = evalResult.status === "Eligibility Review Required";

  return (
    <section
      aria-labelledby="eligibility-eval-heading"
      className={`p-5 sm:p-6 rounded-2xl border transition-all ${
        isEligible
          ? "bg-emerald-950/30 border-emerald-500/50"
          : isReview
          ? "bg-amber-950/30 border-amber-500/50"
          : "bg-rose-950/30 border-rose-500/50"
      }`}
    >
      <div className="flex items-start gap-4">
        {isEligible ? (
          <CheckCircle2
            className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5"
            aria-hidden="true"
          />
        ) : isReview ? (
          <AlertTriangle
            className="w-6 h-6 text-amber-400 shrink-0 mt-0.5"
            aria-hidden="true"
          />
        ) : (
          <XCircle
            className="w-6 h-6 text-rose-400 shrink-0 mt-0.5"
            aria-hidden="true"
          />
        )}

        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span
              id="eligibility-eval-heading"
              className="text-xs font-black uppercase tracking-wider text-white/70"
            >
              Eligibility Evaluation Status
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                isEligible
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : isReview
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
              }`}
            >
              {evalResult.status}
            </span>
          </div>

          <h4 className="text-base sm:text-lg font-black text-white">
            {evalResult.headline}
          </h4>

          <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-medium">
            {evalResult.message}
          </p>

          {evalResult.details && evalResult.details.length > 0 && (
            <ul className="pt-2 space-y-1 text-xs text-white/75">
              {evalResult.details.map((detail, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-[var(--color-rm-gold)] shrink-0"
                    aria-hidden="true"
                  />
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
};
