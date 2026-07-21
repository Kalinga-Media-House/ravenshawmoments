"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Bookmark,
  Trophy,
  Users,
  Landmark,
  HeartHandshake,
  Sparkles,
  Compass,
} from "lucide-react";

const SEVEN_PILLARS = [
  {
    number: "I",
    icon: Bookmark,
    title: "Preserve Memories",
    description:
      "Safeguard photographs, stories, traditions, hostel life, classroom moments, festivals and unforgettable experiences.",
  },
  {
    number: "II",
    icon: Trophy,
    title: "Celebrate Excellence",
    description:
      "Recognize academic success, cultural achievements, sports, research, leadership and innovation.",
  },
  {
    number: "III",
    icon: Users,
    title: "Connect Generations",
    description:
      "Bridge current students, alumni, teachers and future Ravenshavians through one lifelong community.",
  },
  {
    number: "IV",
    icon: Landmark,
    title: "Honor Heritage",
    description:
      "Protect Ravenshaw University's history, traditions, architecture and institutional legacy.",
  },
  {
    number: "V",
    icon: HeartHandshake,
    title: "Empower Communities",
    description:
      "Strengthen departments, hostels, organizations, clubs, societies and student leadership.",
  },
  {
    number: "VI",
    icon: Sparkles,
    title: "Inspire Participation",
    description:
      "Encourage competitions, volunteering, events, creativity and meaningful student engagement.",
  },
  {
    number: "VII",
    icon: Compass,
    title: "Build the Future",
    description:
      "Create a permanent digital archive that future generations of Ravenshavians can proudly inherit.",
  },
];

export const AboutSevenPillars: React.FC = () => {
  return (
    <section
      aria-labelledby="about-seven-pillars-heading"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#FFFDF8] via-[#FAF6ED] to-[#FFFDF8] relative overflow-hidden"
    >
      {/* Decorative architectural background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#8F0028]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8F0028]/10 border border-[#8F0028]/20 text-xs font-black uppercase tracking-[0.2em] text-[#8F0028] shadow-sm">
            <Landmark className="w-3.5 h-3.5 text-[#E6B325]" />
            <span>Our Seven Pillars</span>
          </div>
          <h2
            id="about-seven-pillars-heading"
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#171214] tracking-tight leading-[1.1]"
          >
            Seven Pillars of Ravenshaw Legacy
          </h2>
          <p className="text-base sm:text-lg text-[#756A6E] leading-relaxed font-medium pt-2 max-w-2xl mx-auto">
            Inspired by Ravenshaw University&apos;s iconic Seven Pillars, these values represent the foundation upon which Ravenshaw Moments preserves our memories, celebrates our achievements, and connects generations.
          </p>
        </div>

        {/* 7 Pillars Premium Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8 items-stretch">
          {SEVEN_PILLARS.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            const isSeventh = idx === 6;

            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -8 }}
                className={`group relative p-4 sm:p-9 rounded-2xl sm:rounded-3xl bg-white border border-[#8F0028]/15 shadow-md hover:shadow-2xl hover:border-[#8F0028]/40 transition-all duration-300 flex flex-col justify-between h-full overflow-hidden ${
                  isSeventh
                    ? "col-span-2 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-white via-white to-[#FFFDF8] border-2 border-[#E6B325]/50 shadow-xl"
                    : ""
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4 sm:mb-7">
                    <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#8F0028]/10 to-[#8F0028]/5 group-hover:from-[#8F0028] group-hover:to-[#6B0019] text-[#8F0028] group-hover:text-[#E6B325] flex items-center justify-center transition-all duration-300 shadow-sm group-hover:scale-105">
                      <IconComponent className="w-5 h-5 sm:w-8 sm:h-8" />
                    </div>
                    <span className="text-xs sm:text-base font-black font-serif tracking-widest text-[#8F0028]/40 group-hover:text-[#8F0028] transition-colors">
                      Pillar {pillar.number}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-2xl font-black text-[#171214] mb-1.5 sm:mb-3 group-hover:text-[#8F0028] transition-colors tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-[11px] sm:text-base text-[#756A6E] leading-relaxed font-medium">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-4 sm:mt-8 pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-xs font-bold text-gray-400 group-hover:text-[#8F0028] transition-colors">
                  <span className="uppercase tracking-wider hidden sm:inline">Foundation Value</span>
                  <span className="uppercase tracking-wider sm:hidden">Value</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#E6B325]" />
                    <span className="text-[10px] sm:text-xs font-bold text-[#8F0028]">0{idx + 1} / 07</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
