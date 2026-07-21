"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock, ShieldCheck, Users, Heart } from "lucide-react";

export const AboutWhy: React.FC = () => {
  return (
    <section
      aria-labelledby="about-why-heading"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FFFDF8]"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side: Ravenshaw Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative h-[420px] sm:h-[520px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
            <Image
              src="/hero/hero-2.webp"
              alt="Ravenshaw University Historic Architecture and Students"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171214]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-[#E6B325] mb-1">Established Heritage</p>
              <h3 className="text-xl font-bold">Generations of Academic & Cultural Excellence</h3>
            </div>
          </div>
          {/* Floating Gold Accent Box */}
          <div className="absolute -bottom-6 -right-6 hidden sm:flex flex-col justify-center items-center bg-[#8F0028] text-white p-6 rounded-2xl shadow-xl border-2 border-[#E6B325]/40 max-w-[200px] text-center">
            <span className="text-3xl font-black text-[#E6B325]">150+</span>
            <span className="text-xs font-semibold tracking-wider uppercase mt-1">Years of Legacy & Stories</span>
          </div>
        </motion.div>

        {/* Right Side: Content */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7 space-y-8"
        >
          <div className="space-y-3">
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#8F0028]">
              Why We Exist
            </p>
            <h2
              id="about-why-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171214] tracking-tight leading-[1.15]"
            >
              Our Story
            </h2>
            <p className="text-lg text-[#171214] font-bold leading-relaxed pt-2">
              Every Ravenshawvian carries moments that define their university life—classrooms, department fests, hostel nights, and life-changing friendships. College ends, but that connection does not have to.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 pt-2 items-stretch">
            <div className="p-3.5 sm:p-5 md:p-6 rounded-2xl bg-white border border-[#8F0028]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
              <div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#8F0028]/10 text-[#8F0028] flex items-center justify-center mb-2 sm:mb-3">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-[#8F0028]/20" />
                </div>
                <h4 className="font-bold text-[#171214] text-sm sm:text-base mb-1">Why We Were Created</h4>
                <p className="text-[11px] sm:text-sm text-[#756A6E] leading-relaxed">
                  To provide an enduring digital sanctuary where students, teachers, and alumni can record their journeys, share achievements, and celebrate institutional pride.
                </p>
              </div>
            </div>

            <div className="p-3.5 sm:p-5 md:p-6 rounded-2xl bg-white border border-[#8F0028]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
              <div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#8F0028]/10 text-[#8F0028] flex items-center justify-center mb-2 sm:mb-3">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h4 className="font-bold text-[#171214] text-sm sm:text-base mb-1">Why Memories Disappear</h4>
                <p className="text-[11px] sm:text-sm text-[#756A6E] leading-relaxed">
                  Photographs get lost, old devices fail, and social media feeds bury milestones beneath transient noise. Without a dedicated archive, history scatters over time.
                </p>
              </div>
            </div>

            <div className="p-3.5 sm:p-5 md:p-6 rounded-2xl bg-white border border-[#8F0028]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
              <div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#8F0028]/10 text-[#8F0028] flex items-center justify-center mb-2 sm:mb-3">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h4 className="font-bold text-[#171214] text-sm sm:text-base mb-1">Why Preserving Matters</h4>
                <p className="text-[11px] sm:text-sm text-[#756A6E] leading-relaxed">
                  University experiences form our character. Preserving cultural traditions, departmental excellence, and historic moments secures Ravenshaw’s legacy.
                </p>
              </div>
            </div>

            <div className="p-3.5 sm:p-5 md:p-6 rounded-2xl bg-white border border-[#8F0028]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full">
              <div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#8F0028]/10 text-[#8F0028] flex items-center justify-center mb-2 sm:mb-3">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h4 className="font-bold text-[#171214] text-sm sm:text-base mb-1">Connecting Generations</h4>
                <p className="text-[11px] sm:text-sm text-[#756A6E] leading-relaxed">
                  By uniting past alumni with current scholars, Ravenshaw Moments bridges decades of knowledge, mentorship, departmental heritage, and brotherhood.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
