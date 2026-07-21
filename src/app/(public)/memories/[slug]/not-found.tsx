import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function MemoryNotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[var(--color-rm-bg-deep)] text-white px-6 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[var(--color-rm-maroon)]/40 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)] mb-6">
        <Sparkles className="w-8 h-8" aria-hidden="true" />
      </div>

      <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-rm-gold)] block mb-3">
        MEMORY ARCHIVE
      </span>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold rm-heading-primary text-white mb-4">
        Memory Not Found
      </h1>

      <p className="text-base sm:text-lg text-white/70 max-w-md mx-auto mb-8 leading-relaxed">
        The memory you are looking for may have been moved, is unavailable, or is not publicly visible.
      </p>

      <Link
        href="/memories"
        className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[var(--color-rm-gold)] hover:bg-[var(--color-rm-gold)]/90 text-black font-extrabold text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to Memories
      </Link>
    </div>
  );
}
