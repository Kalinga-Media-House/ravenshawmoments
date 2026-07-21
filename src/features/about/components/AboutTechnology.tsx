"use client";

import React from "react";
import { motion } from "framer-motion";
import { Code2, Database, ShieldCheck, Server, Cloud, Layers, CheckCircle2 } from "lucide-react";

const TECH_STACK = [
  {
    category: "Frontend Architecture",
    name: "Next.js 16 (App Router)",
    status: "Active Production",
    desc: "Server-side rendered React framework delivering blazing-fast page loads and SEO mastery.",
    icon: Code2,
    comingSoon: false,
  },
  {
    category: "Backend Engine",
    name: "Supabase Platform",
    status: "Active Production",
    desc: "High-performance enterprise backend powering real-time data sync and row-level security.",
    icon: Layers,
    comingSoon: false,
  },
  {
    category: "Core Database",
    name: "PostgreSQL",
    status: "Active Production",
    desc: "Robust relational database maintaining strict relational integrity and rapid queries.",
    icon: Database,
    comingSoon: false,
  },
  {
    category: "Security & Auth",
    name: "Supabase Auth (PKCE)",
    status: "Active Production",
    desc: "Cryptographically secure authentication supporting Role-Based Access Control (RBAC).",
    icon: ShieldCheck,
    comingSoon: false,
  },
  {
    category: "Cloud Infrastructure",
    name: "Vercel Edge Network",
    status: "Active Production",
    desc: "Global CDN and serverless runtime ensuring low-latency delivery across all continents.",
    icon: Server,
    comingSoon: false,
  },
  {
    category: "Media Storage",
    name: "Cloudflare R2",
    status: "Coming Soon",
    desc: "Zero egress fee object storage designed for massive historical video and photo preservation.",
    icon: Cloud,
    comingSoon: true,
  },
];

export const AboutTechnology: React.FC = () => {
  return (
    <section
      aria-labelledby="about-tech-heading"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#171214] text-white relative overflow-hidden"
    >
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#8F0028]/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#E6B325]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#E6B325]">
            Technology Architecture
          </p>
          <h2
            id="about-tech-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight"
          >
            Built for Centuries of Stability
          </h2>
          <p className="text-gray-300 text-base font-medium">
            Modern, highly scalable cloud infrastructure ensuring that every memory remains safe and discoverable.
          </p>
        </div>

        {/* Horizontal Tech Flow / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {TECH_STACK.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                  item.comingSoon
                    ? "bg-white/[0.03] border-dashed border-[#E6B325]/40 hover:bg-white/[0.06]"
                    : "bg-white/[0.06] border-white/10 hover:bg-white/[0.1] hover:border-[#E6B325]/50"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#8F0028] text-[#E6B325] flex items-center justify-center shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full ${
                        item.comingSoon
                          ? "bg-[#E6B325] text-[#171214] shadow-[0_0_15px_rgba(230,179,37,0.4)]"
                          : "bg-white/10 text-gray-200 border border-white/20"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="text-xs font-bold uppercase tracking-wider text-[#E6B325] mb-1">
                    {item.category}
                  </p>
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    {item.name}
                    {!item.comingSoon && <CheckCircle2 className="w-4 h-4 text-[#E6B325]" />}
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
                  <span>Layer 0{idx + 1}</span>
                  <span className="text-[#E6B325]">Ravenshaw Cloud</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
