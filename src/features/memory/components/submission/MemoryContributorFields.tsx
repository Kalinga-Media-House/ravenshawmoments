"use client";

import React from "react";
import { MemorySubmissionFormData, MemoryVisibilityOption } from "../../types/submission";

export interface MemoryContributorFieldsProps {
  formData: MemorySubmissionFormData;
  onChange: <K extends keyof MemorySubmissionFormData>(
    field: K,
    value: MemorySubmissionFormData[K]
  ) => void;
  errors: Partial<Record<keyof MemorySubmissionFormData, string>>;
}

export const MemoryContributorFields: React.FC<MemoryContributorFieldsProps> = ({
  formData,
  onChange,
  errors,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-extrabold text-white mb-1">
          About You (Contributor Information)
        </h2>
        <p className="text-xs sm:text-sm text-white/70">
          We may use your contact information only to communicate about this submission.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="contributor-name"
            className="block text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] mb-2"
          >
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            id="contributor-name"
            type="text"
            required
            value={formData.contributorName}
            onChange={(e) => onChange("contributorName", e.target.value)}
            placeholder="Your full name"
            aria-invalid={Boolean(errors.contributorName)}
            aria-describedby={errors.contributorName ? "contributor-name-error" : undefined}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          />
          {errors.contributorName && (
            <p id="contributor-name-error" className="text-xs text-red-400 mt-1.5 font-semibold">
              {errors.contributorName}
            </p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label
            htmlFor="contributor-email"
            className="block text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] mb-2"
          >
            Email Address <span className="text-red-400">*</span>
          </label>
          <input
            id="contributor-email"
            type="email"
            required
            value={formData.contributorEmail}
            onChange={(e) => onChange("contributorEmail", e.target.value)}
            placeholder="your.email@example.com"
            aria-invalid={Boolean(errors.contributorEmail)}
            aria-describedby={errors.contributorEmail ? "contributor-email-error" : undefined}
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          />
          {errors.contributorEmail && (
            <p id="contributor-email-error" className="text-xs text-red-400 mt-1.5 font-semibold">
              {errors.contributorEmail}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div className="sm:col-span-2">
          <label
            htmlFor="contributor-phone"
            className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2"
          >
            Phone Number (Optional)
          </label>
          <input
            id="contributor-phone"
            type="tel"
            value={formData.contributorPhone}
            onChange={(e) => onChange("contributorPhone", e.target.value)}
            placeholder="Optional contact number for editorial verification"
            className="w-full min-h-[46px] px-4 py-2.5 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          />
          <p className="text-xs text-white/50 mt-1">
            We never display email addresses or phone numbers publicly.
          </p>
        </div>
      </div>

      {/* Attribution Preference */}
      <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-white/15 bg-black/30 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)]">
          Public Attribution Preference
        </h3>
        <div className="space-y-2.5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="displayPublicly"
              checked={formData.displayPublicly}
              onChange={() => onChange("displayPublicly", true)}
              className="mt-0.5 w-4 h-4 text-[var(--color-rm-gold)] bg-black/40 border-white/30 focus:ring-[var(--color-rm-gold)]"
            />
            <div>
              <span className="text-sm font-bold text-white block">
                Display my name publicly with this memory
              </span>
              <span className="text-xs text-white/60">
                Your name will be shown in the Shared By section on the memory story page.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="radio"
              name="displayPublicly"
              checked={!formData.displayPublicly}
              onChange={() => onChange("displayPublicly", false)}
              className="mt-0.5 w-4 h-4 text-[var(--color-rm-gold)] bg-black/40 border-white/30 focus:ring-[var(--color-rm-gold)]"
            />
            <div>
              <span className="text-sm font-bold text-white block">
                Publish without showing my name (Anonymous Attribution)
              </span>
              <span className="text-xs text-white/60">
                Moderators will verify your contact details privately, but your name will not appear publicly.
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Memory Visibility Options */}
      <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-white/15 bg-black/30 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)]">
          Memory Visibility
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(["Public", "Ravenshaw Community", "Private Archive"] as MemoryVisibilityOption[]).map(
            (opt) => {
              const isSelected = formData.visibility === opt;
              const descriptions: Record<MemoryVisibilityOption, string> = {
                Public: "Visible to everyone after approval.",
                "Ravenshaw Community": "Visible only to signed-in Ravenshaw Moments members.",
                "Private Archive": "Visible only to you and authorized archive moderators.",
              };

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange("visibility", opt)}
                  className={`p-4 rounded-xl text-left transition-all border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)] ${
                    isSelected
                      ? "bg-[var(--color-rm-maroon)]/40 border-[var(--color-rm-gold)] text-white"
                      : "bg-white/5 border-white/10 hover:border-white/30 text-white/80"
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)] block mb-1">
                    {opt}
                  </span>
                  <span className="text-xs text-white/70 leading-relaxed block">
                    {descriptions[opt]}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};
