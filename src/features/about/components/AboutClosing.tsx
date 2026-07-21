"use client";

import React from "react";
import { Quote, Sparkles } from "lucide-react";

export const AboutClosing: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-t border-[#8F0028]/10 bg-[#FFFDF8] relative overflow-hidden">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* SECTION 13: CENTERED FOOTER QUOTE */}
        <div className="relative p-8 sm:p-14 rounded-3xl bg-gradient-to-br from-[#171214] to-[#261E21] text-white shadow-2xl border border-white/10 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 text-white/5 pointer-events-none">
            <Quote className="w-40 h-40" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8F0028] text-[#E6B325] text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>An Enduring Truth</span>
            </div>
            <blockquote className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white leading-snug tracking-tight max-w-3xl mx-auto">
              &ldquo;Great universities are remembered not only for their buildings and classrooms, but for the people, memories and stories they leave behind.&rdquo;
            </blockquote>
          </div>
        </div>

        {/* Emotional Closing Text */}
        <div className="space-y-4 text-sm sm:text-base md:text-lg text-[#756A6E] leading-[1.8] font-medium max-w-2xl mx-auto pt-4">
          <p className="text-[#8F0028] font-black text-lg sm:text-xl uppercase tracking-wider">
            Preserved For Tomorrow
          </p>
          <p>
            Through the friends who made ordinary days unforgettable. Through departments that became communities and hostels that became homes. Through photographs that carry entire years within a single frame.
          </p>
          <p className="text-[#171214] font-bold pt-2">
            Ravenshaw Moments exists so these stories can remain connected—not only for today, but for every Ravenshawvian who may one day return looking for a piece of the life they once lived here.
          </p>
        </div>
      </div>
    </section>
  );
};
