import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";

export const AlumniProfilePrivacyNotice: React.FC = () => {
  return (
    <section aria-labelledby="alumni-privacy-heading" className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto rm-glass-card rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-rm-maroon)]/80 border border-[var(--color-rm-gold)]/30 flex items-center justify-center text-[var(--color-rm-gold)] shrink-0 mt-0.5 sm:mt-0">
            <ShieldAlert className="w-4 h-4" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 id="alumni-privacy-heading" className="text-sm font-bold text-white">
              Profile Privacy
            </h2>
            <p className="text-xs text-white/70 leading-relaxed max-w-3xl">
              This profile displays information the alumnus has chosen and is
              approved to share publicly. Private contact details and restricted
              account information remain hidden.
            </p>
          </div>
        </div>

        <Link
          href="/privacy-policy"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--color-rm-gold)] hover:text-white transition-colors shrink-0"
        >
          <span>Privacy Policy</span>
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
};
