"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { CompetitionItem } from "../../types/competition";
import {
  CompetitionRegistrationFormData,
  RegistrationStep,
} from "../../types/registration";
import { RegistrationProgress } from "./RegistrationProgress";
import { ParticipantOriginSelector } from "./ParticipantOrigin";
import { RavenshawParticipantFields } from "./RavenshawParticipantFields";
import { ExternalParticipantFields } from "./ExternalParticipantFields";
import { EligibilityCheck, evaluateEligibility } from "./EligibilityCheck";
import { TeamRegistrationFields } from "./TeamRegistrationFields";
import { RegistrationContactFields } from "./RegistrationContactFields";
import { RegistrationFeeSummary } from "./RegistrationFeeSummary";
import { RegistrationAgreement } from "./RegistrationAgreement";
import { RegistrationReview } from "./RegistrationReview";
import { RegistrationPreparedState } from "./RegistrationStatusStates";

export interface CompetitionRegistrationFormProps {
  competition: CompetitionItem;
}

const getInitialFormData = (
  competition: CompetitionItem
): CompetitionRegistrationFormData => {
  const validRavenshawTypes: ("Student" | "Teacher" | "Alumni")[] = [
    "Student",
    "Teacher",
    "Alumni",
  ];
  const defaultRavenshawType =
    competition.eligibleParticipantTypes?.find(
      (t): t is "Student" | "Teacher" | "Alumni" =>
        validRavenshawTypes.includes(t as "Student" | "Teacher" | "Alumni")
    ) || "Student";

  return {
    participantOrigin: "Ravenshawvian",
    ravenshawParticipantType: defaultRavenshawType,
    fullName: "",
    academicLevel: "UG",
  department: "",
  batchOrSession: "",
  rollOrRegistrationNumber: "",
  hostelName: "",
  organizationName: "",
  teacherDesignation: "",
  teacherAppointmentYear: "",
  alumniGraduationBatch: "",
  externalInstitutionName: "",
  externalAcademicLevel: "UG",
  externalProgramme: "",
  externalDepartment: "",
  externalBatch: "",
  externalStudentId: "",
  participationMode:
    competition.participationMode === "Team" ? "Team" : "Individual",
  teamName: "",
  teamLeaderName: "",
  teamMembers: [],
  email: "",
  phone: "",
  previousExperience: "",
  accessibilitySupportNeeded: false,
  accessibilitySupportDetails: "",
  ruleAgreement: false,
  accuracyConfirmation: false,
  verificationAcknowledgement: false,
  };
};

export const CompetitionRegistrationForm: React.FC<
  CompetitionRegistrationFormProps
