"use client";

import React from "react";
import Link from "next/link";
import { Camera, Image as ImageIcon, ArrowRight } from "lucide-react";

export const MemoryContributionCTA = () => {
  return (
    <section aria-label="Contribute a Memory" className="w-full mt-20 mb-12">
      <div className="relative overflow-hidden rm-glass-card rounded-[2.5rem] p-8 sm:p-12 lg:p-16 border border-[var(--color-rm-glass-border)] text-center max-w-4xl mx-auto">
        {/* Subtle Background Accent */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[var(--color-rm-maroon)]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-[var(--color-rm-gold)]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--color-rm-gold)]/15 border border-[var(--color-rm-gold)]/30 flex items-center justify-center mb-6">
            <Camera className="w-7 h-7 text-[var(--color-maroon)]" aria-hidden="true" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold rm-heading-primary mb-4">
            Your Memories Belong Here
          </h2>

          <p className="text-sm sm:text-base lg:text-lg rm-text-body text-black/80 font-medium max-w-2xl mb-8 leading-relaxed">
            Every photograph and story adds another chapter to the shared journey of Ravenshaw. Preserve the moments that future generations deserve to remember.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              href="/memories/submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[var(--color-rm-gold)] text-[#12070B] font-bold text-sm sm:text-base transition-all duration-300 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#12070B]"
            >
              <Camera className="w-5 h-5" aria-hidden="true" />
              Share a Memory
            </Link>

            <Link
              href="/gallery"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-black/5 hover:bg-black/10 text-white border border-black/20 font-bold text-sm sm:text-base transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)]"
            >
              <ImageIcon className="w-5 h-5 text-[var(--color-maroon)]" aria-hidden="true" />
              Explore the Gallery
              <ArrowRight className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
