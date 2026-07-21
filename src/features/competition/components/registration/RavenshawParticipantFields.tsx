"use client";

import React from "react";
import { GraduationCap, User, Building2, BookOpen } from "lucide-react";
import { CompetitionItem, ParticipantType } from "../../types/competition";
import {
  CompetitionRegistrationFormData,
  RavenshawParticipantType,
  AcademicLevel,
} from "../../types/registration";

export interface RavenshawParticipantFieldsProps {
  competition: CompetitionItem;
  formData: CompetitionRegistrationFormData;
  onChange: <K extends keyof CompetitionRegistrationFormData>(
    field: K,
    value: CompetitionRegistrationFormData[K]
  ) => void;
  errors?: Partial<Record<keyof CompetitionRegistrationFormData, string>>;
}

const ACADEMIC_LEVELS: AcademicLevel[] = ["+2", "UG", "PG", "PhD"];

const COMMON_DEPARTMENTS = [
  "English",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Botany",
  "Zoology",
  "Economics",
  "Political Science",
  "History",
  "Odia",
  "Computer Science",
  "Commerce",
  "Philosophy",
  "Psychology",
  "Sociology",
  "Information Technology Management (ITM)",
  "Biotechnology",
  "Geology",
];

export const RavenshawParticipantFields: React.FC<
  RavenshawParticipantFieldsProps
