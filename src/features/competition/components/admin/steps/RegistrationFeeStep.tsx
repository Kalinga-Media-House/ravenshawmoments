"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { CompetitionDraftValues } from "@/features/competition/schema/adminCompetitionSchema";

export default function RegistrationFeeStep() {
  const { register, formState: { errors } } = useFormContext<CompetitionDraftValues>();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="registrationFee" className="block text-sm font-bold text-stone-700 mb-1">
            Registration Fee (INR)
          </label>
          <input
            type="number"
            id="registrationFee"
            min="0"
            step="0.01"
            {...register("registrationFee", { valueAsNumber: true })}
            className="w-full rounded-xl border-stone-300 shadow-sm focus:border-red-700 focus:ring-red-700"
            placeholder="0 for free"
          />
          {errors.registrationFee && <p className="mt-1 text-sm text-red-600">{errors.registrationFee.message as string}</p>}
        </div>

        <div>
          <label htmlFor="registrationApprovalMode" className="block text-sm font-bold text-stone-700 mb-1">
            Approval Mode
          </label>
          <select
            id="registrationApprovalMode"
            {...register("registrationApprovalMode")}
            className="w-full rounded-xl border-stone-300 shadow-sm focus:border-red-700 focus:ring-red-700"
          >
            <option value="automatic">Automatic</option>
            <option value="manual">Manual Approval</option>
          </select>
          {errors.registrationApprovalMode && <p className="mt-1 text-sm text-red-600">{errors.registrationApprovalMode.message as string}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
        <input
          type="checkbox"
          id="waitlistEnabled"
          {...register("waitlistEnabled")}
          className="w-5 h-5 rounded border-stone-300 text-red-700 focus:ring-red-700"
        />
        <div>
          <label htmlFor="waitlistEnabled" className="font-bold text-stone-900 block">Enable Waitlist</label>
          <p className="text-sm text-stone-500">Allow users to join a waitlist if maximum capacity is reached.</p>
        </div>
      </div>
    </div>
  );
}
