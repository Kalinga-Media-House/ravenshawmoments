import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowRight } from "lucide-react";

export const ContributorPrivacy: React.FC = () => {
  return (
    <section
      aria-labelledby="contributor-privacy-heading"
      className="py-8 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-5xl mx-auto">
        <div className="bg-white shadow-sm rounded-2xl p-5 sm:p-6 border border-[#8F0028]/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#8F0028]/10 border border-[#E8B83F]/30 flex items-center justify-center text-[#8F0028] shrink-0 mt-0.5 sm:mt-0">
              <ShieldAlert className="w-4 h-4" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h2
                id="contributor-privacy-heading"
                className="text-sm font-bold text-[#171214]"
              >
                Contributor Privacy
              </h2>
              <p className="text-xs text-[#756A6E] leading-relaxed max-w-3xl">
                Private contact information, payment details, transaction
                information, and restricted profile information are never
                displayed in the public Contributors section. Public recognition
                appears only according to approved contributor preferences.
              </p>
            </div>
          </div>

          <Link
            href="/privacy-policy"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8F0028] hover:text-[#171214] transition-colors shrink-0"
          >
            <span>Privacy Policy</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
};
