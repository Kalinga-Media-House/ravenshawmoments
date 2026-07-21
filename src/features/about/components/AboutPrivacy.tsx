import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export const AboutPrivacy: React.FC = () => {
  return (
    <section
      aria-labelledby="about-privacy-heading"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-3xl p-8 sm:p-12 border border-[#8F0028]/10 space-y-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-[#8F0028]/10 border border-[#E8B83F]/30 flex items-center justify-center text-[#8F0028] shrink-0 shadow-lg">
              <ShieldCheck className="w-7 h-7" aria-hidden="true" />
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8F0028]">
                  Built with Responsibility
                </p>
                <h2
                  id="about-privacy-heading"
                  className="text-xl sm:text-2xl font-black text-[#171214] tracking-tight"
                >
                  Memories Matter. Privacy Matters Too.
                </h2>
              </div>
              <div className="space-y-4 text-sm text-[#756A6E] leading-relaxed font-medium">
                <p>
                  Ravenshaw Moments is designed to celebrate shared experiences
                  while respecting personal choices. Public profiles,
                  photographs, memories, achievements, and community information
                  should appear according to approved visibility, verification,
                  and moderation rules.
                </p>
                <ul className="space-y-2 mt-4 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-[#8F0028] mt-0.5">•</span>
                    <span>Public information is separated from private account information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8F0028] mt-0.5">•</span>
                    <span>Profile photographs follow approved visibility settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8F0028] mt-0.5">•</span>
                    <span>Private contact details are not displayed publicly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8F0028] mt-0.5">•</span>
                    <span>Public memories and photographs follow approval rules</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8F0028] mt-0.5">•</span>
                    <span>Community roles use defined permissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8F0028] mt-0.5">•</span>
                    <span>Public profiles respect approved privacy settings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#8F0028] mt-0.5">•</span>
                    <span>Reporting and moderation are supported only where implemented</span>
                  </li>
                </ul>
              </div>
              <div className="pt-2">
                <Link
                  href="/privacy-policy"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8F0028] hover:text-[#171214] transition-colors"
                >
                  <span>Review Privacy Policy</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