> = ({ competition }) => {
  const [formData, setFormData] = useState<CompetitionRegistrationFormData>(() =>
    getInitialFormData(competition)
  );
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<RegistrationStep>(1);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CompetitionRegistrationFormData, string>>
  >({});
  const [isDirty, setIsDirty] = useState(false);
  const [isPrepared, setIsPrepared] = useState(false);
  const formTopRef = useRef<HTMLDivElement | null>(null);

  // Unsaved form navigation protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isPrepared) {
        e.preventDefault();
        e.returnValue =
          "You have unconfirmed registration details. Leaving this page will clear your form.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isPrepared]);

  const handleChange = <K extends keyof CompetitionRegistrationFormData>(
    field: K,
    value: CompetitionRegistrationFormData[K]
  ) => {
    setIsDirty(true);
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const scrollToTop = () => {
    if (formTopRef.current) {
      formTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const validateStep = (step: RegistrationStep): boolean => {
    const newErrors: Partial<
      Record<keyof CompetitionRegistrationFormData, string>
    > = {};

    if (step === 1) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = "Full name is required.";
      }
      if (formData.participantOrigin === "Ravenshawvian") {
        if (formData.ravenshawParticipantType === "Student") {
          if (!formData.department.trim()) {
            newErrors.department = "Department is required.";
          }
          if (!formData.batchOrSession.trim()) {
            newErrors.batchOrSession = "Batch / Academic session is required.";
          }
        } else if (formData.ravenshawParticipantType === "Teacher") {
          if (!formData.department.trim()) {
            newErrors.department = "Department is required.";
          }
        }
      } else {
        if (!formData.externalInstitutionName.trim()) {
          newErrors.externalInstitutionName = "College or university name is required.";
        }
        if (!formData.externalProgramme.trim()) {
          newErrors.externalProgramme = "Programme / course is required.";
        }
        if (!formData.externalBatch.trim()) {
          newErrors.externalBatch = "Current batch / academic session is required.";
        }
      }

      // Check overall eligibility block
      const evalResult = evaluateEligibility(competition, formData);
      if (evalResult.status === "Not Eligible") {
        newErrors.fullName = evalResult.message;
      }
    }

    if (step === 2) {
      const isTeam =
        competition.teamAllowed || competition.participationMode === "Team";
      if (isTeam && formData.participationMode === "Team") {
        if (!formData.teamName.trim()) {
          newErrors.teamName = "Please provide an official team name.";
        }
      }
    }

    if (step === 3) {
      if (!formData.email.trim() || !formData.email.includes("@")) {
        newErrors.email = "Please provide a valid email address.";
      }
      if (!formData.phone.trim() || formData.phone.length < 8) {
        newErrors.phone = "Please provide a valid contact phone number.";
      }
      if (!formData.ruleAgreement) {
        newErrors.ruleAgreement =
          "You must agree to follow the competition rules.";
      }
      if (!formData.accuracyConfirmation) {
        newErrors.accuracyConfirmation =
          "Please confirm that the information provided is accurate.";
      }
      if (!formData.verificationAcknowledgement) {
        newErrors.verificationAcknowledgement =
          "Please acknowledge that eligibility may be verified.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      const nextStep = (currentStep + 1) as RegistrationStep;
      setCurrentStep(nextStep);
      if (nextStep > maxReachedStep) {
        setMaxReachedStep(nextStep);
      }
      scrollToTop();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as RegistrationStep);
      scrollToTop();
    }
  };

  const handleStepClick = (step: RegistrationStep) => {
    if (step <= maxReachedStep) {
      setCurrentStep(step);
      scrollToTop();
    }
  };

  const handlePrepareSubmission = () => {
    if (validateStep(3)) {
      setIsPrepared(true);
      scrollToTop();
    }
  };

  if (isPrepared) {
    return (
      <div ref={formTopRef} className="py-6">
        <RegistrationPreparedState
          competition={competition}
          onReturnToEdit={() => setIsPrepared(false)}
        />
      </div>
    );
  }

  const errorKeys = Object.keys(errors);

  return (
    <div ref={formTopRef} className="space-y-8">
      {/* Progress Header */}
      <div 
        className="rounded-3xl p-5 sm:p-6 space-y-6"
        style={{
          background: 'linear-gradient(135deg, #32000D 0%, #500619 50%, #690B27 100%)',
          border: '1px solid rgba(228, 181, 54, 0.28)',
          boxShadow: '0 10px 28px rgba(61, 0, 18, 0.16)'
        }}
      >
        <RegistrationProgress
          currentStep={currentStep}
          onStepClick={handleStepClick}
          maxReachedStep={maxReachedStep}
        />
      </div>

      {/* Screen Reader Error Announcement */}
      {errorKeys.length > 0 && (
        <div
          role="alert"
          className="p-4 sm:p-5 rounded-2xl bg-rose-950/70 border border-rose-500/60 flex items-start gap-3.5 text-rose-200"
        >
          <AlertCircle
            className="w-5 h-5 text-rose-400 shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <div className="space-y-1">
            <h3 className="text-sm font-black text-white">
              Please resolve the following required fields before proceeding:
            </h3>
            <ul className="list-disc list-inside text-xs space-y-1">
              {errorKeys.map((k) => (
                <li key={k}>
                  {errors[k as keyof CompetitionRegistrationFormData]}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Step Container */}
      <div 
        className="rounded-3xl p-6 sm:p-8 md:p-10 space-y-8"
        style={{
          background: 'linear-gradient(135deg, #32000D 0%, #500619 50%, #690B27 100%)',
          border: '1px solid rgba(228, 181, 54, 0.28)',
          boxShadow: '0 10px 28px rgba(61, 0, 18, 0.16)'
        }}
      >
        {currentStep === 1 && (
          <div className="space-y-8">
            <ParticipantOriginSelector
              competition={competition}
              value={formData.participantOrigin}
              onChange={(v) => handleChange("participantOrigin", v)}
            />

            {formData.participantOrigin === "Ravenshawvian" ? (
              <RavenshawParticipantFields
                competition={competition}
                formData={formData}
                onChange={handleChange}
                errors={errors}
              />
            ) : (
              <ExternalParticipantFields
                competition={competition}
                formData={formData}
                onChange={handleChange}
                errors={errors}
              />
            )}

            <EligibilityCheck competition={competition} formData={formData} />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-lg sm:text-xl font-black text-white">
                Participation Details
              </h3>
              <p className="text-xs sm:text-sm text-white/70">
                Verify team member structure or individual entry details per competition
                instructions.
              </p>
            </div>

            <TeamRegistrationFields
              competition={competition}
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-8">
            <RegistrationContactFields
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />

            <RegistrationFeeSummary competition={competition} />

            <RegistrationAgreement
              competition={competition}
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />
          </div>
        )}

        {currentStep === 4 && (
          <RegistrationReview
            competition={competition}
            formData={formData}
            onEditStep={(step) => {
              setCurrentStep(step);
              scrollToTop();
            }}
          />
        )}

        {/* Form Wizard Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Previous Step</span>
              </button>
            )}
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
                style={{ background: '#500619', border: '1px solid rgba(228, 181, 54, 0.60)', color: '#FFFFFF' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#690B27';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#500619';
                }}
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrepareSubmission}
                className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[var(--color-rm-gold)] hover:bg-[var(--color-rm-gold)]/90 text-black text-xs sm:text-sm font-extrabold transition-all shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Prepare Registration</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
