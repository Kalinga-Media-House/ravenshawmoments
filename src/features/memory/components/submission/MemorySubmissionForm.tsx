"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, AlertCircle, LogIn, UserPlus } from "lucide-react";
import { MemorySubmissionFormData, MemorySubmissionStep } from "../../types/submission";
import { SubmissionProgress } from "./SubmissionProgress";
import { MemoryBasicInformation } from "./MemoryBasicInformation";
import { MemoryMediaUpload } from "./MemoryMediaUpload";
import { MemoryPeopleFields } from "./MemoryPeopleFields";
import { MemoryCommunityFields } from "./MemoryCommunityFields";
import { MemoryContributorFields } from "./MemoryContributorFields";
import { MemoryConsent } from "./MemoryConsent";
import { MemorySubmissionReview } from "./MemorySubmissionReview";
import { MemorySubmissionStatus } from "./MemorySubmissionStatus";
import { ProfileVerificationDialog } from "@/components/profile/ProfileVerificationDialog";
import { canUploadMedia } from "@/lib/utils/permissions";

const INITIAL_FORM_DATA: MemorySubmissionFormData = {
  title: "",
  shortDescription: "",
  category: "Campus Life",
  fullStory: "",
  memoryDate: "",
  approximateDateOnly: false,
  memoryYear: "",
  academicSession: "",
  location: "",
  images: [],
  photographerName: "",
  creditNote: "",
  isSelfPhotographer: false,
  hasPhotographerPermission: false,
  people: [],
  departmentName: "",
  hostelName: "",
  organizationName: "",
  eventName: "",
  achievementName: "",
  batch: "",
  contributorName: "",
  contributorEmail: "",
  contributorPhone: "",
  displayPublicly: true,
  visibility: "Public",
  consentPermission: false,
  consentAccuracy: false,
  consentReview: false,
  consentDisplay: false,
};

