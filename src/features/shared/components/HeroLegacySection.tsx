"use client";

import React from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { LatestNotifications } from "./LatestNotifications";

export const HeroLegacySection = () => {
  const revealRef = useScrollReveal();

  return (
    <section className="relative w-full py-20 md:py-28 lg:py-32 bg-transparent z-20" ref={revealRef as React.RefObject<HTMLDivElement>}>
      {/* Remove hard gradients since we inherit the global dark theme, just add a separator line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[--color-rm-gold-soft]/10 to-transparent" />

      <div className="container relative z-10 mx-auto px-[clamp(1.25rem,4vw,3rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-24 items-center">
          
          {/* Left Column: Text */}
          <div className="flex flex-col rm-reveal">
            <div className="flex items-center gap-4 mb-5 sm:mb-6">
              <span className="w-8 h-[2px] bg-[var(--color-maroon)]" />
              <span className="text-xs sm:text-sm md:text-base font-semibold tracking-[0.15em] text-[var(--color-maroon)] uppercase">
                Our Legacy
              </span>
            </div>
            
            <h2 className="text-[clamp(2.25rem,4.5vw,3.5rem)] font-extrabold rm-heading-primary leading-[1.12] mb-6 sm:mb-8 tracking-tight">
              A <span className="heading-highlight">Legacy</span> That Lives Through Us
            </h2>
            
            <p className="text-[clamp(1rem,2vw,1.125rem)] rm-text-body leading-[1.7] mb-5 sm:mb-6 font-medium">
              Ravenshaw is more than a university. It is where friendships begin, dreams take shape, achievements become history, and ordinary moments turn into memories we carry for life.
            </p>
            
            <p className="text-[clamp(1rem,2vw,1.125rem)] rm-text-muted leading-[1.7]">
              Ravenshaw Moments brings these memories together in one digital home, connecting students, alumni, teachers, departments, hostels, organizations, and generations while preserving every story for the future.
            </p>
          </div>

          {/* Right Column: Latest Notifications */}
          <div className="rm-reveal flex flex-col h-full lg:pl-4 xl:pl-8">
            <LatestNotifications />
          </div>

        </div>
      </div>
    </section>
  );
};
