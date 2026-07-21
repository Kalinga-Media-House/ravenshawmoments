import React from "react";
import Link from "next/link";
import { UserCheck, UserPlus } from "lucide-react";

export const AlumniDirectoryCTA: React.FC = () => {
  return (
    <section aria-labelledby="alumni-cta-heading" className="py-14 px-4 sm:px-6 lg:px-8 bg-[#FFF9F4]">
      <div className="max-w-[1100px] mx-auto text-center mb-10">
        <h2
          id="alumni-cta-heading"
          className="text-[#520016] text-[clamp(28px,4vw,36px)] font-[800] tracking-tight mb-4"
        >
          Become Part of Ravenshaw&apos;s Living Legacy
        </h2>
        <p className="text-[#4A4346] text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
          Create your alumni profile or claim an existing profile to reconnect with your community and preserve your journey.
        </p>
      </div>

      <div className="max-w-[1100px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* CARD 1: Create Profile */}
        <div 
          className="relative overflow-hidden flex flex-col items-start text-left"
          style={{
            background: "linear-gradient(145deg, #520016, #7A0022)",
            border: "1px solid rgba(242,185,54,0.30)",
            borderRadius: "20px",
            padding: "30px",
          }}
        >
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-5 shrink-0 border border-[rgba(242,185,54,0.2)]">
            <UserPlus className="w-6 h-6 text-[#F2B936]" aria-hidden="true" />
          </div>
          <h3 className="text-white text-[20px] sm:text-[22px] font-[800] tracking-tight mb-3">
            Create Your Alumni Profile
          </h3>
          <p className="text-[rgba(255,255,255,0.78)] text-[15px] leading-relaxed mb-8 flex-grow">
            Build your place in the Ravenshaw community and preserve your academic journey, achievements, memories, and connections.
          </p>
          <Link
            href="/register"
            className="group w-full sm:w-auto inline-flex items-center justify-center bg-[#F2B936] text-[#520016] px-6 h-[48px] rounded-xl text-[15px] font-[700] tracking-wide transition-all duration-300 shadow-md hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(242,185,54,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F2B936] focus-visible:ring-offset-[#520016]"
          >
            Create Your Profile
          </Link>
        </div>

        {/* CARD 2: Find or Claim Profile */}
        <div 
          className="relative overflow-hidden flex flex-col items-start text-left"
          style={{
            background: "linear-gradient(145deg, #520016, #7A0022)",
            border: "1px solid rgba(242,185,54,0.30)",
            borderRadius: "20px",
            padding: "30px",
          }}
        >
          <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-5 shrink-0 border border-[rgba(242,185,54,0.2)]">
            <UserCheck className="w-6 h-6 text-[#F2B936]" aria-hidden="true" />
          </div>
          <h3 className="text-white text-[20px] sm:text-[22px] font-[800] tracking-tight mb-3">
            Find or Claim Your Profile
          </h3>
          <p className="text-[rgba(255,255,255,0.78)] text-[15px] leading-relaxed mb-8 flex-grow">
            Search for an existing alumni profile and securely claim it to update your information and reconnect with your batch.
          </p>
          <Link
            href="/profile"
            className="group w-full sm:w-auto inline-flex items-center justify-center bg-[#F2B936] text-[#520016] px-6 h-[48px] rounded-xl text-[15px] font-[700] tracking-wide transition-all duration-300 shadow-md hover:-translate-y-[2px] hover:shadow-[0_8px_20px_rgba(242,185,54,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#F2B936] focus-visible:ring-offset-[#520016]"
          >
            Find or Claim Your Profile
          </Link>
        </div>

      </div>
    </section>
  );
};
