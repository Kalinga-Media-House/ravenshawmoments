"use client";

import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { CompetitionDraftValues } from "@/features/competition/schema/adminCompetitionSchema";
import { PlusIcon, TrashIcon } from "lucide-react";

export default function PrizesCertificatesStep() {
  const { register, control, formState: { errors } } = useFormContext<CompetitionDraftValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "prizes"
  });

  return (
    <div className="space-y-8">
      {/* Prizes Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-stone-900">Prizes</h3>
            <p className="text-xs text-stone-500">Define the prizes awarded to winners.</p>
          </div>
          <button
            type="button"
            onClick={() => append({ position: fields.length + 1, title: "", amount: 0, currency: "INR" })}
            className="flex items-center gap-2 text-xs font-bold text-red-700 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Prize
          </button>
        </div>

        <div className="space-y-4">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-start gap-4 p-4 bg-white border border-stone-200 rounded-xl">
              <div className="w-20">
                <label className="block text-xs font-bold text-stone-700 mb-1">Position</label>
                <input
                  type="number"
                  {...register(`prizes.${index}.position`, { valueAsNumber: true })}
                  className="w-full rounded-lg border-stone-300 text-sm focus:border-red-700 focus:ring-red-700"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-stone-700 mb-1">Title</label>
                <input
                  type="text"
                  {...register(`prizes.${index}.title`)}
                  placeholder="e.g. First Prize, Runner Up"
                  className="w-full rounded-lg border-stone-300 text-sm focus:border-red-700 focus:ring-red-700"
                />
              </div>
              <div className="w-32">
                <label className="block text-xs font-bold text-stone-700 mb-1">Amount</label>
                <input
                  type="number"
                  {...register(`prizes.${index}.amount`, { valueAsNumber: true })}
                  placeholder="0.00"
                  className="w-full rounded-lg border-stone-300 text-sm focus:border-red-700 focus:ring-red-700"
                />
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-6 p-2 text-stone-400 hover:text-red-600 transition-colors"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
          {fields.length === 0 && (
            <div className="text-center p-6 bg-stone-50 rounded-xl border border-dashed border-stone-300">
              <p className="text-sm text-stone-500">No prizes defined yet.</p>
            </div>
          )}
        </div>
      </div>

      <hr className="border-stone-200" />

      {/* Certificates Section */}
      <div>
        <h3 className="text-sm font-bold text-stone-900 mb-4">Certificates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors">
            <input
              type="checkbox"
              {...register("participationCertificateEnabled")}
              className="mt-1 w-5 h-5 rounded border-stone-300 text-red-700 focus:ring-red-700"
            />
            <div>
              <span className="font-bold text-stone-900 block text-sm">Participation Certificates</span>
              <span className="text-xs text-stone-500">Awarded to all valid submissions.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors">
            <input
              type="checkbox"
              {...register("meritCertificateEnabled")}
              className="mt-1 w-5 h-5 rounded border-stone-300 text-red-700 focus:ring-red-700"
            />
            <div>
              <span className="font-bold text-stone-900 block text-sm">Merit Certificates</span>
              <span className="text-xs text-stone-500">Awarded to top performers (e.g. Top 10).</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors">
            <input
              type="checkbox"
              {...register("winnerCertificateEnabled")}
              className="mt-1 w-5 h-5 rounded border-stone-300 text-red-700 focus:ring-red-700"
            />
            <div>
              <span className="font-bold text-stone-900 block text-sm">Winner Certificates</span>
              <span className="text-xs text-stone-500">Awarded to podium finishers.</span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 bg-stone-50 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors">
            <input
              type="checkbox"
              {...register("certificateVerificationEnabled")}
              className="mt-1 w-5 h-5 rounded border-stone-300 text-red-700 focus:ring-red-700"
            />
            <div>
              <span className="font-bold text-stone-900 block text-sm">QR Verification</span>
              <span className="text-xs text-stone-500">Add verifiable QR codes to certificates.</span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
