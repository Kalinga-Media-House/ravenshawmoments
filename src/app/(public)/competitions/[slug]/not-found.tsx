import React from "react";
import Link from "next/link";
import { Trophy, ArrowLeft } from "lucide-react";

export default function CompetitionNotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-16 bg-[#FFFDF9]">
      <div className="w-full max-w-2xl bg-white rounded-[28px] border border-[#D7A928]/30 shadow-md px-6 py-10 sm:py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF9F2] border border-[#D7A928]/40 flex items-center justify-center mx-auto text-[#D7A928] shadow-sm">
          <Trophy className="w-8 h-8" aria-hidden="true" />
        </div>

        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#4A0012] tracking-tight">
            Competition Not Found
          </h1>
          <p className="text-sm sm:text-base text-[#62575A] leading-relaxed max-w-md mx-auto font-medium">
            The competition you are looking for may have been moved or is no longer available.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/competitions"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#650018] hover:bg-[#E5B832] hover:text-[#4A0012] border border-[#D7A928] text-sm font-extrabold text-white transition-all duration-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D7A928] focus-visible:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Competitions</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
