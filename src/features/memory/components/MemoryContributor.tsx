"use client";

import React from "react";
import Link from "next/link";
import { User, Camera, ArrowUpRight } from "lucide-react";
import { MemoryItem } from "../types/memory";

export interface MemoryContributorProps {
  memory: MemoryItem;
}

export const MemoryContributor: React.FC<MemoryContributorProps> = ({ memory }) => {
  const hasContributor = Boolean(memory.contributorName);
  const hasPhotographer = Boolean(memory.photographerName);

  if (!hasContributor && !hasPhotographer) {
    return null;
  }

  return (
    <section aria-label="Memory attribution" className="w-full max-w-[760px] mx-auto my-10 space-y-6">
      {/* Contributor Card */}
      {hasContributor && (
        <div className="rm-glass-card rounded-[1.75rem] p-6 sm:p-8 border border-[var(--color-rm-glass-border)] bg-black/30">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--color-rm-maroon)]/40 border border-[var(--color-rm-gold)]/40 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-[var(--color-maroon)]" aria-hidden="true" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-maroon)] block">
                  Shared By
                </span>
                <p className="text-base sm:text-lg font-extrabold text-white">
                  {memory.contributorName}
                </p>
                {memory.batch && (
                  <p className="text-xs font-medium text-black/60 mt-0.5">
                    Batch of {memory.batch}
                  </p>
                )}
              </div>
            </div>

            {memory.contributorProfileSlug && (
              <Link
                href={`/profile/${memory.contributorProfileSlug}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black/10 hover:bg-white/15 text-xs font-bold text-white transition-colors self-start sm:self-center"
              >
                View Profile
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--color-maroon)]" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Photographer Credit Card */}
      {hasPhotographer && (
        <div className="rm-glass-card rounded-2xl p-5 border border-[var(--color-rm-glass-border)] bg-black/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-black/5 border border-black/10 flex items-center justify-center shrink-0">
              <Camera className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-white/50 block">
                Photographed By
              </span>
              <p className="text-sm font-bold text-white">{memory.photographerName}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
