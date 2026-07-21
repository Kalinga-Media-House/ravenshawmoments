"use client";

import React from "react";
import { motion } from "framer-motion";
import { Quote, Fingerprint, Clock, Network, CheckCircle, Database, Cpu } from "lucide-react";

const WHY_FEATURES = [
  {
    icon: Fingerprint,
    title: "Digital Identity",
    description: "Official, verified digital profiles for students, alumni, teachers, and university leaders.",
  },
  {
    icon: Clock,
    title: "Permanent Memories",
    description: "Timeless photo archives and written experiences that never disappear beneath transient social feeds.",
  },
  {
    icon: Network,
    title: "Community Network",
    description: "An interconnected web linking batches, hostels, departments, and organizations across eras.",
  },
  {
    icon: CheckCircle,
    title: "Verified Achievements",
    description: "Tamper-proof recognition and digital certificates for academic and cultural milestones.",
  },
  {
    icon: Database,
    title: "University Archive",
    description: "A centralized, searchable historic repository preserving Ravenshaw’s 150+ year legacy.",
  },
  {
    icon: Cpu,
    title: "Future Ready",
    description: "Built on high-performance modern cloud architecture designed to scale across upcoming centuries.",
  },
];

export const AboutStatement: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Emotional Quote Header */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white shadow-xl rounded-3xl p-8 sm:p-12 md:p-14 border border-[#8F0028]/15 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 text-[#8F0028]/10 pointer-events-none">
              <Quote className="w-48 h-48" aria-hidden="true" />
            </div>

            <div className="relative z-10 space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#8F0028]">
                Why Ravenshaw Moments
              </p>
              <blockquote className="text-2xl sm:text-3xl md:text-4xl font-black text-[#171214] leading-tight">
                &ldquo;We may leave Ravenshaw, but Ravenshaw never truly leaves us.&rdquo;
              </blockquote>
              <p className="text-sm sm:text-base text-[#756A6E] max-w-2xl mx-auto leading-relaxed font-medium">
                The places may change. The years may pass. The people may follow different journeys. Yet one photograph, one familiar name, or one shared memory can bring an entire chapter of life back to us.
              </p>
            </div>
          </div>
        </div>

        {/* Section 7 Feature Grid */}
        <div className="space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-[#171214] tracking-tight">
              Why We Are Different
            </h2>
            <p className="text-[#756A6E] text-base font-medium">
              Purpose-built features designed specifically for institutional preservation.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8 items-stretch">
            {WHY_FEATURES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white border border-[#8F0028]/10 shadow-md hover:shadow-xl hover:border-[#8F0028]/30 transition-all group flex flex-col justify-between h-full overflow-hidden"
                >
                  <div>
                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#8F0028]/10 group-hover:bg-[#8F0028] text-[#8F0028] group-hover:text-[#E6B325] flex items-center justify-center mb-3 sm:mb-6 transition-colors shadow-sm">
                      <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-sm sm:text-lg md:text-xl font-bold text-[#171214] mb-1.5 sm:mb-3 group-hover:text-[#8F0028] transition-colors tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-sm text-[#756A6E] leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] sm:text-xs font-semibold text-gray-400">
                    <span className="hidden sm:inline">Core Advantage</span>
                    <span className="sm:hidden">Advantage</span>
                    <span className="text-[#8F0028] font-bold">0{idx + 1}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
