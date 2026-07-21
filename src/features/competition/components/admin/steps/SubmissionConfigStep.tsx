"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { CompetitionDraftValues } from "@/features/competition/schema/adminCompetitionSchema";

export default function SubmissionConfigStep() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { register, formState: { errors } } = useFormContext<CompetitionDraftValues>();

  return (
    <div className="space-y-6">
      <div className="bg-yellow-50 text-yellow-900 p-4 rounded-xl text-sm border border-yellow-200">
        <p className="font-bold mb-1">Advanced Configuration</p>
        <p>Submission requirements JSON configuration is supported by the database, but advanced visual builders are deferred.</p>
      </div>
      <p className="text-sm text-stone-600">
        Leave this section blank unless you have an explicit JSON requirement definition.
      </p>
      {/* For Phase C, we omit complex JSON visual builders to focus on the atomic save flow. The field is optional. */}
    </div>
  );
}
