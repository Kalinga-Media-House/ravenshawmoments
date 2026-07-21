"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { CompetitionDraftValues } from "@/features/competition/schema/adminCompetitionSchema";

export default function ReviewPublishStep() {
  const { register, watch, formState: { errors } } = useFormContext<CompetitionDraftValues>();
  const publicationAction = watch("publicationAction");

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-stone-900 border-b border-stone-200 pb-2">Review & Publish</h3>
      
      <p className="text-sm text-stone-600 mb-6">
        Please review all the information before publishing. The competition will be saved using the new atomic workflow.
      </p>

      <div className="space-y-4">
        <label className="flex items-start gap-3 p-4 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
          <input
            type="radio"
            value="preserve"
            {...register("publicationAction")}
            className="mt-1 w-5 h-5 text-red-700 focus:ring-red-700 border-stone-300"
          />
          <div>
            <span className="block font-bold text-stone-900">Preserve (Draft / Current State)</span>
            <span className="block text-sm text-stone-500">Save changes without altering the current publication status.</span>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
          <input
            type="radio"
            value="draft"
            {...register("publicationAction")}
            className="mt-1 w-5 h-5 text-red-700 focus:ring-red-700 border-stone-300"
          />
          <div>
            <span className="block font-bold text-stone-900">Unpublish (Return to Draft)</span>
            <span className="block text-sm text-stone-500">Hide the competition from the public portal immediately.</span>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
          <input
            type="radio"
            value="publish_now"
            {...register("publicationAction")}
            className="mt-1 w-5 h-5 text-red-700 focus:ring-red-700 border-stone-300"
          />
          <div>
            <span className="block font-bold text-stone-900">Publish Immediately</span>
            <span className="block text-sm text-stone-500">Make the competition visible on the public portal right now.</span>
          </div>
        </label>

        <label className="flex items-start gap-3 p-4 border border-stone-200 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors">
          <input
            type="radio"
            value="schedule"
            {...register("publicationAction")}
            className="mt-1 w-5 h-5 text-red-700 focus:ring-red-700 border-stone-300"
          />
          <div className="flex-1">
            <span className="block font-bold text-stone-900">Schedule Publication</span>
            <span className="block text-sm text-stone-500 mb-3">Set a future date and time for the competition to automatically go live.</span>
            
            {publicationAction === "schedule" && (
              <div>
                <input
                  type="datetime-local"
                  {...register("scheduledPublishAt")}
                  className="w-full md:w-auto rounded-lg border-stone-300 text-sm focus:border-red-700 focus:ring-red-700 shadow-sm"
                />
                {errors.scheduledPublishAt && (
                  <p className="mt-1 text-sm text-red-600">{errors.scheduledPublishAt.message as string}</p>
                )}
              </div>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
