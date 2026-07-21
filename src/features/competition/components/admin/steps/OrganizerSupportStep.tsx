"use client";

import React, { useEffect, useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { CompetitionDraftValues } from "@/features/competition/schema/adminCompetitionSchema";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { getOrganizersListAction } from "@/app/actions/competitionAdminAction";
import { Loader2 } from "lucide-react";

export default function OrganizerSupportStep() {
  const { register, watch, control, setValue, formState: { errors } } = useFormContext<CompetitionDraftValues>();

  const organizerType = watch("organizerType");
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Clear unselected IDs when type changes
  useEffect(() => {
    if (organizerType === "ravenshaw_moments") {
      setValue("departmentId", null);
      setValue("hostelId", null);
      setValue("organizationId", null);
    } else if (organizerType === "department") {
      setValue("hostelId", null);
      setValue("organizationId", null);
    } else if (organizerType === "hostel") {
      setValue("departmentId", null);
      setValue("organizationId", null);
    } else if (organizerType === "organization") {
      setValue("departmentId", null);
      setValue("hostelId", null);
    }
  }, [organizerType, setValue]);

  // Load options when type changes
  useEffect(() => {
    async function loadOptions() {
      if (!organizerType || organizerType === "ravenshaw_moments") {
        setOptions([]);
        return;
      }
      
      setIsLoading(true);
      setErrorMsg("");
      setOptions([]);

      try {
        const result = await getOrganizersListAction(organizerType as "department" | "hostel" | "organization");
        if (result.success && result.data) {
          const formatted = result.data.map((item: any) => ({ label: item.name, value: item.id }));
          setOptions(formatted);
        } else {
          setErrorMsg(result.message || "Failed to load options.");
        }
      } catch (err) {
        setErrorMsg("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    }

    loadOptions();
  }, [organizerType]);

  const renderCombobox = (fieldName: "departmentId" | "hostelId" | "organizationId", label: string) => {
    const error = errors[fieldName];
    return (
      <div className="mt-4">
        <label className="block text-sm font-bold text-stone-700 mb-1">
          Select {label} <span className="text-red-500">*</span>
        </label>
        <Controller
          name={fieldName}
          control={control}
          render={({ field }) => (
            <SearchableCombobox
              options={options}
              value={field.value || ""}
              onChange={field.onChange}
              placeholder={
                isLoading
                  ? `Loading ${label.toLowerCase()}s...`
                  : errorMsg
                  ? errorMsg
                  : options.length === 0
                  ? `No ${label.toLowerCase()}s available.`
                  : `Select a ${label.toLowerCase()}`
              }
              emptyText={`No matching ${label.toLowerCase()} found.`}
              disabled={isLoading || !!errorMsg || options.length === 0}
            />
          )}
        />
        {error && <p className="text-xs text-red-600 mt-1">{error.message as string}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 text-blue-900 p-4 rounded-xl text-sm border border-blue-100">
        <p className="font-bold mb-1">Select the primary organizer</p>
        <p>A competition can only belong to one primary organizing body. If this is a centralized event, choose Ravenshaw Moments.</p>
      </div>

      <div className="max-w-md">
        <label className="block text-sm font-bold text-stone-700 mb-1">
          Primary Organizer <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            {...register("organizerType")}
            className="w-full px-4 py-2 rounded-xl border border-stone-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white appearance-none"
          >
            <option value="ravenshaw_moments">Ravenshaw Moments</option>
            <option value="department">Department</option>
            <option value="hostel">Hostel</option>
            <option value="organization">Student Organization</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-stone-500">
            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-stone-500 text-sm mt-4">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading options...
        </div>
      )}

      {organizerType === "department" && renderCombobox("departmentId", "Department")}
      {organizerType === "hostel" && renderCombobox("hostelId", "Hostel")}
      {organizerType === "organization" && renderCombobox("organizationId", "Student Organization")}
    </div>
  );
}
