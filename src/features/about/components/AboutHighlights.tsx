"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  Building2,
  Home,
  Briefcase,
  Calendar,
  Trophy,
  Camera,
  Video,
  BookOpen,
  Award,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface StatItem {
  key: string;
  label: string;
  shortLabel?: string;
  icon: React.ElementType;
  count: number | null;
  loading: boolean;
}

export const AboutHighlights: React.FC = () => {
  const [stats, setStats] = useState<StatItem[]>([
    { key: "students", label: "Students", shortLabel: "Students", icon: Users, count: null, loading: true },
    { key: "alumni", label: "Alumni", shortLabel: "Alumni", icon: GraduationCap, count: null, loading: true },
    { key: "departments", label: "Departments", shortLabel: "Depts", icon: Building2, count: null, loading: true },
    { key: "hostels", label: "Hostels", shortLabel: "Hostels", icon: Home, count: null, loading: true },
    { key: "organizations", label: "Organizations", shortLabel: "Orgs", icon: Briefcase, count: null, loading: true },
    { key: "events", label: "Events", shortLabel: "Events", icon: Calendar, count: null, loading: true },
    { key: "competitions", label: "Competitions", shortLabel: "Contests", icon: Trophy, count: null, loading: true },
    { key: "photos", label: "Photos", shortLabel: "Photos", icon: Camera, count: null, loading: true },
    { key: "videos", label: "Videos", shortLabel: "Videos", icon: Video, count: null, loading: true },
    { key: "memories", label: "Memories", shortLabel: "Memories", icon: BookOpen, count: null, loading: true },
    { key: "certificates", label: "Certificates", shortLabel: "Certs", icon: Award, count: null, loading: true },
  ]);

  useEffect(() => {
    let mounted = true;
    const fetchAllStats = async () => {
      const supabase = createClient();

      // Run independent count queries in parallel
      const queries = [
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("profile_type", "student"),
        supabase.from("profiles").select("*", { count: "exact", head: true }).eq("profile_type", "alumni"),
        supabase.from("departments").select("*", { count: "exact", head: true }),
        supabase.from("hostels").select("*", { count: "exact", head: true }),
        supabase.from("organizations").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }),
        supabase.from("competitions").select("*", { count: "exact", head: true }),
        supabase.from("media").select("*", { count: "exact", head: true }).eq("media_type", "image"),
        supabase.from("media").select("*", { count: "exact", head: true }).eq("media_type", "video"),
        supabase.from("memories").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
      ];

      const results = await Promise.allSettled(queries);

      if (!mounted) return;

      setStats((prev) =>
        prev.map((item, idx) => {
          const res = results[idx];
          if (res.status === "fulfilled" && !res.value.error && typeof res.value.count === "number") {
            return { ...item, count: res.value.count, loading: false };
          }
          // If query failed or table unavailable, remain null (no fake numbers displayed)
          return { ...item, count: null, loading: false };
        })
      );
    };

    fetchAllStats();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#FFFDF8]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[#8F0028]">
            Platform Highlights
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171214] tracking-tight">
            Our Growing Archive
          </h2>
          <p className="text-[#756A6E] text-base font-medium">
            Live metrics reflecting the preservation of Ravenshaw’s legacy across generations.
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4 md:gap-6 items-stretch">
          {stats.map((stat, idx) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.key}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="py-2.5 px-1 sm:p-6 rounded-xl sm:rounded-3xl bg-white border border-[#8F0028]/10 shadow-md hover:shadow-xl hover:border-[#8F0028]/30 transition-all flex flex-col items-center justify-center text-center group relative overflow-hidden h-full"
              >
                <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-[#8F0028]/10 group-hover:bg-[#8F0028] text-[#8F0028] group-hover:text-[#E6B325] flex items-center justify-center mb-1 sm:mb-4 transition-colors shrink-0">
                  <IconComponent className="w-3.5 h-3.5 sm:w-6 sm:h-6" />
                </div>

                {stat.loading ? (
                  <div className="h-5 sm:h-9 w-8 sm:w-16 bg-gray-200 rounded sm:rounded-lg animate-pulse my-0.5 sm:my-1" />
                ) : stat.count !== null ? (
                  <span className="text-xs sm:text-3xl font-black text-[#171214] group-hover:text-[#8F0028] transition-colors leading-tight tracking-tight">
                    {stat.count.toLocaleString()}
                  </span>
                ) : (
                  <div className="flex flex-col items-center">
                    <span className="text-xs sm:text-2xl font-black text-gray-300 font-mono leading-tight">--</span>
                    <span className="text-[8px] sm:text-[10px] text-gray-400 mt-0.5">Live Syncing</span>
                  </div>
                )}

                <span className="sm:hidden text-[9px] font-bold text-[#756A6E] mt-0.5 leading-tight truncate w-full px-0.5">
                  {stat.shortLabel || stat.label}
                </span>
                <span className="hidden sm:block text-sm font-bold text-[#756A6E] mt-1.5 leading-tight">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
