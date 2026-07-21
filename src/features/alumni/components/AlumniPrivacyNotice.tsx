import React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";

export const AlumniPrivacyNotice: React.FC = () => {
  return (
    <section aria-label="Alumni Profile Privacy Notice" className="pb-16 pt-8 px-4 sm:px-6 lg:px-8 bg-[#FFF9F4]">
      <div 
        className="max-w-[1000px] mx-auto bg-[#FFF9F4] rounded-[18px] flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
        style={{
          border: "1px solid rgba(242,185,54,0.4)",
          padding: "clamp(24px, 4vw, 30px)",
        }}
      >
        <div className="flex flex-col sm:flex-row items-start gap-4 flex-grow">
          <div className="w-[42px] h-[42px] rounded-full bg-[#520016] border-[2px] border-[#F2B936]/30 flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-[18px] h-[18px] text-[#F2B936]" aria-hidden="true" />
          </div>
          <div className="space-y-1.5 max-w-2xl">
            <h3 className="text-[16px] sm:text-[18px] font-[800] text-[#520016]">Your Information, Your Choice</h3>
            <p className="text-[14px] text-[#4A4346] leading-relaxed">
              You control what appears publicly on your alumni profile. Personal information remains private unless you choose to share it.
            </p>
          </div>
        </div>

        <Link
          href="/privacy-policy"
          className="shrink-0 w-full md:w-auto inline-flex items-center justify-center px-5 py-2.5 rounded-lg border-[1.5px] border-[#520016] text-[#520016] hover:bg-[#520016] hover:text-white text-[13px] font-[700] uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F2B936] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFF9F4]"
        >
          View Privacy Policy
        </Link>
      </div>
    </section>
  );
};
