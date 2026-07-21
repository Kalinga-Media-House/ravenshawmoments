"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  Clock, 
  GraduationCap, 
  ArrowRight, 
  Award, 
  X, 
  FileText, 
  CheckCircle2, 
  Briefcase, 
  Users, 
  Sparkles,
  Layers,
  Calendar
} from "lucide-react";
import { DepartmentProgramMock } from "../../data/mock-department-detail";

export interface DepartmentProgramsSectionProps {
  programs: DepartmentProgramMock[];
  departmentName: string;
}

export const DepartmentProgramsSection: React.FC<DepartmentProgramsSectionProps> = ({
  programs,
  departmentName,
}) => {
  const [selectedProgram, setSelectedProgram] = useState<DepartmentProgramMock | null>(null);

  const getProgramTheme = (level: string) => {
    switch (level) {
      case "UG":
        return {
          cardBg: "from-[#3A0D1B] via-[#5B001B] to-[#7A1530]",
          badge: "bg-[#D4AF37] text-[#1E1B1C] border-[#D4AF37]",
          iconCircle: "bg-[#D4AF37]/20 border-[#D4AF37]/30 text-[#D4AF37]",
          accentText: "text-[#D4AF37]",
          hoverShadow: "hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(212,175,55,0.2)]",
        };
      case "PG":
        return {
          cardBg: "from-[#0F2E45] via-[#123C5B] to-[#1B567A]",
          badge: "bg-[#1B567A] text-white border-[#4AA9E9]/30",
          iconCircle: "bg-[#1B567A]/50 border-[#4AA9E9]/30 text-[#E8D499]",
          accentText: "text-[#E8D499]",
          hoverShadow: "hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(232,212,153,0.15)]",
        };
      case "M.Phil":
        return {
          cardBg: "from-[#23412E] via-[#315C43] to-[#44745A]",
          badge: "bg-[#315C43] text-white border-[#6ee7b7]/30",
          iconCircle: "bg-[#315C43]/50 border-[#6ee7b7]/30 text-[#D4AF37]",
          accentText: "text-[#D4AF37]",
          hoverShadow: "hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(212,175,55,0.15)]",
        };
      case "PhD":
      case "Ph.D.":
        return {
          cardBg: "from-[#23142F] via-[#3A2050] to-[#5C3479]",
          badge: "bg-[#3A2050] text-white border-[#d8b4fe]/30",
          iconCircle: "bg-[#3A2050]/50 border-[#d8b4fe]/30 text-[#D4AF37]",
          accentText: "text-[#D4AF37]",
          hoverShadow: "hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(216,180,254,0.15)]",
        };
      default:
        return {
          cardBg: "from-[#1E1B1C] via-[#2A2627] to-[#3A3536]",
          badge: "bg-[#1E1B1C] text-white border-white/20",
          iconCircle: "bg-white/10 border-white/10 text-[#D4AF37]",
          accentText: "text-[#D4AF37]",
          hoverShadow: "hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),0_0_40px_rgba(212,175,55,0.15)]",
        };
    }
  };

  const getProgramIcon = (level: string) => {
    switch (level) {
      case "UG":
        return GraduationCap;
      case "PG":
        return BookOpen;
      case "PhD":
      case "Ph.D.":
        return Award;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="programs" className="scroll-mt-32 pt-10 sm:pt-14 pb-14 sm:pb-16 border-b border-[#EADED2] bg-transparent">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-1 bg-[#D4AF37] rounded-full" />
            <h2 className="font-black text-[#1E1B1C] tracking-tight font-serif" style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
              Academic Programs
            </h2>
          </div>
          <p className="text-sm sm:text-base text-[#4A4446]">
            Structured academic tracks offered by {departmentName}. Click any card to explore full curriculum details.
          </p>
        </div>

        <span className="text-xs font-semibold bg-[#FAF8F5] text-[#5B001B] px-3.5 py-1.5 rounded-full border border-[#EADFCF] self-start sm:self-auto flex items-center gap-1.5">
          <BookOpen className="w-4 h-4 text-[#D4AF37]" />
          {programs.length} Structured Degree Tracks
        </span>
      </div>

      {/* Premium Dark-Glass Grid (1 col mobile, 2 cols tablet, 4 cols desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {programs.map((prog, idx) => {
          const IconComponent = getProgramIcon(prog.level);
          const seatsValue = prog.seats || prog.intake || "Limited Seats";
          const theme = getProgramTheme(prog.level);
          return (
            <motion.button
              key={prog.id}
              onClick={() => setSelectedProgram(prog)}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.08 }}
              whileHover={{ y: -6, scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className={`group text-left rounded-[20px] bg-gradient-to-br ${theme.cardBg} backdrop-blur-xl p-4 sm:p-5 border border-[#D4AF37]/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),0_20px_60px_rgba(0,0,0,0.25)] ${theme.hoverShadow} hover:border-[#D4AF37]/60 hover:brightness-105 transition-all duration-400 ease-out flex flex-col justify-between min-h-[170px] sm:min-h-[195px] relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#D4AF37] isolate`}
            >
              {/* Radial Highlight */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_60%)] z-[-1] pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-60" />

              {/* Top Row: Capsule Badge & Muted Gold Icon */}
              <div className="flex items-center justify-between gap-2 w-full">
                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase shadow-2xs border ${theme.badge}`}>
                  {prog.level}
                </span>

                <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 shrink-0 ${theme.iconCircle}`}>
                  <IconComponent className="w-4 h-4" />
                </div>
              </div>

              {/* Middle: Degree Title & Specs */}
              <div className="my-auto py-2.5 space-y-2">
                <h3 className={`text-base sm:text-lg font-semibold text-white group-hover:${theme.accentText} transition-colors leading-snug font-serif`}>
                  {prog.degree}
                </h3>

                <div className="space-y-1 pt-1.5 border-t border-white/[0.08] text-[11px]">
                  <div className="flex items-center justify-between">
                    <span className="text-white/[0.65] flex items-center gap-1">
                      <Clock className={`w-3 h-3 ${theme.accentText}`} /> Duration:
                    </span>
                    <span className="text-white/[0.82] font-semibold">{prog.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/[0.65] flex items-center gap-1">
                      <Users className={`w-3 h-3 ${theme.accentText}`} /> Intake:
                    </span>
                    <span className={`${theme.accentText} font-bold`}>{seatsValue}</span>
                  </div>
                  <div className="pt-0.5 text-white/[0.65] line-clamp-1">
                    <span className="text-white/[0.82] font-medium">Eligibility:</span> <span className="text-white/[0.82]">{prog.eligibility}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Row: Dark Translucent Syllabus CTA & Sliding Arrow */}
              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-white/[0.08] w-full mt-1.5">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`Downloading official syllabus for ${prog.degree}...`);
                  }}
                  className="group/btn px-3.5 py-1.5 rounded-full bg-black/40 text-white/[0.9] border border-white/15 hover:border-[#D4AF37] hover:shadow-[0_0_12px_rgba(212,175,55,0.25)] text-[11px] font-bold tracking-tight flex items-center gap-1.5 transition-all duration-300 group-hover:bg-black/30 group-hover:-translate-y-0.5"
                >
                  <FileText className={`w-3 h-3 ${theme.accentText}`} />
                  <span>Syllabus</span>
                </div>

                <span className="w-7 h-7 rounded-full bg-black/40 border border-white/10 group-hover:bg-[#D4AF37] text-white/90 group-hover:text-[#1E1B1C] flex items-center justify-center transition-all duration-300 group-hover:translate-x-1 shrink-0">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Premium Apple / Notion Detailed Program Modal */}
      <AnimatePresence>
        {selectedProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProgram(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl rounded-[32px] bg-[#FFFDF8] border-2 border-[#D4AF37] shadow-2xl p-6 sm:p-8 lg:p-10 z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProgram(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#FAF8F5] hover:bg-[#EADFCF] border border-[#EADFCF] flex items-center justify-center text-[#1E1B1C] transition-all hover:rotate-90 z-20 shadow-xs"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Header */}
              <div className="flex flex-wrap items-center gap-3 mb-4 pr-12">
                <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-xs ${getProgramTheme(selectedProgram.level).badge}`}>
                  {selectedProgram.level} Structured Track
                </span>
                <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-[#FAF8F5] text-[#5B001B] border border-[#EADFCF] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {selectedProgram.duration} Full-Time
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E1B1C] font-serif leading-tight">
                {selectedProgram.degree}
              </h3>

              <p className="text-sm sm:text-base text-[#4A4446] mt-4 leading-relaxed font-medium">
                {selectedProgram.description}
              </p>

              {/* Grid Details (Apple Product Spec style) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8 pt-6 border-t border-[#EADFCF]">
                {/* Eligibility Box */}
                <div className="p-5 rounded-2xl bg-white border border-[#EADFCF] space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#5B001B] uppercase tracking-wider">
                    <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                    <span>Admission &amp; Eligibility</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1E1B1C] font-semibold leading-relaxed">
                    {selectedProgram.eligibility}
                  </p>
                </div>

                {/* Intake & Semester Structure */}
                <div className="p-5 rounded-2xl bg-white border border-[#EADFCF] space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#5B001B] uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-[#D4AF37]" />
                    <span>Curriculum &amp; Intake</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1E1B1C] font-semibold leading-relaxed">
                    <strong>Capacity:</strong> {selectedProgram.seats}<br />
                    <strong>Structure:</strong> Core modules, electives &amp; research thesis across {selectedProgram.duration}.
                  </p>
                </div>

                {/* Faculty & Mentorship */}
                <div className="p-5 rounded-2xl bg-white border border-[#EADFCF] space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#5B001B] uppercase tracking-wider">
                    <Users className="w-4 h-4 text-[#D4AF37]" />
                    <span>Faculty &amp; Mentorship</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1E1B1C] font-medium leading-relaxed">
                    Taught directly by distinguished {departmentName} professors and visiting industry fellows.
                  </p>
                </div>

                {/* Career Opportunities */}
                <div className="p-5 rounded-2xl bg-white border border-[#EADFCF] space-y-2 shadow-2xs">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#5B001B] uppercase tracking-wider">
                    <Briefcase className="w-4 h-4 text-[#D4AF37]" />
                    <span>Career Opportunities</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#1E1B1C] font-medium leading-relaxed">
                    High placement record across analytics, research institutions, civil services &amp; academia.
                  </p>
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="mt-8 pt-6 border-t border-[#EADFCF] flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-bold text-[#7A7476] flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#5B001B]" />
                  Admissions through CPET / OJEE / Merit Counselling
                </span>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => alert(`Downloading official syllabus PDF for ${selectedProgram.degree}...`)}
                    className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-[#5B001B] hover:bg-[#720022] text-white text-xs sm:text-sm font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                  >
                    <FileText className="w-4 h-4 text-[#D4AF37]" />
                    <span>Download Syllabus PDF</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
