"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, UserPlus, Sparkles, Heart } from "lucide-react";

export const AboutCTA: React.FC = () => {
  return (
    <section
      aria-labelledby="about-cta-heading"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FFFDF8]"
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/20"
        >
          {/* Background layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#8F0028] via-[#520014] to-[#171214]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(230,179,37,0.2),transparent_70%)]" />

          <div className="relative z-10 p-10 sm:p-14 md:p-18 text-center space-y-8">
            <div className="space-y-3 max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider uppercase text-[#E6B325] mb-2">
                <Sparkles className="w-3.5 h-3.5 text-[#E6B325]" />
                <span>Join The Journey</span>
              </span>
              <h2
                id="about-cta-heading"
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.12]"
              >
                Become Part of Ravenshaw&apos;s Digital Legacy
              </h2>
              <p className="text-base sm:text-lg text-gray-200 max-w-2xl mx-auto leading-relaxed font-medium pt-2">
                Whether you are a current student, alumnus, teacher or future Ravenshawvian, your story deserves to be remembered.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#E6B325] to-[#f0c850] text-[#171214] font-black text-base shadow-xl hover:shadow-[#E6B325]/40 hover:-translate-y-0.5 transition-all"
              >
                <UserPlus className="w-5 h-5" />
                <span>Create Profile</span>
              </Link>
              <Link
                href="/organizations"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/30 font-bold text-base shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <Heart className="w-5 h-5 text-[#E6B325]" />
                <span>Explore Community</span>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
