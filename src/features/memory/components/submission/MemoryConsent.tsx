"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { MemorySubmissionFormData } from "../../types/submission";

export interface MemoryConsentProps {
  formData: MemorySubmissionFormData;
  onChange: <K extends keyof MemorySubmissionFormData>(
    field: K,
    value: MemorySubmissionFormData[K]
  ) => void;
  errors: Partial<Record<keyof MemorySubmissionFormData, string>>;
}

export const MemoryConsent: React.FC<MemoryConsentProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const checkboxes = [
    {
      key: "consentPermission" as const,
      label: "I confirm that I have permission to share the submitted photographs and content.",
    },
    {
      key: "consentAccuracy" as const,
      label: "I confirm that the information I provided is accurate to the best of my knowledge.",
    },
    {
      key: "consentReview" as const,
      label: "I understand that this submission will be reviewed before publication.",
    },
    {
      key: "consentDisplay" as const,
      label: "I agree that approved content may be displayed publicly on Ravenshaw Moments.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-[var(--color-rm-gold)] shrink-0" aria-hidden="true" />
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            Permission and Consent
          </h2>
          <p className="text-xs sm:text-sm text-white/70">
            Please review and confirm each required consent item below before submitting your memory.
          </p>
        </div>
      </div>

      <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-white/15 bg-black/30 space-y-4">
        {checkboxes.map((item) => {
          const hasError = Boolean(errors[item.key]);
          return (
            <div key={item.key} className="flex items-start gap-3">
              <input
                id={`consent-${item.key}`}
                type="checkbox"
                required
                checked={formData[item.key]}
                onChange={(e) => onChange(item.key, e.target.checked)}
                aria-invalid={hasError}
                aria-describedby={hasError ? `error-${item.key}` : undefined}
                className="mt-1 w-5 h-5 rounded border-white/30 bg-black/40 text-[var(--color-rm-gold)] focus:ring-[var(--color-rm-gold)] shrink-0"
              />
              <div>
                <label
                  htmlFor={`consent-${item.key}`}
                  className="text-xs sm:text-sm font-semibold text-white leading-relaxed cursor-pointer"
                >
                  {item.label} <span className="text-red-400">*</span>
                </label>
                {hasError && (
                  <p id={`error-${item.key}`} className="text-xs text-red-400 font-bold mt-1">
                    {errors[item.key]}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        role="note"
        className="flex items-start gap-3 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 text-xs sm:text-sm leading-relaxed"
      >
        <AlertCircle className="w-5 h-5 text-[var(--color-rm-gold)] shrink-0 mt-0.5" aria-hidden="true" />
        <div>
          <p className="font-bold text-white mb-1">Important Safety Notice</p>
          <p className="text-white/80">
            Please avoid submitting private documents, personal contact details, confidential information, or photographs that may violate someone&apos;s privacy.
          </p>
        </div>
      </div>

      <div className="text-xs text-white/60 pt-2 flex flex-wrap gap-x-4 gap-y-2">
        <span>Learn more about our editorial standards:</span>
        <Link
          href="/privacy-policy"
          className="text-[var(--color-rm-gold)] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-rm-gold)] rounded"
        >
          Privacy Policy
        </Link>
        <Link
          href="/terms-of-service"
          className="text-[var(--color-rm-gold)] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-rm-gold)] rounded"
        >
          Terms of Service
        </Link>
        <Link
          href="/about"
          className="text-[var(--color-rm-gold)] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-rm-gold)] rounded"
        >
          Community Guidelines
        </Link>
      </div>
    </div>
  );
};
