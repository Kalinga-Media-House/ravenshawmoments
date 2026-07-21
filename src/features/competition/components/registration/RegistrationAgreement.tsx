"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { CompetitionItem } from "../../types/competition";
import { CompetitionRegistrationFormData } from "../../types/registration";

export interface RegistrationAgreementProps {
  competition: CompetitionItem;
  formData: CompetitionRegistrationFormData;
  onChange: <K extends keyof CompetitionRegistrationFormData>(
    field: K,
    value: CompetitionRegistrationFormData[K]
  ) => void;
  errors?: Partial<Record<keyof CompetitionRegistrationFormData, string>>;
}

export const RegistrationAgreement: React.FC<RegistrationAgreementProps> = ({
  competition,
  formData,
  onChange,
  errors,
}) => {
  return (
    <fieldset className="space-y-4">
      <legend className="text-sm font-extrabold text-[var(--color-rm-gold)] uppercase tracking-wider block">
        Registration Agreement & Verification
      </legend>

      <div className="space-y-3">
        {/* Rule Agreement */}
        <label
          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
            formData.ruleAgreement
              ? "bg-[var(--color-rm-maroon)]/40 border-[var(--color-rm-gold)]"
              : errors?.ruleAgreement
              ? "bg-rose-950/20 border-rose-500/60"
              : "bg-white/5 border-white/15"
          }`}
        >
          <input
            type="checkbox"
            checked={formData.ruleAgreement}
            onChange={(e) => onChange("ruleAgreement", e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[var(--color-rm-gold)]"
          />
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-bold text-white block">
              I have read and agree to follow the competition rules.{" "}
              <span className="text-[var(--color-rm-gold)]">*</span>
            </span>
            <span className="text-xs text-white/70 block">
              All entries must comply with university code of conduct and event instructions.{" "}
              <Link
                href={`/competitions/${competition.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1 text-[var(--color-rm-gold)] underline hover:text-white"
              >
                <span>Read Official Rules</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </span>
          </div>
        </label>
        {errors?.ruleAgreement && (
          <p className="text-xs font-bold text-rose-400 pl-1">
            {errors.ruleAgreement}
          </p>
        )}

        {/* Accuracy Confirmation */}
        <label
          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
            formData.accuracyConfirmation
              ? "bg-[var(--color-rm-maroon)]/40 border-[var(--color-rm-gold)]"
              : errors?.accuracyConfirmation
              ? "bg-rose-950/20 border-rose-500/60"
              : "bg-white/5 border-white/15"
          }`}
        >
          <input
            type="checkbox"
            checked={formData.accuracyConfirmation}
            onChange={(e) => onChange("accuracyConfirmation", e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-[var(--color-rm-gold)]"
          />
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-bold text-white block">
              I confirm that the information provided is accurate to the best of my knowledge.{" "}
              <span className="text-[var(--color-rm-gold)]">*</span>
            </span>
            <span className="text-xs text-white/70 block">
              Providing inaccurate enrollment or institutional credentials may result in
              disqualification.
            </span>
          </div>
        </label>
        {errors?.accuracyConfirmation && (
          <p className="text-xs font-bold text-rose-400 pl-1">
            {errors.accuracyConfirmation}
          </p>
        )}

        {/* Verification Acknowledgement */}
        <label
          className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
            formData.verificationAcknowledgement
              ? "bg-[var(--color-rm-maroon)]/40 border-[var(--color-rm-gold)]"
              : errors?.verificationAcknowledgement
              ? "bg-rose-950/20 border-rose-500/60"
              : "bg-white/5 border-white/15"
          }`}
        >
          <input
            type="checkbox"
            checked={formData.verificationAcknowledgement}
            onChange={(e) =>
              onChange("verificationAcknowledgement", e.target.checked)
            }
            className="mt-0.5 w-4 h-4 accent-[var(--color-rm-gold)]"
          />
          <div className="space-y-1">
            <span className="text-xs sm:text-sm font-bold text-white block">
              I understand that eligibility may be verified before registration is confirmed.{" "}
              <span className="text-[var(--color-rm-gold)]">*</span>
            </span>
            <span className="text-xs text-white/70 block">
              Participants should carry their official university or college ID card during check-in.
            </span>
          </div>
        </label>
        {errors?.verificationAcknowledgement && (
          <p className="text-xs font-bold text-rose-400 pl-1">
            {errors.verificationAcknowledgement}
          </p>
        )}
      </div>
    </fieldset>
  );
};