> = ({ competition, formData, onChange, errors }) => {
  const allowedTypes = competition.eligibleParticipantTypes || ["Student"];

  return (
    <div className="space-y-6">
      {/* Participant Type Selector */}
      <fieldset className="space-y-3">
        <legend className="text-xs font-bold text-[var(--color-rm-gold)] uppercase tracking-wider block">
          How are you connected to Ravenshaw?
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(["Student", "Teacher", "Alumni"] as RavenshawParticipantType[]).map(
            (type) => {
              const isEligible = allowedTypes.includes(type as ParticipantType);
              const isSelected = formData.ravenshawParticipantType === type;

              return (
                <button
                  key={type}
                  type="button"
                  disabled={!isEligible}
                  onClick={() => onChange("ravenshawParticipantType", type)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "bg-[var(--color-rm-maroon)] border-[var(--color-rm-gold)] text-white shadow-lg"
                      : isEligible
                      ? "bg-white/5 border-white/15 hover:border-white/30 text-white/85"
                      : "bg-white/5 border-white/5 text-white/40 cursor-not-allowed"
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-wider block">
                    {type}
                  </span>
                  <span className="text-xs text-white/60 block mt-1">
                    {isEligible ? "Eligible Participant" : "Not open for this event"}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </fieldset>

      {/* Common Full Name */}
      <div className="space-y-1.5">
        <label
          htmlFor="fullName"
          className="block text-xs sm:text-sm font-bold text-white"
        >
          Full Name <span className="text-[var(--color-rm-gold)]">*</span>
        </label>
        <input
          id="fullName"
          type="text"
          required
          value={formData.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          placeholder="Enter your official full name"
          aria-invalid={Boolean(errors?.fullName)}
          aria-describedby={errors?.fullName ? "fullName-error" : undefined}
          className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
        />
        {errors?.fullName && (
          <p id="fullName-error" className="text-xs font-bold text-rose-400">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* STUDENT FIELDS */}
      {formData.ravenshawParticipantType === "Student" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Academic Level */}
          <div className="space-y-1.5">
            <label
              htmlFor="academicLevel"
              className="block text-xs sm:text-sm font-bold text-white"
            >
              Academic Level <span className="text-[var(--color-rm-gold)]">*</span>
            </label>
            <select
              id="academicLevel"
              value={formData.academicLevel}
              onChange={(e) =>
                onChange("academicLevel", e.target.value as AcademicLevel)
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

          {/* Department */}
          <div className="space-y-1.5">
            <label
              htmlFor="department"
              className="block text-xs sm:text-sm font-bold text-white"
            >
              Department <span className="text-[var(--color-rm-gold)]">*</span>
            </label>
            <input
              id="department"
              list="ravenshaw-departments-list"
              type="text"
              required
              value={formData.department}
              onChange={(e) => onChange("department", e.target.value)}
              placeholder="Select or enter your department"
              aria-invalid={Boolean(errors?.department)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
            />
            <datalist id="ravenshaw-departments-list">
              {COMMON_DEPARTMENTS.map((dep) => (
                <option key={dep} value={dep} />
              ))}
            </datalist>
            {errors?.department && (
              <p className="text-xs font-bold text-rose-400">
                {errors.department}
              </p>
            )}
          </div>

          {/* Batch or Academic Session */}
          <div className="space-y-1.5">
            <label
              htmlFor="batchOrSession"
              className="block text-xs sm:text-sm font-bold text-white"
            >
              Batch / Academic Session <span className="text-[var(--color-rm-gold)]">*</span>
            </label>
            <input
              id="batchOrSession"
              type="text"
              required
              value={formData.batchOrSession}
              onChange={(e) => onChange("batchOrSession", e.target.value)}
              placeholder="e.g. 2024 - 2027"
              aria-invalid={Boolean(errors?.batchOrSession)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
            />
            {errors?.batchOrSession && (
              <p className="text-xs font-bold text-rose-400">
                {errors.batchOrSession}
              </p>
            )}
          </div>

          {/* Optional Roll Number */}
          <div className="space-y-1.5">
            <label
              htmlFor="rollOrRegistrationNumber"
              className="block text-xs sm:text-sm font-bold text-white"
            >
              Roll / Registration Number <span className="text-white/50">(Optional)</span>
            </label>
            <input
              id="rollOrRegistrationNumber"
              type="text"
              value={formData.rollOrRegistrationNumber}
              onChange={(e) => onChange("rollOrRegistrationNumber", e.target.value)}
              placeholder="e.g. 24BA042"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
            />
          </div>

          {/* Optional Hostel Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="hostelName"
              className="block text-xs sm:text-sm font-bold text-white"
            >
              Hostel Affiliation <span className="text-white/50">(Optional)</span>
            </label>
            <input
              id="hostelName"
              type="text"
              value={formData.hostelName}
              onChange={(e) => onChange("hostelName", e.target.value)}
              placeholder="e.g. East Hostel, West Hostel"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
            />
          </div>

          {/* Optional Organization Name */}
          <div className="space-y-1.5">
            <label
              htmlFor="organizationName"
              className="block text-xs sm:text-sm font-bold text-white"
            >
              Organization / Society <span className="text-white/50">(Optional)</span>
            </label>
            <input
              id="organizationName"
              type="text"
              value={formData.organizationName}
              onChange={(e) => onChange("organizationName", e.target.value)}
              placeholder="e.g. Debating Society"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
            />
          </div>
        </div>
      )}

      {/* TEACHER FIELDS */}
      {formData.ravenshawParticipantType === "Teacher" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="teacherDepartment"
              className="block text-xs sm:text-sm font-bold text-white"
            >
              Department <span className="text-[var(--color-rm-gold)]">*</span>
            </label>
            <input
              id="teacherDepartment"
              type="text"
              required
              value={formData.department}
              onChange={(e) => onChange("department", e.target.value)}
              placeholder="Enter your department"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="teacherDesignation"
              className="block text-xs sm:text-sm font-bold text-white"
            >
              Designation <span className="text-[var(--color-rm-gold)]">*</span>
            </label>
            <input
              id="teacherDesignation"
              type="text"
              required
              value={formData.teacherDesignation}
              onChange={(e) => onChange("teacherDesignation", e.target.value)}
              placeholder="e.g. Assistant Professor, Professor"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
            />
          </div>
        </div>
      )}

      {/* ALUMNI FIELDS */}
      {formData.ravenshawParticipantType === "Alumni" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="alumniDepartment"
              className="block text-xs sm:text-sm font-bold text-white"
            >
              Graduated Department <span className="text-[var(--color-rm-gold)]">*</span>
            </label>
            <input
              id="alumniDepartment"
              type="text"
              required
              value={formData.department}
              onChange={(e) => onChange("department", e.target.value)}
              placeholder="Enter your department"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="alumniGraduationBatch"
              className="block text-xs sm:text-sm font-bold text-white"
            >
              Graduation Batch <span className="text-[var(--color-rm-gold)]">*</span>
            </label>
            <input
              id="alumniGraduationBatch"
              type="text"
              required
              value={formData.alumniGraduationBatch}
              onChange={(e) => onChange("alumniGraduationBatch", e.target.value)}
              placeholder="e.g. Class of 2021"
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
            />
          </div>
        </div>
      )}
    </div>
  );
};
