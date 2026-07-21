"use client";

import React, { useState, useTransition } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { competitionDraftSchema, CompetitionDraftValues } from "@/features/competition/schema/adminCompetitionSchema";
import { saveCompetitionAction } from "@/app/actions/competitionAdminAction";
import BasicInformationStep from "./steps/BasicInformationStep";
import ScheduleModeStep from "./steps/ScheduleModeStep";
import EligibilityStep from "./steps/EligibilityStep";
import RulesGuidelinesStep from "./steps/RulesGuidelinesStep";
import RegistrationFeeStep from "./steps/RegistrationFeeStep";
import PrizesCertificatesStep from "./steps/PrizesCertificatesStep";
import OrganizerSupportStep from "./steps/OrganizerSupportStep";
import SubmissionConfigStep from "./steps/SubmissionConfigStep";
import ReviewPublishStep from "./steps/ReviewPublishStep";
import { Save, ChevronRight, ChevronLeft, Loader2 } from "lucide-react";

const STEPS = [
  { id: "basic", title: "Basic Information", component: BasicInformationStep },
  { id: "schedule", title: "Schedule & Mode", component: ScheduleModeStep },
  { id: "eligibility", title: "Eligibility", component: EligibilityStep },
  { id: "rules", title: "Rules & Guidelines", component: RulesGuidelinesStep },
  { id: "registration", title: "Registration & Fees", component: RegistrationFeeStep },
  { id: "prizes", title: "Prizes & Certificates", component: PrizesCertificatesStep },
  { id: "organizer", title: "Organizer", component: OrganizerSupportStep },
  { id: "submission", title: "Submission Config", component: SubmissionConfigStep },
  { id: "review", title: "Review & Publish", component: ReviewPublishStep },
];

interface CompetitionFormWizardProps {
  initialData?: Partial<CompetitionDraftValues>;
  competitionId?: string;
}

export default function CompetitionFormWizard({
  initialData,
  competitionId,
}: CompetitionFormWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");

  const methods = useForm<CompetitionDraftValues>({
    resolver: zodResolver(competitionDraftSchema),
    defaultValues: {
      mode: "offline",
      level: "university",
      allowTeam: false,
      externalParticipantsAllowed: false,
      eligibleParticipantTypes: [],
      publicationAction: "preserve",
      ...initialData,
    },
    mode: "onChange",
  });

  const { handleSubmit, trigger, watch } = methods;

  const handleNext = async () => {
    // Validate current step
    let fieldsToValidate: any[] = [];
    if (currentStep === 0) fieldsToValidate = ["title", "slug"];
    
    if (fieldsToValidate.length > 0) {
      const isStepValid = await trigger(fieldsToValidate);
      if (!isStepValid) return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(s => s + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(s => s - 1);
    }
  };

  const onSave = async (data: CompetitionDraftValues) => {
    setErrorMsg("");
    startTransition(async () => {
      const result = await saveCompetitionAction(competitionId, data);
        
      if (result.success && result.id) {
        // Redirect to the overview page
        router.push(`/admin/competitions/${result.id}`);
      } else {
        setErrorMsg(result.message || "Failed to save competition.");
      }
    });
  };

  const StepComponent = STEPS[currentStep].component;

  return (
    <FormProvider {...methods}>
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Progress Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {STEPS.map((step, idx) => (
            <div key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => setCurrentStep(idx)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                  currentStep === idx 
                    ? "bg-red-700 text-white" 
                    : currentStep > idx 
                      ? "bg-stone-800 text-white" 
                      : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                }`}
              >
                <span>{idx + 1}.</span>
                <span className="hidden md:inline">{step.title}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <div className="w-4 h-[2px] bg-stone-200 mx-1" />
              )}
            </div>
          ))}
        </div>

        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm font-medium border border-red-200">
            {errorMsg}
          </div>
        )}

        {/* Step Content */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-stone-200">
          <h2 className="text-xl font-bold text-stone-900 mb-6">{STEPS[currentStep].title}</h2>
          <form id="competition-form" onSubmit={handleSubmit(onSave)}>
            <StepComponent />
          </form>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStep === 0 || isPending}
            className="px-6 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-medium hover:bg-stone-50 disabled:opacity-50 flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {currentStep < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold flex items-center gap-2 shadow-sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                form="competition-form"
                disabled={isPending}
                className="px-8 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                Save Competition
              </button>
            )}
          </div>
        </div>

      </div>
    </FormProvider>
  );
}
