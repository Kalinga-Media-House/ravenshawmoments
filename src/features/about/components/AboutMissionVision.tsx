"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Target, Eye, Sparkles } from "lucide-react";

export const AboutMissionVision: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#8F0028]/10 border border-[#8F0028]/20 text-xs font-black uppercase tracking-[0.2em] text-[#8F0028]">
            <Sparkles className="w-3.5 h-3.5 text-[#E6B325]" />
            <span>Purpose & Direction</span>
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171214] tracking-tight">
            Our Vision & Mission
          </h2>
          <p className="text-[#756A6E] text-base font-medium">
            Two guiding beacons steering our commitment to the Ravenshaw community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-stretch">
          {/* SECTION 3: OUR VISION */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -6 }}
            className="relative rounded-3xl bg-gradient-to-br from-[#171214] via-[#261E21] to-[#171214] text-white p-8 sm:p-12 lg:p-14 shadow-2xl border border-white/10 overflow-hidden flex flex-col justify-between h-full"
          >
            {/* Subtle Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#8F0028]/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E6B325]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#8F0028] border border-[#E6B325]/40 flex items-center justify-center text-[#E6B325] shadow-lg">
                <Eye className="w-7 h-7" />
              </div>
              <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#E6B325]">
                Our Vision
              </p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                To build the world&apos;s most comprehensive digital archive and community platform dedicated to Ravenshaw University.
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed font-medium">
                We imagine a future where every generation of Ravenshawvians can remain permanently tethered to their alma mater—revisiting their department journeys, rediscovering batch memories, and passing the torch of excellence across centuries.
              </p>
            </div>

            <div className="relative z-10 mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-semibold">
              <span>Long-Term Aspirations</span>
              <span className="text-[#E6B325] font-bold">Forever Ravenshaw</span>
            </div>
          </motion.div>

          {/* SECTION 4: OUR MISSION */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            whileHover={{ y: -6 }}
            className="relative rounded-3xl bg-white text-[#171214] p-8 sm:p-12 lg:p-14 shadow-xl border border-[#8F0028]/15 overflow-hidden flex flex-col justify-between h-full group"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#E6B325]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="w-14 h-14 rounded-2xl bg-[#8F0028]/10 border border-[#8F0028]/20 group-hover:bg-[#8F0028] text-[#8F0028] group-hover:text-[#E6B325] flex items-center justify-center transition-all duration-300 shadow-sm">
                <Target className="w-7 h-7" />
              </div>
              <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#8F0028]">
                Our Mission
              </p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#171214] tracking-tight leading-tight">
                To systematically safeguard our memories, celebrate academic excellence, and connect alumni across all eras.
              </h3>
              <p className="text-[#756A6E] text-sm sm:text-base leading-relaxed font-medium">
                We are dedicated to building a living ecosystem that honours our past while empowering our future. Through digital profiles, verified achievements, and historic archives, we ensure every student, hostel, department, and milestone is preserved with dignity and purpose.
              </p>
            </div>

            <div className="relative z-10 mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-semibold group-hover:text-[#8F0028] transition-colors">
              <span>Daily Commitment</span>
              <span className="text-[#8F0028] font-bold">Living Ecosystem</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
