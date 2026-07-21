"use client";

import React from "react";
import { ShieldAlert, Building2 } from "lucide-react";
import { CompetitionItem } from "../../types/competition";
import {
  CompetitionRegistrationFormData,
  AcademicLevel,
} from "../../types/registration";

export interface ExternalParticipantFieldsProps {
  competition: CompetitionItem;
  formData: CompetitionRegistrationFormData;
  onChange: <K extends keyof CompetitionRegistrationFormData>(
    field: K,
    value: CompetitionRegistrationFormData[K]
  ) => void;
  errors?: Partial<Record<keyof CompetitionRegistrationFormData, string>>;
}

const ACADEMIC_LEVELS: AcademicLevel[] = ["+2", "UG", "PG", "PhD"];

export const ExternalParticipantFields: React.FC<
  ExternalParticipantFieldsProps
> = ({ formData, onChange, errors }) => {
  return (
    <div className="space-y-6">
      {/* Verification Notice */}
      <div className="p-4 rounded-2xl bg-white/5 border border-[var(--color-rm-gold)]/40 flex items-start gap-3 text-xs sm:text-sm text-white/85">
        <ShieldAlert
          className="w-4 h-4 text-[var(--color-rm-gold)] shrink-0 mt-0.5"
          aria-hidden="true"
        />
        <div>
          <strong className="text-white block font-bold">
            External Participant Verification
          </strong>
          <span>
            External participation is subject to competition-specific eligibility verification.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <label
            htmlFor="extFullName"
            className="block text-xs sm:text-sm font-bold text-white"
          >
            Full Name <span className="text-[var(--color-rm-gold)]">*</span>
          </label>
          <input
            id="extFullName"
            type="text"
            required
            value={formData.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            placeholder="Enter your official full name"
            aria-invalid={Boolean(errors?.fullName)}
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
          />
          {errors?.fullName && (
            <p className="text-xs font-bold text-rose-400">{errors.fullName}</p>
          )}
        </div>

        {/* College or University Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <label
            htmlFor="externalInstitutionName"
            className="block text-xs sm:text-sm font-bold text-white"
          >
            College or University Name <span className="text-[var(--color-rm-gold)]">*</span>
          </label>
          <input
            id="externalInstitutionName"
            type="text"
            required
            value={formData.externalInstitutionName}
            onChange={(e) => onChange("externalInstitutionName", e.target.value)}
            placeholder="Enter your official college or university name"
            aria-invalid={Boolean(errors?.externalInstitutionName)}
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
          />
          {errors?.externalInstitutionName && (
            <p className="text-xs font-bold text-rose-400">
              {errors.externalInstitutionName}
            </p>
          )}
        </div>

        {/* Academic Level */}
        <div className="space-y-1.5">
          <label
            htmlFor="externalAcademicLevel"
            className="block text-xs sm:text-sm font-bold text-white"
          >
            Academic Level <span className="text-[var(--color-rm-gold)]">*</span>
          </label>
          <select
            id="externalAcademicLevel"
            value={formData.externalAcademicLevel}
            onChange={(e) =>
              onChange("externalAcademicLevel", e.target.value as AcademicLevel)
            }
            className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
          >
            {ACADEMIC_LEVELS.map((level) => (
              <option key={level} value={level} className="bg-black text-white">
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Programme or Course */}
        <div className="space-y-1.5">
          <label
            htmlFor="externalProgramme"
            className="block text-xs sm:text-sm font-bold text-white"
          >
            Programme / Course <span className="text-[var(--color-rm-gold)]">*</span>
          </label>
          <input
            id="externalProgramme"
            type="text"
            required
            value={formData.externalProgramme}
            onChange={(e) => onChange("externalProgramme", e.target.value)}
            placeholder="e.g. B.A., B.Sc., M.A."
            aria-invalid={Boolean(errors?.externalProgramme)}
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
          />
          {errors?.externalProgramme && (
            <p className="text-xs font-bold text-rose-400">
              {errors.externalProgramme}
            </p>
          )}
        </div>

        {/* Department or Subject */}
        <div className="space-y-1.5">
          <label
            htmlFor="externalDepartment"
            className="block text-xs sm:text-sm font-bold text-white"
          >
            Department / Subject <span className="text-white/50">(Optional)</span>
          </label>
          <input
            id="externalDepartment"
            type="text"
            value={formData.externalDepartment}
            onChange={(e) => onChange("externalDepartment", e.target.value)}
            placeholder="e.g. Political Science"
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
          />
        </div>

        {/* Current Batch / Academic Session */}
        <div className="space-y-1.5">
          <label
            htmlFor="externalBatch"
            className="block text-xs sm:text-sm font-bold text-white"
          >
            Batch / Academic Session <span className="text-[var(--color-rm-gold)]">*</span>
          </label>
          <input
            id="externalBatch"
            type="text"
            required
            value={formData.externalBatch}
            onChange={(e) => onChange("externalBatch", e.target.value)}
            placeholder="e.g. 2024 - 2027"
            aria-invalid={Boolean(errors?.externalBatch)}
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
          />
          {errors?.externalBatch && (
            <p className="text-xs font-bold text-rose-400">{errors.externalBatch}</p>
          )}
        </div>

        {/* Institution / Student ID (Optional) */}
        <div className="space-y-1.5 sm:col-span-2">
          <label
            htmlFor="externalStudentId"
            className="block text-xs sm:text-sm font-bold text-white"
          >
            Institution ID / Student ID <span className="text-white/50">(Optional)</span>
          </label>
          <input
            id="externalStudentId"
            type="text"
            value={formData.externalStudentId}
            onChange={(e) => onChange("externalStudentId", e.target.value)}
            placeholder="Enter your college identity number if available"
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
          />
        </div>
      </div>
    </div>
  );
};
