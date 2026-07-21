"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Sparkles, ArrowRight, Heart } from "lucide-react";

export const AboutHero: React.FC = () => {
  return (
    <div className="relative w-full min-h-[90vh] lg:min-h-[95vh] flex flex-col items-center justify-center overflow-hidden bg-[#171214] text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Background Image with Zoom Animation */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src="/hero/hero-1.webp"
          alt="Ravenshaw University Campus Heritage"
          fill
          priority
          className="object-cover object-center scale-105 animate-[pulse_12s_ease-in-out_infinite] opacity-40 transition-transform duration-1000"
          sizes="100vw"
        />
        {/* Cinematic Black Gradient Overlay */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none" 
          style={{ 
            background: "linear-gradient(135deg, rgba(0, 0, 0, 0.88), rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.42))" 
          }} 
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(212,175,55,0.15),transparent_60%)] z-10" />
      </div>

      {/* Hero Content Layer */}
      <div className="relative z-20 max-w-5xl mx-auto text-center flex flex-col items-center justify-center mt-auto mb-auto -translate-y-3 sm:-translate-y-4">
        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] drop-shadow-md text-white mb-6"
        >
          Every Memory Has a Place. <br className="hidden sm:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[#FFFDF8] to-[#E6B325]">
            Every Ravenshawvian Has a Story.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg md:text-xl text-gray-200 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow mb-10"
        >
          Ravenshaw Moments is the official digital community platform dedicated to preserving the memories, achievements, traditions and legacy of Ravenshaw University.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 w-full sm:w-auto"
        >
          <Link
            href="/memories"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#8F0028] to-[#b30032] hover:from-[#b30032] hover:to-[#8F0028] text-white px-8 py-4 rounded-2xl font-bold text-base shadow-xl hover:shadow-[#8F0028]/40 hover:-translate-y-0.5 transition-all border border-white/10"
          >
            <Heart className="w-5 h-5 text-[#E6B325] fill-[#E6B325]" />
            <span>Explore Memories</span>
          </Link>
          <Link
            href="/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 px-8 py-4 rounded-2xl font-bold text-base shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <span>Create Your Profile</span>
            <ArrowRight className="w-5 h-5 text-[#E6B325]" />
          </Link>
        </motion.div>
      </div>

      {/* Subtle Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-20 mt-12 flex flex-col items-center gap-2 text-gray-300 text-xs font-semibold uppercase tracking-[0.2em]"
      >
        <span>Discover Our Story</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="w-8 h-8 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm flex items-center justify-center text-[#E6B325]"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </div>
  );
};
