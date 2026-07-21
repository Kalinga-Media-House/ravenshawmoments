"use client";

import React from "react";
import Link from "next/link";
import { UserPlus, LogIn, ArrowRight } from "lucide-react";

export const CompetitionCTACards: React.FC = () => {
  return (
    <section aria-labelledby="cta-heading" className="w-full">
      <h2 id="cta-heading" className="sr-only">Join Ravenshaw Moments</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
        {/* New Member CTA */}
        <div className="relative overflow-hidden p-8 sm:p-10 rounded-[26px] bg-gradient-to-br from-[#35000C] via-[#520012] to-[#700019] border border-[#D9A928]/25 shadow-[0_18px_45px_rgba(55,0,14,0.22)] group flex flex-col justify-between h-full">
          {/* Subtle illumination */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(231,187,69,0.10),transparent_40%)] pointer-events-none" />
          
          <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500 pointer-events-none">
            <UserPlus className="w-48 h-48 text-[#E7BB45]" />
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#D9A928]/10 flex items-center justify-center text-[#E7BB45] mb-6 border border-[#D9A928]/30">
                <UserPlus className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-black text-[#FFF9EF] mb-3">
                New to Ravenshaw?
              </h3>
              <p className="text-[#F4E5CF]/85 mb-8 max-w-sm leading-relaxed">
                Create your verified profile to participate in competitions and track your achievements.
              </p>
            </div>
            
            <div className="mt-auto">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E7BB45] text-[#35000C] font-bold transition-all duration-300 hover:bg-[#F0C95C] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7BB45]"
              >
                Register Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Existing Member CTA */}
        <div className="relative overflow-hidden p-8 sm:p-10 rounded-[26px] bg-gradient-to-br from-[#4A0011] via-[#650018] to-[#79001D] border border-[#D9A928]/20 shadow-[0_18px_45px_rgba(55,0,14,0.22)] group flex flex-col justify-between h-full">
          {/* Subtle illumination */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(231,187,69,0.06),transparent_40%)] pointer-events-none" />
          
          {/* Decorative Arrow / Icon */}
          <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-all duration-500 pointer-events-none">
            <LogIn className="w-48 h-48 text-[#E7BB45]" />
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[#E7BB45] mb-6 border border-[#E7BB45]/30">
                <LogIn className="w-6 h-6" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-black text-[#FFF9EF] mb-3">
                Already a Member?
              </h3>
              <p className="text-[#F4E5CF]/85 mb-8 max-w-sm leading-relaxed">
                Sign in to manage your registrations, view your current rankings, and submit your entries.
              </p>
            </div>
            
            <div className="mt-auto">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 bg-[#FFF9EF] text-[#4A0011] border border-[#FFF9EF] hover:bg-[#E7BB45] hover:text-[#35000C] hover:border-[#E7BB45] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7BB45]"
              >
                Sign In <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>


    </section>
  );
};
