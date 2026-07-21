import React from "react";
import Link from "next/link";
import { Trophy, ArrowLeft } from "lucide-react";

export default function AchievementNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-[var(--color-rm-gold)]/10 border border-[var(--color-rm-gold)]/30 flex items-center justify-center mb-6">
        <Trophy className="w-10 h-10 text-[var(--color-rm-gold)] opacity-80" aria-hidden="true" />
      </div>

      <h1 className="text-3xl sm:text-4xl font-extrabold rm-heading-primary text-white mb-4">
        Achievement Not Found
      </h1>

      <p className="text-base sm:text-lg rm-text-body font-medium text-white/75 max-w-md mb-8 leading-relaxed">
        The achievement you are looking for may have been moved or is no longer available.
      </p>

      <Link
        href="/achievements"
        className="inline-flex items-center gap-2.5 px-8 py-4 bg-[var(--color-rm-gold)] text-[#12070B] font-bold rounded-xl hover:bg-white hover:shadow-[0_10px_25px_rgba(217,164,65,0.3)] hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden="true" />
        Back to Achievements
      </Link>
    </div>
  );
}
