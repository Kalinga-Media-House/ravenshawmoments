"use client";

import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { CompetitionDraftValues } from "@/features/competition/schema/adminCompetitionSchema";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { getActiveCompetitionCategoriesAction } from "@/app/actions/competitionAdminAction";

export default function EligibilityStep() {
  const { register, watch, control, setValue, formState: { errors } } = useFormContext<CompetitionDraftValues>();

  const allowTeam = watch("allowTeam");
  const externalParticipantsAllowed = watch("externalParticipantsAllowed");
  const level = watch("level");

  const [categories, setCategories] = useState<{ label: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (level !== "state" && externalParticipantsAllowed) {
      setValue("externalParticipantsAllowed", false);
    }
  }, [level, externalParticipantsAllowed, setValue]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await getActiveCompetitionCategoriesAction();
        if (result.success && result.data) {
          const formatted = result.data.map((c) => ({ label: c.name, value: c.id }));
          formatted.sort((a, b) => a.label.localeCompare(b.label));
          setCategories(formatted);
        } else {
          setError(true);
        }
      } catch (e) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadCategories();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="block text-sm font-bold text-stone-700 mb-1">
            Competition Category <span className="text-red-500">*</span>
          </label>
          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              <SearchableCombobox
                options={categories}
                value={field.value}
                onChange={field.onChange}
                placeholder={
                  isLoading
                    ? "Loading categories..."
                    : error
                    ? "Unable to load competition categories. Please try again."
                    : categories.length === 0
                    ? "No competition categories available."
                    : "Select a competition category"
                }
                emptyText={
                  isLoading
                    ? "Loading categories..."
                    : error
                    ? "Unable to load competition categories. Please try again."
                    : categories.length === 0
                    ? "No competition categories available."
                    : "No matching category found."
                }
                disabled={isLoading || !!error || categories.length === 0}
              />
            )}
          />
          {errors.categoryId && <p className="text-xs text-red-600 mt-1">Please select a competition category</p>}
        </div>
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-1">
            Competition Level <span className="text-red-500">*</span>
          </label>
          <select
            {...register("level")}
            className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
          >
            <option value="university">University</option>
            <option value="department">Department</option>
            <option value="hostel">Hostel</option>
            <option value="inter_university">Inter University</option>
            <option value="state">State</option>
            <option value="national">National</option>
          </select>
          {errors.level && <p className="text-xs text-red-600 mt-1">{errors.level.message}</p>}
        </div>
      </div>

      <div className="pt-4 border-t border-stone-200">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            {...register("allowTeam")}
            className="w-5 h-5 rounded border-stone-300 text-red-700 focus:ring-red-500"
          />
          <span className="text-sm font-bold text-stone-700">Allow Team Participation</span>
        </label>
        
        {allowTeam && (
          <div className="mt-4 grid grid-cols-2 gap-4 ml-8 p-4 bg-stone-50 rounded-xl">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Min Team Size</label>
              <input
                type="number"
                {...register("minTeamSize", { valueAsNumber: true })}
                className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500"
              />
              {errors.minTeamSize && <p className="text-xs text-red-600 mt-1">{errors.minTeamSize.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-1">Max Team Size</label>
              <input
                type="number"
                {...register("maxTeamSize", { valueAsNumber: true })}
                className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500"
              />
              {errors.maxTeamSize && <p className="text-xs text-red-600 mt-1">{errors.maxTeamSize.message}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-stone-200">
        <label className={`flex items-center gap-3 ${level !== "state" ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
          <input
            type="checkbox"
            disabled={level !== "state"}
            {...register("externalParticipantsAllowed")}
            className="w-5 h-5 rounded border-stone-300 text-red-700 focus:ring-red-500 disabled:text-stone-400 disabled:focus:ring-0"
          />
          <div className="flex flex-col">
            <span className="text-sm font-bold text-stone-700">Allow External Participants</span>
            <span className="text-xs font-normal text-stone-500">
              Allow eligible students from other colleges or universities to participate.
            </span>
          </div>
        </label>
        {level !== "state" && (
          <p className="text-xs text-stone-500 mt-2 ml-8 font-medium">
            Available only for State-level competitions.
          </p>
        )}

        {externalParticipantsAllowed && level === "state" && (
          <div className="mt-4 ml-8 p-4 bg-stone-50 rounded-xl">
            <label className="block text-sm font-bold text-stone-700 mb-1">External Participation Level</label>
            <input
              {...register("externalParticipationLevel")}
              placeholder="e.g. Undergraduate only"
              className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500"
            />
          </div>
        )}
      </div>
    </div>
  );
}
