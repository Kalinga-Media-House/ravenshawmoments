"use client";

import React from "react";
import Image from "next/image";
import { Edit3, CheckCircle2, Image as ImageIcon, Users, Share2, UserCheck } from "lucide-react";
import { MemorySubmissionFormData, MemorySubmissionStep } from "../../types/submission";

export interface MemorySubmissionReviewProps {
  formData: MemorySubmissionFormData;
  onEditStep: (step: MemorySubmissionStep) => void;
}

export const MemorySubmissionReview: React.FC<MemorySubmissionReviewProps> = ({
  formData,
  onEditStep,
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-extrabold text-white mb-1">
          Review Your Submission
        </h2>
        <p className="text-xs sm:text-sm text-white/70">
          Please confirm that all details below are accurate before submitting your memory for editorial review.
        </p>
      </div>

      {/* Section 1: About the Memory */}
      <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-white/15 bg-black/30 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-rm-gold)]">
            Step 1: About the Memory
          </h3>
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-[var(--color-rm-gold)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-rm-gold)] rounded"
          >
            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
            Edit
          </button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="sm:col-span-2">
            <dt className="text-white/50 font-semibold mb-0.5">Title</dt>
            <dd className="font-extrabold text-white text-base">{formData.title || "Untitled Memory"}</dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="text-white/50 font-semibold mb-0.5">Short Description</dt>
            <dd className="text-white/90">{formData.shortDescription || "None provided"}</dd>
          </div>

          <div>
            <dt className="text-white/50 font-semibold mb-0.5">Category</dt>
            <dd className="font-bold text-[var(--color-rm-gold)]">{formData.category}</dd>
          </div>

          <div>
            <dt className="text-white/50 font-semibold mb-0.5">Timeframe</dt>
            <dd className="text-white/90">
              {formData.approximateDateOnly
                ? "Approximate / Unspecified Date"
                : formData.memoryDate || formData.memoryYear || formData.academicSession || "Not specified"}
            </dd>
          </div>

          <div>
            <dt className="text-white/50 font-semibold mb-0.5">Location</dt>
            <dd className="text-white/90">{formData.location || "Ravenshaw University Campus"}</dd>
          </div>

          <div className="sm:col-span-2 pt-2 border-t border-white/10">
            <dt className="text-white/50 font-semibold mb-1">Story Narrative</dt>
            <dd className="text-white/90 whitespace-pre-line leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">
              {formData.fullStory || "No story text entered."}
            </dd>
          </div>
        </dl>
      </div>

      {/* Section 2: Photos and Attribution */}
      <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-white/15 bg-black/30 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-rm-gold)] flex items-center gap-2">
            <ImageIcon className="w-4 h-4" aria-hidden="true" />
            Step 2: Photos and Attribution ({formData.images.length})
          </h3>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-[var(--color-rm-gold)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-rm-gold)] rounded"
          >
            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
            Edit
          </button>
        </div>

        {formData.images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {formData.images.map((img) => (
              <div key={img.id} className="space-y-1">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-black/50 border border-white/10">
                  <Image
                    src={img.previewUrl}
                    alt={img.file.name}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  {img.isCover && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[var(--color-rm-gold)] text-black text-[9px] font-extrabold">
                      Cover
                    </span>
                  )}
                </div>
                {img.caption && (
                  <p className="text-[11px] text-white/70 truncate">{img.caption}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-white/60 italic">Story-only memory (No photographs uploaded).</p>
        )}

        <div className="pt-3 border-t border-white/10 text-xs sm:text-sm text-white/80 space-y-1">
          <p>
            <span className="text-white/50">Photographer:</span>{" "}
            {formData.photographerName || "Not specified"}
          </p>
          {formData.creditNote && (
            <p>
              <span className="text-white/50">Credit Note:</span> {formData.creditNote}
            </p>
          )}
        </div>
      </div>

      {/* Section 3: People and Community */}
      <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-white/15 bg-black/30 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-rm-gold)] flex items-center gap-2">
            <Users className="w-4 h-4" aria-hidden="true" />
            Step 3: People and Community
          </h3>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-[var(--color-rm-gold)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-rm-gold)] rounded"
          >
            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
            Edit
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs text-white/50 font-semibold mb-1">People in Memory ({formData.people.length})</p>
            {formData.people.length > 0 ? (
              <ul className="flex flex-wrap gap-2">
                {formData.people.map((p) => (
                  <li
                    key={p.id}
                    className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-xs font-bold text-white"
                  >
                    {p.name} {p.role && `(${p.role})`}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-white/60">No additional people listed.</p>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div>
              <span className="text-white/50 block">Department:</span>
              <span className="font-semibold text-white">{formData.departmentName || "Not Applicable"}</span>
            </div>
            <div>
              <span className="text-white/50 block">Hostel:</span>
              <span className="font-semibold text-white">{formData.hostelName || "Not Applicable"}</span>
            </div>
            <div>
              <span className="text-white/50 block">Organization:</span>
              <span className="font-semibold text-white">{formData.organizationName || "Not Applicable"}</span>
            </div>
            <div>
              <span className="text-white/50 block">Batch:</span>
              <span className="font-semibold text-white">{formData.batch || "Not Applicable"}</span>
            </div>
            <div>
              <span className="text-white/50 block">Event:</span>
              <span className="font-semibold text-white">{formData.eventName || "Not Applicable"}</span>
            </div>
            <div>
              <span className="text-white/50 block">Achievement:</span>
              <span className="font-semibold text-white">{formData.achievementName || "Not Applicable"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Contributor & Consent */}
      <div className="rm-glass-card rounded-2xl p-5 sm:p-6 border border-white/15 bg-black/30 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-rm-gold)] flex items-center gap-2">
            <UserCheck className="w-4 h-4" aria-hidden="true" />
            Step 4: Contributor & Consent
          </h3>
          <button
            type="button"
            onClick={() => onEditStep(4)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-[var(--color-rm-gold)] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-rm-gold)] rounded"
          >
            <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
            Edit
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-white/50 block font-semibold">Contributor Name</span>
            <span className="font-bold text-white">{formData.contributorName || "Not provided"}</span>
          </div>
          <div>
            <span className="text-white/50 block font-semibold">Email Address</span>
            <span className="font-bold text-white">{formData.contributorEmail || "Not provided"}</span>
          </div>
          <div>
            <span className="text-white/50 block font-semibold">Attribution Display</span>
            <span className="font-semibold text-white">
              {formData.displayPublicly ? "Public Name Display" : "Anonymous Attribution"}
            </span>
          </div>
          <div>
            <span className="text-white/50 block font-semibold">Memory Visibility</span>
            <span className="font-bold text-[var(--color-rm-gold)]">{formData.visibility}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center gap-2 text-xs text-green-300">
          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" aria-hidden="true" />
          <span>All required permission and publication consents verified.</span>
        </div>
      </div>
    </div>
  );
};
