"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { CompetitionDraftValues } from "@/features/competition/schema/adminCompetitionSchema";

export default function RulesGuidelinesStep() {
  const { register, formState: { errors } } = useFormContext<CompetitionDraftValues>();

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="rules" className="block text-sm font-bold text-stone-700 mb-1">
          Rules & Guidelines
        </label>
        <p className="text-xs text-stone-500 mb-2">Provide comprehensive rules for the competition. Markdown is supported.</p>
        <textarea
          id="rules"
          {...register("rules")}
          rows={8}
          className="w-full rounded-xl border-stone-300 shadow-sm focus:border-red-700 focus:ring-red-700"
          placeholder="1. All submissions must be original...&#10;2. Plagiarism will lead to immediate disqualification..."
        />
        {errors.rules && <p className="mt-1 text-sm text-red-600">{errors.rules.message as string}</p>}
      </div>

      {/* For Phase C, we keep importantInformation simple, perhaps as a string that we later parse if needed, but since it's an array of any in Zod, let's omit a complex UI for now or just treat it as deferred. The DB accepts a JSON array. We can leave it hidden/unmanaged for now. */}
    </div>
  );
}
