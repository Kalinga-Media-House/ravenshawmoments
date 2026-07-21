
import React from "react";
import Link from "next/link";
import { CalendarOff, ArrowLeft } from "lucide-react";

export default function EventDetailNotFound() {
  return (
    <div className="container mx-auto py-32 md:py-40 px-4 max-w-2xl text-center">
      <div className="rm-reveal flex flex-col items-center">
        <div className="inline-flex items-center justify-center p-5 bg-[var(--color-rm-gold)]/10 text-[var(--color-rm-gold)] rounded-2xl mb-8 border border-[var(--color-rm-gold)]/20 shadow-[0_0_30px_rgba(217,164,65,0.1)]">
          <CalendarOff className="w-10 h-10" strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 rm-heading-primary tracking-tight">
          Event Not Found
        </h1>
        <p className="text-lg rm-text-body mb-10 max-w-md mx-auto leading-relaxed">
          The event you are looking for may have been removed, renamed, or does not exist. Please check the URL or browse our events directory.
        </p>
        <Link 
          href="/events"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-rm-gold)] text-[#12070B] font-bold rounded-xl hover:bg-white transition-all duration-300 shadow-[0_8px_20px_rgba(217,164,65,0.2)] group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={2.5} />
          Back to Events
        </Link>
      </div>
    </div>
  );
}
