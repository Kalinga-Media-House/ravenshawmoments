import React from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

export const DonationCTA: React.FC = () => {
  return (
    <section
      aria-labelledby="donation-cta-heading"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-rm-maroon)] via-[#6a0d28] to-[var(--color-rm-bg-deep)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(217,164,65,0.08),transparent_70%)]" />

          <div className="relative p-8 sm:p-12 md:p-16 text-center space-y-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border border-[#E8B83F]/30 text-[#8F0028]">
              <Heart className="w-7 h-7" aria-hidden="true" />
            </div>

            <h2
              id="donation-cta-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight"
            >
              Help Preserve What Time Should Never Erase
            </h2>

            <p className="text-sm sm:text-base text-white/80 max-w-2xl mx-auto leading-relaxed">
              Ravenshaw lives through the people, memories, friendships,
              achievements, and stories carried across generations. Your support
              can help Ravenshaw Moments continue building a lasting digital home
              for those experiences.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#8F0028] text-white text-sm font-black uppercase tracking-wider hover:bg-[#8F0028]/90 transition-all shadow-lg"
              >
                <span>Explore Ravenshaw Moments</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white border border-[#8F0028]/10 text-[#171214] text-sm font-bold uppercase tracking-wider hover:bg-white transition-all"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
