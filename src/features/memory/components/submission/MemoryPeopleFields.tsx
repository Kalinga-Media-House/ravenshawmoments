"use client";

import React, { useState } from "react";
import { UserPlus, Trash2, Users } from "lucide-react";
import { MemorySubmissionFormData, MemoryPersonEntry } from "../../types/submission";

export interface MemoryPeopleFieldsProps {
  formData: MemorySubmissionFormData;
  onChange: <K extends keyof MemorySubmissionFormData>(
    field: K,
    value: MemorySubmissionFormData[K]
  ) => void;
}

export const MemoryPeopleFields: React.FC<MemoryPeopleFieldsProps> = ({
  formData,
  onChange,
}) => {
  const [personName, setPersonName] = useState("");
  const [personDept, setPersonDept] = useState("");
  const [personBatch, setPersonBatch] = useState("");
  const [personRole, setPersonRole] = useState("");

  const handleAddPerson = () => {
    if (!personName.trim()) return;

    const newPerson: MemoryPersonEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: personName.trim(),
      department: personDept.trim() || undefined,
      batch: personBatch.trim() || undefined,
      role: personRole.trim() || undefined,
    };

    onChange("people", [...formData.people, newPerson]);
    setPersonName("");
    setPersonDept("");
    setPersonBatch("");
    setPersonRole("");
  };

  const handleRemovePerson = (idToRemove: string) => {
    onChange(
      "people",
      formData.people.filter((p) => p.id !== idToRemove)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-extrabold text-white mb-1">
          People in This Memory (Optional)
        </h2>
        <p className="text-xs sm:text-sm text-white/70">
          Only add people you know and can identify accurately. Do not use automated facial recognition or infer identities.
        </p>
      </div>

      {/* Add Person Form Box */}
      <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-white/15 bg-black/30 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="person-name-input"
              className="block text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] mb-1.5"
            >
              Person Name
            </label>
            <input
              id="person-name-input"
              type="text"
              value={personName}
              onChange={(e) => setPersonName(e.target.value)}
              placeholder="e.g. Subrat Mohanty"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
            />
          </div>

          <div>
            <label
              htmlFor="person-role-input"
              className="block text-xs font-semibold text-white/80 mb-1.5"
            >
              Role in the Memory (Optional)
            </label>
            <input
              id="person-role-input"
              type="text"
              value={personRole}
              onChange={(e) => setPersonRole(e.target.value)}
              placeholder="e.g. Professor, Batchmate, Speaker"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
            />
          </div>

          <div>
            <label
              htmlFor="person-dept-input"
              className="block text-xs font-semibold text-white/80 mb-1.5"
            >
              Department (Optional)
            </label>
            <input
              id="person-dept-input"
              type="text"
              value={personDept}
              onChange={(e) => setPersonDept(e.target.value)}
              placeholder="e.g. Botany, Physics"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
            />
          </div>

          <div>
            <label
              htmlFor="person-batch-input"
              className="block text-xs font-semibold text-white/80 mb-1.5"
            >
              Batch (Optional)
            </label>
            <input
              id="person-batch-input"
              type="text"
              value={personBatch}
              onChange={(e) => setPersonBatch(e.target.value)}
              placeholder="e.g. 2026"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={!personName.trim()}
          onClick={handleAddPerson}
          className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-rm-gold)]/20 hover:bg-[var(--color-rm-gold)]/30 disabled:opacity-40 disabled:cursor-not-allowed border border-[var(--color-rm-gold)]/40 text-xs sm:text-sm font-bold text-[var(--color-rm-gold)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
        >
          <UserPlus className="w-4 h-4" aria-hidden="true" />
          Add Person to Memory
        </button>
      </div>

      {/* Added People List */}
      {formData.people.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/80 flex items-center gap-2">
            <Users className="w-4 h-4 text-[var(--color-rm-gold)]" aria-hidden="true" />
            Added People ({formData.people.length})
          </h3>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {formData.people.map((person) => (
              <li
                key={person.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-sm font-bold text-white truncate">{person.name}</p>
                  <p className="text-xs text-white/60 truncate">
                    {[person.role, person.department, person.batch && `Batch of ${person.batch}`]
                      .filter(Boolean)
                      .join(", ") || "Ravenshaw Community"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePerson(person.id)}
                  className="w-9 h-9 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-300 flex items-center justify-center shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  aria-label={`Remove ${person.name}`}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
