"use client";

import React from "react";
import { motion } from "framer-motion";
import { Landmark, Users, ShieldCheck, Trophy, Sparkles, HeartHandshake } from "lucide-react";

const CORE_VALUES = [
  {
    icon: Landmark,
    title: "Heritage",
    description: "Honour and preserve 150+ years of institutional pride, academic traditions, and campus landmarks across generations.",
  },
  {
    icon: Users,
    title: "Community",
    description: "Foster genuine, lifelong brotherhood connecting current scholars, teachers, and global alumni without borders.",
  },
  {
    icon: ShieldCheck,
    title: "Authenticity",
    description: "Safeguard accurate records, real student stories, and verified milestones with institutional rigor and respect.",
  },
  {
    icon: Trophy,
    title: "Excellence",
    description: "Spotlight intellectual rigor, sporting triumphs, leadership, and cultural brilliance across every department.",
  },
  {
    icon: Sparkles,
    title: "Innovation",
    description: "Combine state-of-the-art cloud technology with interactive design to make history discoverable in real time.",
  },
  {
    icon: HeartHandshake,
    title: "Inclusiveness",
    description: "Ensure every student, hostel, department, and organization finds an equal voice and place in our shared story.",
  },
];

export const AboutValues: React.FC = () => {
  return (
    <section
      aria-labelledby="about-values-heading"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FFFDF8]"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#8F0028]">
            Core Values
          </p>
          <h2
            id="about-values-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171214] tracking-tight"
          >
            What Guides Our Platform
          </h2>
          <p className="text-[#756A6E] text-base font-medium">
            The foundational principles that shape every line of code and every preserved memory.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {CORE_VALUES.map((value, idx) => {
            const IconComponent = value.icon;
            return (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative p-8 rounded-3xl bg-white border border-[#8F0028]/10 shadow-lg hover:shadow-2xl hover:border-[#8F0028]/30 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8F0028]/10 to-[#8F0028]/5 group-hover:from-[#8F0028] group-hover:to-[#b30032] text-[#8F0028] group-hover:text-white flex items-center justify-center mb-6 transition-colors duration-300 shadow-sm">
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#171214] mb-3 group-hover:text-[#8F0028] transition-colors">
                    {value.title}
                  </h3>
                  <p className="text-sm text-[#756A6E] leading-relaxed font-medium">
                    {value.description}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#8F0028] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Guiding Principle #{idx + 1}</span>
                  <span className="w-2 h-2 rounded-full bg-[#E6B325]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
