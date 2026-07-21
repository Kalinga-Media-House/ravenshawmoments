"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { CompetitionDraftValues } from "@/features/competition/schema/adminCompetitionSchema";
import { AdminMediaUpload } from "@/features/shared/media/components/AdminMediaUpload";

export default function BasicInformationStep() {
  const { register, formState: { errors }, setValue, watch } = useFormContext<CompetitionDraftValues>();
  
  const featuredMediaId = watch("featuredMediaId");

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-stone-700 mb-1">
          Competition Title <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title")}
          className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          placeholder="e.g. Ravenshaw Annual Debate"
        />
        {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-stone-700 mb-1">
          URL Slug <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center">
          <span className="px-3 py-2 bg-stone-100 border border-stone-300 border-r-0 rounded-l-xl text-stone-500 text-sm">
            ravenshawmoments.com/competitions/
          </span>
          <input
            {...register("slug")}
            className="flex-1 px-4 py-2 border border-stone-300 rounded-r-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            placeholder="annual-debate-2027"
          />
        </div>
        {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
        <p className="text-xs text-stone-500 mt-1">Use lowercase letters, numbers, and hyphens only.</p>
      </div>

      <div>
        <label className="block text-sm font-bold text-stone-700 mb-2">
          Cover Image
        </label>
        <AdminMediaUpload 
          currentMediaId={featuredMediaId ?? undefined}
          onUploadSuccess={(mediaId) => {
            setValue("featuredMediaId", mediaId, { shouldDirty: true, shouldValidate: true });
          }}
        />
        {errors.featuredMediaId && <p className="text-xs text-red-600 mt-1">{errors.featuredMediaId.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-stone-700 mb-1">
          Short Description
        </label>
        <textarea
          {...register("shortDescription")}
          rows={3}
          className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
          placeholder="A brief summary for cards and social sharing..."
        />
        {errors.shortDescription && <p className="text-xs text-red-600 mt-1">{errors.shortDescription.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-bold text-stone-700 mb-1">
          Internal Administrative Notes <span className="text-stone-500 font-normal">(Deferred - Will not be saved)</span>
        </label>
        <textarea
          {...register("internalNotes")}
          rows={2}
          disabled
          className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-stone-500 focus:border-stone-500 transition-colors bg-stone-100 opacity-50 cursor-not-allowed"
          placeholder="Notes only visible to admins..."
        />
      </div>
    </div>
  );
}
