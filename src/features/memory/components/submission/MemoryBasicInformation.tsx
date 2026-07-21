"use client";

import React from "react";
import { MemorySubmissionFormData } from "../../types/submission";
import { MemoryCategory } from "../../types/memory";

export interface MemoryBasicInformationProps {
  formData: MemorySubmissionFormData;
  onChange: <K extends keyof MemorySubmissionFormData>(
    field: K,
    value: MemorySubmissionFormData[K]
  ) => void;
  errors: Partial<Record<keyof MemorySubmissionFormData, string>>;
}

const MEMORY_CATEGORIES: MemoryCategory[] = [
  "Campus Life",
  "Friendship",
  "Department",
  "Hostel Life",
  "Organizations",
  "Events",
  "Celebrations",
  "Festivals",
  "Academic Life",
  "Achievements",
  "Sports",
  "Culture",
  "Farewell",
  "Alumni",
  "Everyday Moments",
  "Heritage",
  "Other",
];

export const MemoryBasicInformation: React.FC<MemoryBasicInformationProps> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg sm:text-xl font-extrabold text-white mb-1">
          About the Memory
        </h2>
        <p className="text-xs sm:text-sm text-white/70">
          Provide the essential details and narrative of this Ravenshaw memory.
        </p>
      </div>

      {/* Title */}
      <div>
        <label
          htmlFor="memory-title"
          className="block text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] mb-2"
        >
          Memory Title <span className="text-red-400">*</span>
        </label>
        <input
          id="memory-title"
          type="text"
          required
          value={formData.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Give this memory a meaningful title"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "memory-title-error" : undefined}
          className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
        />
        {errors.title && (
          <p id="memory-title-error" className="text-xs text-red-400 mt-1.5 font-semibold">
            {errors.title}
          </p>
        )}
      </div>

      {/* Short Description */}
      <div>
        <label
          htmlFor="memory-short-desc"
          className="block text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] mb-2"
        >
          Short Description <span className="text-red-400">*</span>
        </label>
        <input
          id="memory-short-desc"
          type="text"
          required
          value={formData.shortDescription}
          onChange={(e) => onChange("shortDescription", e.target.value)}
          placeholder="Describe this memory in a few words"
          aria-invalid={Boolean(errors.shortDescription)}
          aria-describedby={errors.shortDescription ? "memory-short-desc-error" : undefined}
          className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
        />
        {errors.shortDescription && (
          <p id="memory-short-desc-error" className="text-xs text-red-400 mt-1.5 font-semibold">
            {errors.shortDescription}
          </p>
        )}
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="memory-category"
          className="block text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] mb-2"
        >
          Memory Category <span className="text-red-400">*</span>
        </label>
        <select
          id="memory-category"
          required
          value={formData.category}
          onChange={(e) => onChange("category", e.target.value as MemoryCategory)}
          aria-invalid={Boolean(errors.category)}
          aria-describedby={errors.category ? "memory-category-error" : undefined}
          className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/60 border border-white/20 focus:border-[var(--color-rm-gold)] text-white text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
        >
          {MEMORY_CATEGORIES.map((cat) => (
            <option key={cat} value={cat} className="bg-[var(--color-rm-bg-deep)] text-white">
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p id="memory-category-error" className="text-xs text-red-400 mt-1.5 font-semibold">
            {errors.category}
          </p>
        )}
      </div>

      {/* Full Story */}
      <div>
        <label
          htmlFor="memory-story"
          className="block text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] mb-2"
        >
          Tell the Story <span className="text-red-400">*</span>
        </label>
        <textarea
          id="memory-story"
          required
          rows={6}
          value={formData.fullStory}
          onChange={(e) => onChange("fullStory", e.target.value)}
          placeholder="What happened? Who was there? Why is this memory meaningful to you?"
          aria-invalid={Boolean(errors.fullStory)}
          aria-describedby={errors.fullStory ? "memory-story-error" : undefined}
          className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
        />
        {errors.fullStory && (
          <p id="memory-story-error" className="text-xs text-red-400 mt-1.5 font-semibold">
            {errors.fullStory}
          </p>
        )}
      </div>

      {/* Date & Location Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="memory-date"
            className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2"
          >
            Memory Date (Optional)
          </label>
          <input
            id="memory-date"
            type="date"
            disabled={formData.approximateDateOnly}
            value={formData.memoryDate}
            onChange={(e) => onChange("memoryDate", e.target.value)}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white text-base sm:text-sm disabled:opacity-40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          />
          <div className="mt-2 flex items-center gap-2">
            <input
              id="approx-date-check"
              type="checkbox"
              checked={formData.approximateDateOnly}
              onChange={(e) => onChange("approximateDateOnly", e.target.checked)}
              className="w-4 h-4 rounded border-white/30 bg-black/40 text-[var(--color-rm-gold)] focus:ring-[var(--color-rm-gold)]"
            />
            <label htmlFor="approx-date-check" className="text-xs text-white/70">
              I do not remember the exact date
            </label>
          </div>
        </div>

        <div>
          <label
            htmlFor="memory-year"
            className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2"
          >
            Memory Year (Optional)
          </label>
          <input
            id="memory-year"
            type="text"
            value={formData.memoryYear}
            onChange={(e) => onChange("memoryYear", e.target.value)}
            placeholder="e.g. 2026"
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          />
        </div>

        <div>
          <label
            htmlFor="academic-session"
            className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2"
          >
            Academic Session (Optional)
          </label>
          <input
            id="academic-session"
            type="text"
            value={formData.academicSession}
            onChange={(e) => onChange("academicSession", e.target.value)}
            placeholder="e.g. 2025-2026"
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          />
        </div>

        <div>
          <label
            htmlFor="memory-location"
            className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2"
          >
            Location (Optional)
          </label>
          <input
            id="memory-location"
            type="text"
            value={formData.location}
            onChange={(e) => onChange("location", e.target.value)}
            placeholder="Where did this memory take place?"
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          />
        </div>
      </div>
    </div>
  );
};
