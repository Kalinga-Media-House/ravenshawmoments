"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, Sparkles, Landmark, History, Users, Archive, Cloud, Globe } from "lucide-react";

const ROADMAP_ITEMS = [
  {
    phase: "Phase 1",
    icon: Smartphone,
    title: "Mobile App",
    desc: "Native iOS & Android apps with instant campus notifications and offline memory capture.",
  },
  {
    phase: "Phase 2",
    icon: Sparkles,
    title: "AI Search",
    desc: "Semantic natural language search across decades of faces, events, and historical records.",
  },
  {
    phase: "Phase 3",
    icon: Landmark,
    title: "Digital Museum",
    desc: "3D virtual exhibits showcasing ancient Ravenshaw artifacts, founder letters, and plaques.",
  },
  {
    phase: "Phase 4",
    icon: History,
    title: "Interactive Timeline",
    desc: "Century-spanning interactive scrollable history of collegiate evolution since 1868.",
  },
  {
    phase: "Phase 5",
    icon: Users,
    title: "Alumni Mentorship",
    desc: "Direct peer-to-peer career guidance, mock interviews, and scholarship matching.",
  },
  {
    phase: "Phase 6",
    icon: Archive,
    title: "Historical Archive",
    desc: "Digitization of rare physical college magazines, yearbooks, and gazetteers.",
  },
  {
    phase: "Phase 7",
    icon: Cloud,
    title: "Cloud Media Library",
    desc: "High-speed zero-latency video streaming for institutional documentaries and fests.",
  },
  {
    phase: "Phase 8",
    icon: Globe,
    title: "Global Alumni Community",
    desc: "International city chapters with local networking hubs across Europe, Americas, and Asia.",
  },
];

export const AboutFuture: React.FC = () => {
  return (
    <section
      aria-labelledby="about-roadmap-heading"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FFFDF8]"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#8F0028]">
            Future Direction
          </p>
          <h2
            id="about-roadmap-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171214] tracking-tight"
          >
            Future Roadmap
          </h2>
          <p className="text-[#756A6E] text-base font-medium">
            Our strategic vision to continuously elevate how Ravenshaw preserves its legacy.
          </p>
        </div>

        {/* Premium Grid / Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative">
          {ROADMAP_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="relative p-7 rounded-3xl bg-white border border-[#8F0028]/15 shadow-md hover:shadow-2xl hover:border-[#8F0028]/40 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full bg-[#8F0028]/10 text-[#8F0028] group-hover:bg-[#8F0028] group-hover:text-white transition-colors">
                      {item.phase}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FFFDF8] border border-[#E6B325]/40 flex items-center justify-center text-[#8F0028]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#171214] mb-2 group-hover:text-[#8F0028] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#756A6E] leading-relaxed font-medium">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] font-bold text-gray-400">
                  <span>Upcoming Expansion</span>
                  <span className="w-2 h-2 rounded-full bg-[#8F0028]" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
