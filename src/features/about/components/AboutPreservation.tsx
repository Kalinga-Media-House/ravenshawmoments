"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  UserCheck,
  GraduationCap,
  Building2,
  Home,
  Users,
  Calendar,
  Trophy,
  Image as ImageIcon,
  Newspaper,
  FileBadge,
  Award,
  Archive,
} from "lucide-react";

const ECOSYSTEM_ITEMS = [
  { icon: UserCheck, title: "Student Profiles", desc: "Verified digital identities with portfolios." },
  { icon: GraduationCap, title: "Alumni Directory", desc: "Global network of graduates across eras." },
  { icon: Building2, title: "Departments", desc: "Dedicated portals for academic history & fests." },
  { icon: Home, title: "Hostels", desc: "Rich archives of hostel traditions and brotherhood." },
  { icon: Users, title: "Organizations", desc: "Societies, cultural clubs, and student groups." },
  { icon: Calendar, title: "Events", desc: "Campus fests, seminars, reunions, and ceremonies." },
  { icon: Trophy, title: "Competitions", desc: "Creative contests with transparent leaderboards." },
  { icon: ImageIcon, title: "Memories", desc: "User-contributed photos and batch stories." },
  { icon: Newspaper, title: "News", desc: "Official campus highlights and publications." },
  { icon: FileBadge, title: "Digital Certificates", desc: "Tamper-proof verifiable QR certificates." },
  { icon: Award, title: "Achievements", desc: "Spotlights on student and alumni milestones." },
  { icon: Archive, title: "Community Archive", desc: "Long-term institutional historical repository." },
];

export const AboutPreservation: React.FC = () => {
  return (
    <section
      aria-labelledby="about-what-is-heading"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#171214] text-white relative overflow-hidden"
    >
      {/* Background Accent Glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#8F0028]/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#E6B325]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        {/* Left Column: Large Ravenshaw Image */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5 relative order-2 lg:order-1"
        >
          <div className="relative h-[480px] sm:h-[600px] rounded-3xl overflow-hidden shadow-2xl border border-white/15 group">
            <Image
              src="/hero/hero-3.webp"
              alt="Ravenshaw Moments Digital Ecosystem"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171214] via-[#171214]/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8F0028] text-[#E6B325] text-xs font-bold uppercase tracking-wider">
                More Than A Gallery
              </span>
              <h3 className="text-2xl font-black text-white leading-tight">
                An Integrated Digital Home For Every Pillar of Campus Life
              </h3>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Explanation & Ecosystem Grid */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7 space-y-8 order-1 lg:order-2"
        >
          <div className="space-y-4">
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#E6B325]">
              What Is Ravenshaw Moments
            </p>
            <h2
              id="about-what-is-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight"
            >
              Not Simply a Gallery. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-[#E6B325]">
                A Complete University Ecosystem.
              </span>
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed font-medium pt-1">
              While traditional photo albums merely store static images, Ravenshaw Moments is a dynamically connected digital platform that interlinks every dimension of university life. Every memory is tagged with its department, hostel, batch year, and student profiles.
            </p>
          </div>

          {/* 12 Ecosystem Pillars Grid */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 pt-2 items-stretch">
            {ECOSYSTEM_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#E6B325]/30 transition-all flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3 group justify-between h-full overflow-hidden"
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#8F0028]/40 border border-[#E6B325]/30 flex items-center justify-center text-[#E6B325] shrink-0 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="flex-1 w-full">
                    <h4 className="font-bold text-white text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1">
                      {item.title}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 leading-relaxed sm:line-clamp-none line-clamp-3">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
