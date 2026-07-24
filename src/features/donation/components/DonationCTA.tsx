"use client";

import React from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

export const DonationCTA: React.FC = () => {
  return (
    <section aria-labelledby="donation-cta-heading" className="py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#FFFDF8]">
      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3A0016] via-[#4A0D1A] to-[#2A0010]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative z-10 p-10 sm:p-16 md:p-20 text-center space-y-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] backdrop-blur-sm">
              <Heart className="w-8 h-8" aria-hidden="true" />
            </div>

            <h2 id="donation-cta-heading" className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight font-serif">
              Help Preserve What Time<br />Should Never Erase
            </h2>

            <p className="text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
              Ravenshaw lives through the people, memories, friendships,
              achievements, and stories carried across generations. Your support
              can help Ravenshaw Moments continue building a lasting digital home
              for those experiences.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <button
                onClick={() => {
                  const element = document.getElementById("donate");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C8A046] text-white text-sm font-black uppercase tracking-widest hover:shadow-[0_10px_25px_rgba(212,175,55,0.4)] transition-all hover:-translate-y-1"
              >
                <span>Make a Contribution</span>
                <Heart className="w-4 h-4" aria-hidden="true" />
              </button>
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-bold uppercase tracking-widest hover:bg-white/20 transition-all hover:-translate-y-1"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
