"use client";

import React from "react";
import { Check } from "lucide-react";
import { MemorySubmissionStep } from "../../types/submission";

export interface SubmissionProgressProps {
  currentStep: MemorySubmissionStep;
  onSelectStep?: (step: MemorySubmissionStep) => void;
  maxReachedStep: MemorySubmissionStep;
}

export const SubmissionProgress: React.FC<SubmissionProgressProps> = ({
  currentStep,
  onSelectStep,
  maxReachedStep,
}) => {
  const steps: { number: MemorySubmissionStep; label: string }[] = [
    { number: 1, label: "About the Memory" },
    { number: 2, label: "Photos and Attribution" },
    { number: 3, label: "People and Community" },
    { number: 4, label: "Contributor and Consent" },
    { number: 5, label: "Review" },
  ];

  return (
    <nav aria-label="Submission progress" className="w-full my-8">
      <ol className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-2">
        {steps.map((step, idx) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isAccessible = step.number <= maxReachedStep;

          return (
            <li key={step.number} className="flex-1 w-full sm:w-auto">
              <button
                type="button"
                disabled={!isAccessible}
                onClick={() => isAccessible && onSelectStep?.(step.number)}
                aria-current={isCurrent ? "step" : undefined}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] ${
                  isCurrent
                    ? "bg-[var(--color-rm-maroon)]/50 border border-[var(--color-rm-gold)]/60 text-white"
                    : isCompleted
                    ? "bg-white/5 border border-white/10 hover:border-[var(--color-rm-gold)]/30 text-white/90"
                    : "bg-white/5 border border-white/5 text-white/40 cursor-not-allowed"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                    isCompleted
                      ? "bg-[var(--color-rm-gold)] text-black"
                      : isCurrent
                      ? "bg-[var(--color-rm-maroon)] border-2 border-[var(--color-rm-gold)] text-[var(--color-rm-gold)]"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" aria-hidden="true" /> : step.number}
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-rm-gold)] block">
                    Step {step.number}
                  </span>
                  <span className="text-xs sm:text-sm font-bold truncate block">
                    {step.label}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
