"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";

const BOYS_HOSTELS = [
  "East Hostel",
  "West Hostel",
  "J.C. Hostel",
  "New Hostel",
  "New P.G. Hostel",
  "Dharmapada Hostel",
  "Lalitgiri Hostel",
];

const GIRLS_HOSTELS = [
  "Parija Hostel",
  "Kathajodi Hostel",
  "Bhargabi Hostel",
  "Devi Hostel",
  "Daya Hostel",
  "Mahanadi Hostel",
];

export const HeroHostelSection = () => {
  return (
    <section className="relative w-full py-20 sm:py-28 bg-background overflow-hidden z-20">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
      <div className="absolute top-0 left-1/4 size-[50vw] rounded-full bg-primary/5 blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="w-8 h-0.5 bg-[#D4AF37]" />
            <span className="text-xs sm:text-sm md:text-base font-bold tracking-widest text-primary uppercase">
              Hostel Communities
            </span>
            <span className="w-8 h-0.5 bg-[#D4AF37]" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight mb-5">
            The Heartbeat of <span className="text-primary">Campus Life</span>
          </h2>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed font-medium max-w-2xl mx-auto">
            From late-night conversations and shared meals to celebrations, friendships, and unforgettable traditions, every hostel carries memories that remain with us long after college life ends.
          </p>
        </motion.div>

        {/* Hostel Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-8 max-w-6xl mx-auto">
          {/* Boys' Hostels Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/hostels?category=boys"
              className="group relative flex flex-col h-full min-h-[420px] rounded-3xl overflow-hidden transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-4 focus-visible:ring-offset-background hover:-translate-y-1.5 hover:shadow-2xl border border-white/10 hover:border-[#D4AF37]/50"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#2A0810] via-[#4A0E1B] to-[#8F0028] z-0 transition-transform duration-700 ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.18)_0%,transparent_60%)] z-0" />

              <div className="relative z-10 flex flex-col h-full p-6 sm:p-8 lg:p-9 text-white justify-between space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-[#D4AF37]">
                      <Home className="size-6" />
                    </div>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-bold uppercase tracking-wider text-white/90">
                      7 Hostels
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
                    Boys' Hostels
                  </h3>

                  <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 max-w-md">
                    Explore the communities, traditions, events, friendships, and memories created across Ravenshaw's boys' hostels.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {BOYS_HOSTELS.map((hostel) => (
                      <span
                        key={hostel}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-black/25 backdrop-blur-sm rounded-xl border border-white/15"
                      >
                        {hostel}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 flex items-center justify-between border-t border-white/15">
                  <span className="text-[#D4AF37] font-bold text-sm tracking-wider uppercase transition-colors duration-300 group-hover:text-white">
                    Explore Boys' Hostels
                  </span>
                  <div className="size-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#2A0810]">
                    <ArrowRight className="size-5 text-[#D4AF37] transition-all duration-300 group-hover:text-[#2A0810] group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Girls' Hostels Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-5% 0px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/hostels?category=girls"
              className="group relative flex flex-col h-full min-h-[420px] rounded-3xl overflow-hidden transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-4 focus-visible:ring-offset-background hover:-translate-y-1.5 hover:shadow-2xl border border-white/10 hover:border-[#D4AF37]/50"
            >
              <div className="absolute inset-0 bg-gradient-to-bl from-[#35000E] via-[#6B001E] to-[#8F0028] z-0 transition-transform duration-700 ease-out group-hover:scale-105" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.18)_0%,transparent_60%)] z-0" />

              <div className="relative z-10 flex flex-col h-full p-6 sm:p-8 lg:p-9 text-white justify-between space-y-6">
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="size-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 text-[#D4AF37]">
                      <Home className="size-6" />
                    </div>
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-xs font-bold uppercase tracking-wider text-white/90">
                      6 Hostels
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white mb-3 tracking-tight">
                    Girls' Hostels
                  </h3>

                  <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 max-w-md">
                    Discover the stories, celebrations, achievements, friendships, and lasting memories shared across Ravenshaw's girls' hostels.
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {GIRLS_HOSTELS.map((hostel) => (
                      <span
                        key={hostel}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-black/25 backdrop-blur-sm rounded-xl border border-white/15"
                      >
                        {hostel}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-5 flex items-center justify-between border-t border-white/15">
                  <span className="text-[#D4AF37] font-bold text-sm tracking-wider uppercase transition-colors duration-300 group-hover:text-white">
                    Explore Girls' Hostels
                  </span>
                  <div className="size-10 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#D4AF37] group-hover:text-[#2A0810]">
                    <ArrowRight className="size-5 text-[#D4AF37] transition-all duration-300 group-hover:text-[#2A0810] group-hover:translate-x-0.5" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
