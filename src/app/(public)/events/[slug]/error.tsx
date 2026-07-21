
"use client";
import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RotateCcw } from "lucide-react";

export default function EventDetailError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container mx-auto py-32 md:py-40 px-4 max-w-2xl text-center">
      <div className="flex flex-col items-center">
        <div className="inline-flex items-center justify-center p-5 bg-red-500/10 text-red-400 rounded-2xl mb-8 border border-red-500/20 shadow-[0_0_30px_rgba(220,38,38,0.1)]">
          <AlertTriangle className="w-10 h-10" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 rm-heading-primary tracking-tight">
          Something Went Wrong
        </h1>
        <p className="text-lg rm-text-body mb-10 max-w-md mx-auto leading-relaxed">
          We encountered an unexpected error while loading this event. Please try again or return to the events directory.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-rm-gold)] text-[#12070B] font-bold rounded-xl hover:bg-white transition-all duration-300 shadow-[0_8px_20px_rgba(217,164,65,0.2)] group"
          >
            <RotateCcw className="w-4 h-4 transition-transform group-hover:-rotate-90" strokeWidth={2.5} />
            Try Again
          </button>
          <Link 
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 rm-glass-card border border-[var(--color-rm-glass-border)] rounded-xl text-sm font-bold text-[var(--color-rm-text-primary)] hover:text-[var(--color-rm-gold)] hover:border-[var(--color-rm-gold)]/40 transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
            Back to Events
          </Link>
        </div>
      </div>
    </div>
  );
}