export const MemorySubmissionForm: React.FC<{ currentUser?: any }> = ({ currentUser }) => {
  const [formData, setFormData] = useState<MemorySubmissionFormData>(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState<MemorySubmissionStep>(1);
  const [maxReachedStep, setMaxReachedStep] = useState<MemorySubmissionStep>(1);
  const [errors, setErrors] = useState<Partial<Record<keyof MemorySubmissionFormData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const formTopRef = useRef<HTMLDivElement | null>(null);

  // Unsaved form protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty && !isSubmitted) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Leaving this page may remove the information you entered.";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSubmitted]);

  const handleChange = <K extends keyof MemorySubmissionFormData>(
    field: K,
    value: MemorySubmissionFormData[K]
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

  const validateStep = (step: MemorySubmissionStep): boolean => {
    const newErrors: Partial<Record<keyof MemorySubmissionFormData, string>> = {};

    if (step === 1) {
      if (!formData.title.trim()) {
        newErrors.title = "Please provide a title for this memory.";
      }
      if (!formData.shortDescription.trim()) {
        newErrors.shortDescription = "Please provide a short summary.";
      }
      if (!formData.fullStory.trim()) {
        newErrors.fullStory = "Please share the story narrative.";
      }
    }

    if (step === 4) {
      if (!formData.contributorName.trim()) {
        newErrors.contributorName = "Full Name is required.";
      }
      if (!formData.contributorEmail.trim()) {
        newErrors.contributorEmail = "Email Address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contributorEmail)) {
        newErrors.contributorEmail = "Please enter a valid email address.";
      }

      if (!formData.consentPermission) {
        newErrors.consentPermission = "You must confirm permission to share.";
      }
      if (!formData.consentAccuracy) {
        newErrors.consentAccuracy = "You must confirm accuracy.";
      }
      if (!formData.consentReview) {
        newErrors.consentReview = "You must acknowledge editorial review.";
      }
      if (!formData.consentDisplay) {
        newErrors.consentDisplay = "You must agree to public display upon approval.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && currentUser && !canUploadMedia(currentUser)) {
      setVerificationDialogOpen(true);
      return;
    }
    if (!validateStep(currentStep)) {
      scrollToTop();
      return;
    }
    const nextStep = (currentStep + 1) as MemorySubmissionStep;
    setCurrentStep(nextStep);
    setMaxReachedStep((prev) => (nextStep > prev ? nextStep : prev));
    scrollToTop();
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as MemorySubmissionStep);
      scrollToTop();
    }
  };

  const handleSelectStep = (step: MemorySubmissionStep) => {
    if (step === 2 && currentUser && !canUploadMedia(currentUser)) {
      setVerificationDialogOpen(true);
      return;
    }
    if (step <= maxReachedStep) {
      setCurrentStep(step);
      scrollToTop();
    }
  };

  const handlePrepareSubmission = () => {
    if (currentUser && !canUploadMedia(currentUser)) {
      setVerificationDialogOpen(true);
      return;
    }
    // Validate all required steps
    if (!validateStep(1) || !validateStep(4)) {
      scrollToTop();
      return;
    }
    setIsSubmitted(true);
    scrollToTop();
  };

  if (isSubmitted) {
    return <MemorySubmissionStatus onReturnToEdit={() => setIsSubmitted(false)} />;
  }

  return (
    <div ref={formTopRef} className="space-y-10">
      <ProfileVerificationDialog
        open={verificationDialogOpen}
        onOpenChange={setVerificationDialogOpen}
        status={currentUser?.profile_status || (currentUser?.is_verified ? "verified" : "pending")}
        actionName="upload campus memories and photos"
      />
      {/* Optional Sign In Panel */}
      <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-white/10 bg-black/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-white">
            Sign In to Share Your Memory
          </h3>
          <p className="text-xs sm:text-sm text-white/70 mt-0.5">
            Sign in to connect your contribution with your Ravenshaw Moments profile and follow its review status, or continue below as a guest.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          <Link
            href="/login?redirect=/memories/submit"
            className="flex-1 sm:flex-initial min-h-[42px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
            Sign In
          </Link>

          <Link
            href="/register?redirect=/memories/submit"
            className="flex-1 sm:flex-initial min-h-[42px] inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--color-rm-maroon)] hover:bg-[var(--color-rm-maroon)]/90 border border-[var(--color-rm-gold)]/50 text-xs font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
            Create Profile
          </Link>
        </div>
      </div>

      {/* Progress Indicator */}
      <SubmissionProgress
        currentStep={currentStep}
        onSelectStep={handleSelectStep}
        maxReachedStep={maxReachedStep}
      />

      {/* Global Validation Summary if errors exist */}
      {Object.keys(errors).length > 0 && (
        <div
          role="alert"
          aria-live="polite"
          className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs sm:text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-extrabold text-white mb-1">Please correct the following fields:</p>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              {Object.entries(errors).map(([k, msg]) => (
                <li key={k}>{msg}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Form Step Body */}
      <div className="rm-glass-card rounded-3xl p-6 sm:p-10 border border-white/15 bg-black/40">
        {currentStep === 1 && (
          <MemoryBasicInformation
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        )}

        {currentStep === 2 && (
          <MemoryMediaUpload
            formData={formData}
            onChange={handleChange}
            errors={errors}
          />
        )}

        {currentStep === 3 && (
          <div className="space-y-12">
            <MemoryPeopleFields formData={formData} onChange={handleChange} />
            <div className="border-t border-white/10 pt-8">
              <MemoryCommunityFields formData={formData} onChange={handleChange} />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-12">
            <MemoryContributorFields
              formData={formData}
              onChange={handleChange}
              errors={errors}
            />
            <div className="border-t border-white/10 pt-8">
              <MemoryConsent
                formData={formData}
                onChange={handleChange}
                errors={errors}
              />
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <MemorySubmissionReview
            formData={formData}
            onEditStep={handleSelectStep}
          />
        )}

        {/* Action Controls */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t border-white/10">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Previous Step
              </button>
            )}
          </div>

          <div className="w-full sm:w-auto flex items-center gap-3">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[var(--color-rm-maroon)] hover:bg-[var(--color-rm-maroon)]/90 border border-[var(--color-rm-gold)]/60 text-xs sm:text-sm font-extrabold text-white transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePrepareSubmission}
                className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[var(--color-rm-gold)] hover:bg-[var(--color-rm-gold)]/90 text-black text-xs sm:text-sm font-extrabold transition-colors shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <Check className="w-4 h-4" aria-hidden="true" />
                <span>Prepare Submission</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
