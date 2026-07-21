"use client";

import React from "react";
import { Check } from "lucide-react";
import { RegistrationStep } from "../../types/registration";

export interface RegistrationProgressProps {
  currentStep: RegistrationStep;
  onStepClick?: (step: RegistrationStep) => void;
  maxReachedStep: RegistrationStep;
}

const STEPS: { id: RegistrationStep; label: string; subLabel: string }[] = [
  { id: 1, label: "Participant Origin", subLabel: "Identity & Eligibility" },
  { id: 2, label: "Participation Details", subLabel: "Individual or Team" },
  { id: 3, label: "Contact & Info", subLabel: "Communication & Rules" },
  { id: 4, label: "Review & Confirm", subLabel: "Final Verification" },
];

export const RegistrationProgress: React.FC<RegistrationProgressProps> = ({
  currentStep,
  onStepClick,
  maxReachedStep,
}) => {
  return (
    <nav aria-label="Registration progress" className="w-full">
      <ol className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {STEPS.map((step) => {
          const isCurrent = step.id === currentStep;
          const isCompleted = step.id < currentStep;
          const isClickable = Boolean(onStepClick && step.id <= maxReachedStep);

          return (
            <li key={step.id} className="relative">
              <button
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && onStepClick?.(step.id)}
                aria-current={isCurrent ? "step" : undefined}
                className={`w-full flex flex-col items-start p-3.5 sm:p-4 rounded-2xl border transition-all text-left ${
                  isCurrent
                    ? "bg-[var(--color-rm-maroon)]/80 border-[var(--color-rm-gold)] shadow-lg"
                    : isCompleted
                    ? "bg-white/5 border-emerald-500/40 hover:border-emerald-500/60"
                    : "bg-white/5 border-white/10 opacity-60 cursor-not-allowed"
                } ${isClickable ? "cursor-pointer" : ""}`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span
                    className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                      isCurrent
                        ? "bg-[var(--color-rm-gold)] text-black"
                        : isCompleted
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                        : "bg-white/10 text-white/60"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : step.id}
                  </span>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      isCurrent
                        ? "text-[var(--color-rm-gold)]"
                        : isCompleted
                        ? "text-emerald-400"
                        : "text-white/40"
                    }`}
                  >
                    Step {step.id}
                  </span>
                </div>

                <span className="text-xs sm:text-sm font-extrabold text-white block truncate w-full">
                  {step.label}
                </span>
                <span className="text-[11px] text-white/65 block truncate w-full mt-0.5">
                  {step.subLabel}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
