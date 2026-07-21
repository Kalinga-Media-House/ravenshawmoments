"use client";

import React from "react";
import { Users, UserPlus, Trash2, ShieldAlert, User } from "lucide-react";
import { CompetitionItem } from "../../types/competition";
import {
  CompetitionRegistrationFormData,
  TeamMemberInput,
  AcademicLevel,
} from "../../types/registration";

export interface TeamRegistrationFieldsProps {
  competition: CompetitionItem;
  formData: CompetitionRegistrationFormData;
  onChange: <K extends keyof CompetitionRegistrationFormData>(
    field: K,
    value: CompetitionRegistrationFormData[K]
  ) => void;
  errors?: Partial<Record<keyof CompetitionRegistrationFormData, string>>;
}

const ACADEMIC_LEVELS: AcademicLevel[] = ["+2", "UG", "PG", "PhD"];

export const TeamRegistrationFields: React.FC<TeamRegistrationFieldsProps> = ({
  competition,
  formData,
  onChange,
  errors,
}) => {
  const isTeamCompetition =
    competition.teamAllowed || competition.participationMode === "Team";

  const minMembers = competition.minimumTeamSize || 1;
  const maxMembers = competition.maximumTeamSize || 15;

  if (!isTeamCompetition) {
    return (
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-2">
        <div className="flex items-center gap-2.5 text-[var(--color-rm-gold)] font-bold">
          <User className="w-5 h-5" aria-hidden="true" />
          <h3 className="text-base font-extrabold text-white">
            Individual Registration
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
          This competition requires individual entry. Your participant information above will
          be registered directly for the competition rounds.
        </p>
      </div>
    );
  }

  const handleAddMember = () => {
    if (formData.teamMembers.length >= maxMembers) return;
    const newMember: TeamMemberInput = {
      id: `member-${Date.now()}`,
      fullName: "",
      origin: "Ravenshawvian",
      academicLevel: "UG",
      departmentName: "",
      batchOrSession: "",
    };
    onChange("teamMembers", [...formData.teamMembers, newMember]);
  };

  const handleRemoveMember = (idToRemove: string) => {
    onChange(
      "teamMembers",
      formData.teamMembers.filter((m) => m.id !== idToRemove)
    );
  };

  const handleMemberChange = <K extends keyof TeamMemberInput>(
    memberId: string,
    key: K,
    value: TeamMemberInput[K]
  ) => {
    const updated = formData.teamMembers.map((m) =>
      m.id === memberId ? { ...m, [key]: value } : m
    );
    onChange("teamMembers", updated);
  };

  return (
    <div className="space-y-6">
      {/* Team Rules Summary Card */}
      <div className="p-5 rounded-2xl bg-black/50 border border-[var(--color-rm-gold)]/40 space-y-3">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Users
              className="w-5 h-5 text-[var(--color-rm-gold)]"
              aria-hidden="true"
            />
            <h3 className="text-base font-extrabold text-white">
              Team Registration Rules
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full bg-[var(--color-rm-maroon)] text-xs font-bold text-[var(--color-rm-gold)]">
            {minMembers} to {maxMembers} Members
          </span>
        </div>

        {competition.teamMemberEligibility && (
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            <strong className="text-[var(--color-rm-gold)]">
              Member Eligibility:
            </strong>{" "}
            {competition.teamMemberEligibility}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Team Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <label
            htmlFor="teamName"
            className="block text-xs sm:text-sm font-bold text-white"
          >
            Official Team Name <span className="text-[var(--color-rm-gold)]">*</span>
          </label>
          <input
            id="teamName"
            type="text"
            required
            value={formData.teamName}
            onChange={(e) => onChange("teamName", e.target.value)}
            placeholder="Enter your official team name"
            aria-invalid={Boolean(errors?.teamName)}
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
          />
          {errors?.teamName && (
            <p className="text-xs font-bold text-rose-400">{errors.teamName}</p>
          )}
        </div>

        {/* Team Leader Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <label
            htmlFor="teamLeaderName"
            className="block text-xs sm:text-sm font-bold text-white"
          >
            Team Leader Name <span className="text-[var(--color-rm-gold)]">*</span>
          </label>
          <input
            id="teamLeaderName"
            type="text"
            required
            value={formData.teamLeaderName || formData.fullName}
            onChange={(e) => onChange("teamLeaderName", e.target.value)}
            placeholder="Name of primary contact / team captain"
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
          />
        </div>
      </div>

      {/* Dynamic Team Members List */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-extrabold text-[var(--color-rm-gold)] uppercase tracking-wider">
            Team Members ({formData.teamMembers.length} / {maxMembers})
          </h4>

          <button
            type="button"
            disabled={formData.teamMembers.length >= maxMembers}
            onClick={handleAddMember}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--color-rm-maroon)] hover:bg-[var(--color-rm-maroon)]/90 disabled:opacity-50 border border-[var(--color-rm-gold)]/50 text-xs font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            <UserPlus className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Add Team Member</span>
          </button>
        </div>

        {formData.teamMembers.length === 0 && (
          <div className="p-8 rounded-2xl bg-white/5 border border-dashed border-white/20 text-center text-xs sm:text-sm text-white/60">
            Click &ldquo;Add Team Member&rdquo; above to list your performing or participating
            team members.
          </div>
        )}

        {formData.teamMembers.map((member, idx) => (
          <div
            key={member.id}
            className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-black text-[var(--color-rm-gold)] uppercase tracking-wider">
                Member #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveMember(member.id)}
                aria-label={`Remove team member ${member.fullName || idx + 1}`}
                className="text-white/60 hover:text-rose-400 transition-colors p-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <label className="block text-xs font-bold text-white">
                  Member Full Name
                </label>
                <input
                  type="text"
                  required
                  value={member.fullName}
                  onChange={(e) =>
                    handleMemberChange(member.id, "fullName", e.target.value)
                  }
                  placeholder="Official name"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[var(--color-rm-gold)]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-white">
                  Academic Level
                </label>
                <select
                  value={member.academicLevel}
                  onChange={(e) =>
                    handleMemberChange(
                      member.id,
                      "academicLevel",
                      e.target.value as AcademicLevel
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[var(--color-rm-gold)]"
                >
                  {ACADEMIC_LEVELS.map((level) => (
                    <option key={level} value={level} className="bg-black text-white">
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-white">
                  Department / Subject
                </label>
                <input
                  type="text"
                  value={member.departmentName || ""}
                  onChange={(e) =>
                    handleMemberChange(member.id, "departmentName", e.target.value)
                  }
                  placeholder="e.g. English"
                  className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-1 focus:ring-[var(--color-rm-gold)]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
