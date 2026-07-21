"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, GraduationCap, BookOpen, Microscope, ArrowRight } from "lucide-react";
import { DepartmentStudentMock, DepartmentBatchMock } from "../../data/mock-department-detail";
import { SectionHeader } from "./common";

export interface DepartmentStudentsSectionProps {
  students: DepartmentStudentMock[];
  batches?: DepartmentBatchMock[];
  departmentName: string;
  slug?: string;
}

export const DepartmentStudentsSection: React.FC<DepartmentStudentsSectionProps> = ({
  departmentName,
  slug,
}) => {
  const router = useRouter();
  const deptSlug = slug || departmentName.toLowerCase().replace(/\s+/g, "-");

  const cards = [
    {
      id: "ug",
      level: "ug",
      title: "Undergraduate (UG)",
      icon: GraduationCap,
      description: "Browse all undergraduate batches, Class Representatives, students, achievements, and memories.",
    },
    {
      id: "pg",
      level: "pg",
      title: "Postgraduate (PG)",
      icon: BookOpen,
      description: "Discover postgraduate batches, research scholars, CRs, departmental activities, and alumni.",
    },
    {
      id: "phd",
      level: "phd",
      title: "Doctoral (Ph.D.)",
      icon: Microscope,
      description: "Explore doctoral scholars, supervisors, research contributions, publications, and academic journeys.",
    },
  ];

  const getStudentTheme = (id: string) => {
    switch (id) {
      case "ug":
        return {
          cardBg: "from-[#5B001B] via-[#7B102F] to-[#A32146]",
          iconColor: "text-[#D4AF37]",
          iconBg: "bg-black/30 border-white/20",
          glow: "hover:shadow-[0_25px_70px_rgba(212,175,55,0.15)]",
          borderGlow: "hover:border-[#D4AF37]/50",
          blob: "from-[#D4AF37]/20 via-[#5B001B]/5 to-transparent",
        };
      case "pg":
        return {
          cardBg: "from-[#103B5D] via-[#175983] to-[#2C7CB4]",
          iconColor: "text-[#60A5FA]",
          iconBg: "bg-black/30 border-white/20",
          glow: "hover:shadow-[0_25px_70px_rgba(96,165,250,0.15)]",
          borderGlow: "hover:border-[#60A5FA]/50",
          blob: "from-[#60A5FA]/20 via-[#103B5D]/5 to-transparent",
        };
      case "phd":
        return {
          cardBg: "from-[#2B1A45] via-[#4A2870] to-[#7142A7]",
          iconColor: "text-[#D8B4FE]",
          iconBg: "bg-black/30 border-white/20",
          glow: "hover:shadow-[0_25px_70px_rgba(216,180,254,0.15)]",
          borderGlow: "hover:border-[#D8B4FE]/50",
          blob: "from-[#D8B4FE]/20 via-[#2B1A45]/5 to-transparent",
        };
      default:
        return {
          cardBg: "from-[#1B171A] to-[#3A111A]",
          iconColor: "text-[#E3B341]",
          iconBg: "bg-black/40 border-white/15",
          glow: "hover:shadow-[0_25px_70px_rgba(212,175,55,0.15)]",
          borderGlow: "hover:border-[#D4AF37]/50",
          blob: "from-[#D4AF37]/15 via-[#5B001B]/20 to-transparent",
        };
    }
  };

  return (
    <section id="students" className="scroll-mt-32 pt-10 sm:pt-16 pb-16 sm:pb-20 border-b border-[#EADED2]">
      <SectionHeader
        title="Students"
        subtitle="Browse students by academic programme and explore every batch, Class Representative (CR), achievements, and memories."
        badgeText="Student Directories"
        badgeIcon={Users}
      />

      {/* Centered 3-Card Responsive Grid with generous open spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto pt-6 px-4 sm:px-6">
        {cards.map((card, idx) => {
          const IconComponent = card.icon;
          const theme = getStudentTheme(card.id);
          return (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => router.push(`/departments/${deptSlug}/students/${card.level}`)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -8, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`group text-left bg-gradient-to-br ${theme.cardBg} border border-white/[0.08] ${theme.borderGlow} rounded-[22px] p-6 sm:p-8 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),0_25px_70px_rgba(0,0,0,0.22)] ${theme.glow} hover:brightness-105 backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between relative overflow-hidden min-h-[255px] sm:min-h-[275px] focus:outline-none focus:ring-2 focus:ring-[#D4AF37] cursor-pointer isolate`}
            >
              {/* Radial subtle lighting (5-8% opacity) */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_70%)] z-[-1] pointer-events-none" />
              <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.05] mix-blend-overlay z-[-1] pointer-events-none" />

              {/* Soft gradient blobs */}
              <div className={`absolute -bottom-16 -right-16 w-56 h-56 bg-gradient-to-tl ${theme.blob} rounded-full blur-[40px] opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-[-1]`} />
              
              {/* Curved abstract lines */}
              <div className="absolute -bottom-6 -right-6 w-32 h-32 border border-white/[0.05] rounded-full rotate-12 bg-white/[0.01] pointer-events-none z-[-1]" />
              <div className="absolute -bottom-12 -right-2 w-40 h-40 border border-white/[0.03] rounded-[40px] rotate-[30deg] bg-transparent pointer-events-none z-[-1]" />

              <div className="relative z-10">
                {/* Premium Icon Container */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full ${theme.iconBg} flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] ${theme.iconColor} group-hover:scale-110 group-hover:border-white/40 transition-all duration-500 mb-6 shrink-0`}>
                  <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 stroke-[1.75]" />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight leading-snug font-serif mb-2.5">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-white/[0.82] leading-relaxed line-clamp-3">
                  {card.description}
                </p>
              </div>

              {/* Explore Button Area */}
              <div className="pt-5 mt-6 border-t border-white/10 group-hover:border-white/30 flex items-center justify-between font-bold text-sm text-[#D4AF37] transition-colors duration-500 w-full relative z-10 group-hover:brightness-110 group-hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
                <span>Explore</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37] transform transition-transform duration-500 group-hover:translate-x-1.5" />
              </div>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
};
