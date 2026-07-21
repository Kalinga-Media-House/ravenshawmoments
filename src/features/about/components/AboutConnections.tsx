"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Link2,
  UserCheck,
  GraduationCap,
  Building2,
  Home,
  Users,
  Calendar,
  Trophy,
  Image as ImageIcon,
  Newspaper,
  BookOpen,
  Bell,
  FileBadge,
  Award,
  Search,
  HeartHandshake,
  Sparkles,
} from "lucide-react";

const PLATFORM_FEATURES = [
  { icon: UserCheck, title: "Student Profiles", desc: "Comprehensive academic & co-curricular portfolios." },
  { icon: GraduationCap, title: "Alumni Directory", desc: "Global searchable alumni registry with batch filters." },
  { icon: Building2, title: "Department Pages", desc: "Dedicated spaces for faculty, syllabi, & heritage." },
  { icon: Home, title: "Hostel Pages", desc: "Digital records of hostel pride, reunions, & traditions." },
  { icon: Users, title: "Organizations", desc: "Official portals for clubs, NCC, NSS, & societies." },
  { icon: Calendar, title: "Events", desc: "Live event ticketing, RSVPs, & campus schedules." },
  { icon: Trophy, title: "Competitions", desc: "Participate in contests & track live leaderboards." },
  { icon: ImageIcon, title: "Gallery", desc: "High-resolution campus photography & visual archives." },
  { icon: Newspaper, title: "News", desc: "University bulletins, articles, & student journalism." },
  { icon: BookOpen, title: "Memories", desc: "Crowdsourced stories, nostalgic moments, & anecdotes." },
  { icon: Bell, title: "Notifications", desc: "Real-time updates on campus happenings & approvals." },
  { icon: FileBadge, title: "Certificates", desc: "QR-verifiable digital certificates for achievements." },
  { icon: Award, title: "Achievements", desc: "Showcase medals, scholarships, & national recognition." },
  { icon: Search, title: "Community Search", desc: "Instant semantic search across people and history." },
  { icon: HeartHandshake, title: "Donations", desc: "Transparent institutional & departmental giving portals." },
  { icon: Sparkles, title: "Volunteer Participation", desc: "Opportunities to lead, organize, & mentor peers." },
];

export const AboutConnections: React.FC = () => {
  return (
    <section
      aria-labelledby="about-connections-heading"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#171214] text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto space-y-20 relative z-10">
        {/* SECTION 8: PLATFORM FEATURES GRID */}
        <div className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#E6B325]">
              Platform Features
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              A Complete Digital Ecosystem
            </h2>
            <p className="text-gray-300 text-base font-medium">
              Every tool and module built to empower the Ravenshaw community.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 items-stretch">
            {PLATFORM_FEATURES.map((feat, idx) => {
              const IconComponent = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (idx % 4) * 0.1 }}
                  className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-[#E6B325]/40 transition-all flex flex-col justify-between group h-full overflow-hidden"
                >
                  <div className="space-y-1 sm:space-y-3 flex flex-col justify-between h-full">
                    <div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#8F0028] text-[#E6B325] flex items-center justify-center group-hover:scale-110 transition-transform mb-2 sm:mb-3">
                        <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <h3 className="font-bold text-white text-xs sm:text-base group-hover:text-[#E6B325] transition-colors mb-1">
                        {feat.title}
                      </h3>
                    </div>
                    <p className="text-[10px] sm:text-xs text-gray-400 leading-relaxed sm:line-clamp-none line-clamp-3">
                      {feat.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* EXISTING RELATIONSHIP MODEL (Every Story Is Connected) */}
        <div className="space-y-10 pt-8 border-t border-white/10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h3
              id="about-connections-heading"
              className="text-2xl sm:text-3xl font-black text-white tracking-tight"
            >
              Every Story Is Connected
            </h3>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-medium">
              A memory may belong to a student, but it also belongs to a department, a batch, a hostel, an organization, and a circle of friends. Ravenshaw Moments interconnects these nodes so campus history remains alive across generations.
            </p>
          </div>

          <div className="relative py-4">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden flex flex-col items-center justify-center min-h-[360px] backdrop-blur-sm">
              {/* Center Node */}
              <div className="relative z-20 w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#8F0028] border-2 border-[#E6B325] shadow-[0_0_60px_rgba(230,179,37,0.35)] flex flex-col items-center justify-center text-center p-4">
                <Link2 className="w-8 h-8 text-[#E6B325] mb-2 animate-pulse" />
                <span className="text-xs sm:text-sm font-black text-white uppercase tracking-widest leading-tight">
                  Ravenshaw<br />Moments
                </span>
              </div>

              {/* Orbiting Nodes */}
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none opacity-80">
                <div className="w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] rounded-full border border-[#E6B325]/30 border-dashed animate-[spin_60s_linear_infinite]" />
                <div className="absolute w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] rounded-full border border-white/10" />

                <span className="absolute top-[10%] left-[50%] -translate-x-1/2 text-[10px] sm:text-xs font-bold text-[#E6B325] bg-[#171214] border border-white/20 px-3 py-1 rounded-full">People</span>
                <span className="absolute bottom-[10%] left-[50%] -translate-x-1/2 text-[10px] sm:text-xs font-bold text-[#E6B325] bg-[#171214] border border-white/20 px-3 py-1 rounded-full">Memories</span>
                <span className="absolute left-[8%] sm:left-[14%] top-[50%] -translate-y-1/2 text-[10px] sm:text-xs font-bold text-[#E6B325] bg-[#171214] border border-white/20 px-3 py-1 rounded-full">Departments</span>
                <span className="absolute right-[8%] sm:right-[14%] top-[50%] -translate-y-1/2 text-[10px] sm:text-xs font-bold text-[#E6B325] bg-[#171214] border border-white/20 px-3 py-1 rounded-full">Hostels</span>
                <span className="absolute top-[20%] left-[20%] text-[10px] sm:text-xs font-bold text-gray-300 bg-[#171214] border border-white/10 px-2.5 py-1 rounded-full">Organizations</span>
                <span className="absolute bottom-[20%] right-[20%] text-[10px] sm:text-xs font-bold text-gray-300 bg-[#171214] border border-white/10 px-2.5 py-1 rounded-full">Events</span>
                <span className="absolute top-[20%] right-[20%] text-[10px] sm:text-xs font-bold text-gray-300 bg-[#171214] border border-white/10 px-2.5 py-1 rounded-full">Batches</span>
                <span className="absolute bottom-[20%] left-[20%] text-[10px] sm:text-xs font-bold text-gray-300 bg-[#171214] border border-white/10 px-2.5 py-1 rounded-full">Achievements</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
