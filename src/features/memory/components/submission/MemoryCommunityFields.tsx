"use client";

import React from "react";
import { MemorySubmissionFormData } from "../../types/submission";
import { RAVENSHAW_DEPARTMENTS } from "@/lib/master-data/departments";
import { RAVENSHAW_HOSTELS } from "@/lib/master-data/hostels";
import { RAVENSHAW_ORGANIZATIONS } from "@/lib/master-data/organizations";
import { RAVENSHAW_BATCHES } from "@/lib/master-data/batches";
import { EVENTS } from "@/features/event/data/events";
import { ACHIEVEMENT_ITEMS } from "@/features/achievement/data/achievements";

export interface MemoryCommunityFieldsProps {
  formData: MemorySubmissionFormData;
  onChange: <K extends keyof MemorySubmissionFormData>(
    field: K,
    value: MemorySubmissionFormData[K]
  ) => void;
}

export const MemoryCommunityFields: React.FC<MemoryCommunityFieldsProps> = ({
  formData,
  onChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-extrabold text-white mb-1">
          Connect This Memory (Optional)
        </h2>
        <p className="text-xs sm:text-sm text-white/70">
          Link your story with Ravenshaw departments, hostels, organizations, events, or batches.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Department */}
        <div>
          <label
            htmlFor="connect-department"
            className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2"
          >
            Department
          </label>
          <select
            id="connect-department"
            value={formData.departmentName}
            onChange={(e) => onChange("departmentName", e.target.value)}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            <option value="" className="bg-[var(--color-rm-bg-deep)] text-white">
              Not Applicable
            </option>
            {RAVENSHAW_DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept} className="bg-[var(--color-rm-bg-deep)] text-white">
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Hostel */}
        <div>
          <label
            htmlFor="connect-hostel"
            className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2"
          >
            Hostel
          </label>
          <select
            id="connect-hostel"
            value={formData.hostelName}
            onChange={(e) => onChange("hostelName", e.target.value)}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            <option value="" className="bg-[var(--color-rm-bg-deep)] text-white">
              Not Applicable
            </option>
            {RAVENSHAW_HOSTELS.map((hst) => (
              <option key={hst} value={hst} className="bg-[var(--color-rm-bg-deep)] text-white">
                {hst}
              </option>
            ))}
          </select>
        </div>

        {/* Organization */}
        <div>
          <label
            htmlFor="connect-organization"
            className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2"
          >
            Organization / Club
          </label>
          <select
            id="connect-organization"
            value={formData.organizationName}
            onChange={(e) => onChange("organizationName", e.target.value)}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            <option value="" className="bg-[var(--color-rm-bg-deep)] text-white">
              Not Applicable
            </option>
            {RAVENSHAW_ORGANIZATIONS.map((org) => (
              <option key={org} value={org} className="bg-[var(--color-rm-bg-deep)] text-white">
                {org}
              </option>
            ))}
          </select>
        </div>

        {/* Batch */}
        <div>
          <label
            htmlFor="connect-batch"
            className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2"
          >
            Batch Year
          </label>
          <select
            id="connect-batch"
            value={formData.batch}
            onChange={(e) => onChange("batch", e.target.value)}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            <option value="" className="bg-[var(--color-rm-bg-deep)] text-white">
              Not Applicable
            </option>
            {RAVENSHAW_BATCHES.slice(0, 50).map((yr) => (
              <option key={yr} value={yr} className="bg-[var(--color-rm-bg-deep)] text-white">
                Class of {yr}
              </option>
            ))}
          </select>
        </div>

        {/* Event */}
        <div>
          <label
            htmlFor="connect-event"
            className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2"
          >
            Associated Event
          </label>
          <select
            id="connect-event"
            value={formData.eventName}
            onChange={(e) => onChange("eventName", e.target.value)}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            <option value="" className="bg-[var(--color-rm-bg-deep)] text-white">
              Not Applicable
            </option>
            {EVENTS.map((evt) => (
              <option key={evt.id} value={evt.title} className="bg-[var(--color-rm-bg-deep)] text-white">
                {evt.title}
              </option>
            ))}
          </select>
        </div>

        {/* Achievement */}
        <div>
          <label
            htmlFor="connect-achievement"
            className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2"
          >
            Associated Achievement
          </label>
          <select
            id="connect-achievement"
            value={formData.achievementName}
            onChange={(e) => onChange("achievementName", e.target.value)}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            <option value="" className="bg-[var(--color-rm-bg-deep)] text-white">
              Not Applicable
            </option>
            {ACHIEVEMENT_ITEMS.map((ach) => (
              <option key={ach.id} value={ach.title} className="bg-[var(--color-rm-bg-deep)] text-white">
                {ach.title}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
