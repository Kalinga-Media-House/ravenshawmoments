"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { CompetitionDraftValues } from "@/features/competition/schema/adminCompetitionSchema";

export default function ScheduleModeStep() {
  const { register, watch, formState: { errors } } = useFormContext<CompetitionDraftValues>();

  const mode = watch("mode");

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-stone-700 mb-1">
          Competition Mode <span className="text-red-500">*</span>
        </label>
        <select
          {...register("mode")}
          className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
        >
          <option value="offline">Offline (In-person)</option>
          <option value="online">Online</option>
          <option value="hybrid">Hybrid</option>
        </select>
        {errors.mode && <p className="text-xs text-red-600 mt-1">{errors.mode.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">
            Registration Opens
          </label>
          <input
            type="datetime-local"
            {...register("registrationOpenAt")}
            className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          />
          {errors.registrationOpenAt && <p className="text-xs text-red-600 mt-1">{errors.registrationOpenAt.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">
            Registration Closes
          </label>
          <input
            type="datetime-local"
            {...register("registrationCloseAt")}
            className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          />
          {errors.registrationCloseAt && <p className="text-xs text-red-600 mt-1">{errors.registrationCloseAt.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">
            Event Start Date & Time
          </label>
          <input
            type="datetime-local"
            {...register("startsAt")}
            className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          />
          {errors.startsAt && <p className="text-xs text-red-600 mt-1">{errors.startsAt.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">
            Event End Date & Time
          </label>
          <input
            type="datetime-local"
            {...register("endsAt")}
            className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          />
          {errors.endsAt && <p className="text-xs text-red-600 mt-1">{errors.endsAt.message}</p>}
        </div>
      </div>

      {(mode === "offline" || mode === "hybrid") && (
        <>
          <div>
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Venue Name
            </label>
            <input
              {...register("venueName")}
              className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="e.g. Seven Pillars of Wisdom"
            />
          </div>
          <div className="opacity-50">
            <label className="block text-sm font-bold text-stone-700 mb-1">
              Reporting Instructions <span className="text-stone-500 font-normal">(Deferred - Will not be saved)</span>
            </label>
            <textarea
              {...register("reportingInstructions")}
              rows={3}
              disabled
              className="w-full px-4 py-2 rounded-xl border border-stone-300 transition-colors bg-stone-100 cursor-not-allowed"
              placeholder="e.g. Please report at least 30 minutes before the scheduled time."
            />
          </div>
        </>
      )}
    </div>
  );
}
