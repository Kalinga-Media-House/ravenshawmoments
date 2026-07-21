import React from "react";
import Link from "next/link";
import { GraduationCap } from "lucide-react";

export const AlumniEmptyState: React.FC = () => {
  return (
    <section aria-label="Alumni Directory Empty State" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[700px] mx-auto bg-[#FFF9F4] rounded-[24px] p-8 sm:p-14 border border-[#F2B936]/30 text-center space-y-6 shadow-[0_12px_40px_rgba(82,0,22,0.06)]">
        <div className="w-16 h-16 rounded-[18px] bg-[#520016]/5 border border-[#520016]/10 flex items-center justify-center text-[#520016] mx-auto">
          <GraduationCap className="w-8 h-8 text-[#520016]" aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-[28px] font-[800] text-[#520016] tracking-tight">
            Our Alumni Community Is Growing
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#4A4346] max-w-lg mx-auto leading-relaxed">
            Be among the first to create your profile and help reconnect generations of Ravenshawvians.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Link
            href="/register"
            className="inline-flex items-center justify-center bg-[#520016] text-[#F2B936] px-8 py-3.5 rounded-xl text-[14px] sm:text-[15px] font-[700] tracking-wide hover:bg-[#68001C] transition-all shadow-md hover:-translate-y-0.5"
          >
            Create Your Alumni Profile
          </Link>
        </div>
      </div>
    </section>
  );
};
