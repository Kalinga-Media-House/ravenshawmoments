"use client";

import React from "react";
import { Mail, Phone, ShieldCheck, HeartHandshake } from "lucide-react";
import { CompetitionRegistrationFormData } from "../../types/registration";

export interface RegistrationContactFieldsProps {
  formData: CompetitionRegistrationFormData;
  onChange: <K extends keyof CompetitionRegistrationFormData>(
    field: K,
    value: CompetitionRegistrationFormData[K]
  ) => void;
  errors?: Partial<Record<keyof CompetitionRegistrationFormData, string>>;
}

export const RegistrationContactFields: React.FC<
  RegistrationContactFieldsProps
> = ({ formData, onChange, errors }) => {
  return (
    <div className="space-y-8">
      {/* Contact Section */}
      <fieldset className="space-y-4">
        <legend className="text-sm font-extrabold text-[var(--color-rm-gold)] uppercase tracking-wider block">
          Registration Contact Information
        </legend>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Email Address */}
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="block text-xs sm:text-sm font-bold text-white"
            >
              Email Address <span className="text-[var(--color-rm-gold)]">*</span>
            </label>
            <div className="relative">
              <Mail
                className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors?.email)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
              />
            </div>
            {errors?.email && (
              <p className="text-xs font-bold text-rose-400">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1.5">
            <label
              htmlFor="phone"
              className="block text-xs sm:text-sm font-bold text-white"
            >
              Contact Phone / WhatsApp <span className="text-[var(--color-rm-gold)]">*</span>
            </label>
            <div className="relative">
              <Phone
                className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => onChange("phone", e.target.value)}
                placeholder="e.g. +91 9876543210"
                aria-invalid={Boolean(errors?.phone)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all"
              />
            </div>
            {errors?.phone && (
              <p className="text-xs font-bold text-rose-400">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Privacy Note */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs text-white/80">
          <ShieldCheck
            className="w-4 h-4 text-[var(--color-rm-gold)] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            Your contact information will be used only for competition registration,
            verification, updates, and important communication. We never display your contact
            details publicly.
          </p>
        </div>
      </fieldset>

      {/* Additional Optional Information Section */}
      <fieldset className="space-y-4 pt-4 border-t border-white/10">
        <legend className="text-sm font-extrabold text-[var(--color-rm-gold)] uppercase tracking-wider block">
          Additional Information (Optional)
        </legend>

        {/* Previous Experience */}
        <div className="space-y-1.5">
          <label
            htmlFor="previousExperience"
            className="block text-xs sm:text-sm font-bold text-white"
          >
            Previous Competition Experience / Statements
          </label>
          <textarea
            id="previousExperience"
            rows={3}
            value={formData.previousExperience}
            onChange={(e) => onChange("previousExperience", e.target.value)}
            placeholder="Briefly mention relevant achievements or prior stage participation if applicable"
            className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/20 text-sm font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all resize-none"
          />
        </div>

        {/* Accessibility Requirements */}
        <div className="space-y-3 pt-2">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.accessibilitySupportNeeded}
              onChange={(e) =>
                onChange("accessibilitySupportNeeded", e.target.checked)
              }
              className="w-4 h-4 rounded border-white/30 bg-black/50 accent-[var(--color-rm-gold)]"
            />
            <span className="text-xs sm:text-sm font-bold text-white">
              Do you require any accessibility support for participation?
            </span>
          </label>

          {formData.accessibilitySupportNeeded && (
            <div className="space-y-1.5 pl-7">
              <label
                htmlFor="accessibilitySupportDetails"
                className="block text-xs font-bold text-white/85"
              >
                Please describe your accessibility requirements so our venue coordinators can
                assist you
              </label>
              <textarea
                id="accessibilitySupportDetails"
                rows={2}
                value={formData.accessibilitySupportDetails}
                onChange={(e) =>
                  onChange("accessibilitySupportDetails", e.target.value)
                }
                placeholder="Let us know how we can make your participation seamless and comfortable"
                className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/20 text-xs font-medium text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] transition-all resize-none"
              />
            </div>
          )}
        </div>
      </fieldset>
    </div>
  );
};
