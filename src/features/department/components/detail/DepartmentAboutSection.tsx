"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Building2, 
  Mail, 
  MapPin, 
  Target, 
  Globe2, 
  Award, 
  CheckCircle2, 
  Sparkles,
  BookOpen
} from "lucide-react";
import { DepartmentFacultyMock } from "../../data/mock-department-detail";

export interface DepartmentAboutSectionProps {
  name: string;
  slug: string;
  description: string;
  establishedYear: number;
  category: string;
  vision?: string;
  mission?: string;
  academicExcellence?: string;
  motto: string;
  officeLocation: string;
  hodTeacher?: DepartmentFacultyMock;
}

export const DepartmentAboutSection: React.FC<DepartmentAboutSectionProps> = ({
  name,
  slug,
  description,
  establishedYear,
  category,
  vision,
  mission,
  academicExcellence,
  officeLocation,
  hodTeacher,
}) => {
  const [activeOverviewTab, setActiveOverviewTab] = useState<"about" | "mission" | "vision" | "highlights">("about");

  const highlightsList = [
    { title: "UGC & DST Recognized Labs", desc: "Equipped with high-precision analytical spectroscopy and computational research clusters." },
    { title: "Historic Departmental Library", desc: "Housing over 15,000+ rare archives, journals, and doctoral dissertations dating back to 1868." },
    { title: "Scopus & SCI Indexed Output", desc: "Consistently ranked among the top departments nationwide for peer-reviewed citations per faculty." },
    { title: "Global Research Exchange", desc: "Active MoUs and summer research fellowships with premier Indian & international institutions." },
  ];

  return (
    <section id="overview" className="scroll-mt-32 pt-6 sm:pt-10 pb-16 sm:pb-20 border-b border-[#EADED2]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Overview Navigation Tabs & Detailed Content */}
        <div className="lg:col-span-8 space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-1 bg-[#D4AF37] rounded-full" />
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E1B1C] tracking-tight font-serif">
                Department Overview
              </h2>
            </div>
            <p className="text-sm sm:text-base text-[#4A4446]">
              Discover the heritage, intellectual mission, and academic pillars defining the Department of {name}.
            </p>
          </div>

          {/* Sub-Tabs (About / Mission / Vision / Highlights) */}
          <div className="flex items-center gap-2 p-1.5 rounded-full bg-[#FAF8F5] border border-[#EADED2] self-start overflow-x-auto no-scrollbar">
            {[
              { id: "about", label: "About Department", icon: <BookOpen className="w-4 h-4" /> },
              { id: "mission", label: "Mission", icon: <Target className="w-4 h-4" /> },
              { id: "vision", label: "Vision", icon: <Globe2 className="w-4 h-4" /> },
              { id: "highlights", label: "Highlights", icon: <Award className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveOverviewTab(tab.id as any)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 shrink-0 ${
                  activeOverviewTab === tab.id
                    ? "bg-[#5B001B] text-white shadow-md"
                    : "text-[#4A4446] hover:text-[#1E1B1C]"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content Box */}
          <div className="p-6 sm:p-8 rounded-[28px] bg-white border border-[#EADED2] shadow-sm relative overflow-hidden min-h-[260px] flex flex-col justify-center">
            {activeOverviewTab === "about" && (
              <motion.div
                key="about"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-[#1E1B1C]">About the Department of {name}</h3>
                <p className="text-sm sm:text-base text-[#4A4446] leading-relaxed font-medium">
                  {description}
                </p>
                <p className="text-sm sm:text-base text-[#4A4446] leading-relaxed">
                  Since its foundation in <strong className="text-[#1E1B1C]">{establishedYear}</strong> within the hallowed grounds of Ravenshaw University, the department has served as an intellectual crucible for Odisha and eastern India. We foster analytical thought, critical debate, and empirical experimentation across undergraduate, postgraduate, and doctoral tiers.
                </p>
                {academicExcellence && (
                  <div className="p-4 rounded-2xl bg-[#FAF8F5] border-l-4 border-[#D4AF37] text-xs sm:text-sm text-[#4A4446] mt-4 font-medium">
                    <strong className="text-[#5B001B] block mb-1">Academic Excellence Pillar:</strong>
                    {academicExcellence}
                  </div>
                )}
              </motion.div>
            )}

            {activeOverviewTab === "mission" && (
              <motion.div
                key="mission"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-[#1E1B1C] flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#5B001B]" />
                  Departmental Mission
                </h3>
                <p className="text-sm sm:text-base text-[#4A4446] leading-relaxed font-medium">
                  {mission || `To impart holistic, future-ready higher education in ${name} while nurturing ethical integrity, intellectual curiosity, and rigorous experimental expertise among our scholars.`}
                </p>
                <ul className="space-y-2.5 text-xs sm:text-sm text-[#4A4446] pt-2">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5B001B] shrink-0 mt-0.5" />
                    <span>Deliver dynamic curriculum integrated with current global scientific and academic breakthroughs.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5B001B] shrink-0 mt-0.5" />
                    <span>Empower students to publish independent research and participate in national symposia.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#5B001B] shrink-0 mt-0.5" />
                    <span>Cultivate strong societal awareness and industry-ready skills for lifelong impact.</span>
                  </li>
                </ul>
              </motion.div>
            )}

            {activeOverviewTab === "vision" && (
              <motion.div
                key="vision"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-[#1E1B1C] flex items-center gap-2">
                  <Globe2 className="w-5 h-5 text-[#D4AF37]" />
                  Departmental Vision
                </h3>
                <p className="text-sm sm:text-base text-[#4A4446] leading-relaxed font-medium">
                  {vision || `To emerge as an internationally renowned center of academic inquiry and research innovation that honors Ravenshaw's historical prestige while solving contemporary global challenges.`}
                </p>
                <div className="p-5 rounded-2xl bg-gradient-to-br from-[#FFFDF8] to-[#FAF6EE] border border-[#D4AF37]/40 text-xs sm:text-sm text-[#1E1B1C] mt-2 font-semibold flex items-center justify-between">
                  <span>Advancing Odisha &amp; India on the world research map.</span>
                  <Sparkles className="w-5 h-5 text-[#D4AF37] shrink-0" />
                </div>
              </motion.div>
            )}

            {activeOverviewTab === "highlights" && (
              <motion.div
                key="highlights"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-bold text-[#1E1B1C]">Key Institutional Highlights</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {highlightsList.map((item) => (
                    <div key={item.title} className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#EADED2] space-y-1">
                      <h4 className="text-sm font-bold text-[#5B001B] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span>{item.title}</span>
                      </h4>
                      <p className="text-xs text-[#4A4446] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Column: Head of Department (HOD) Luxury Card */}
        <div className="lg:col-span-4 sticky top-28 flex flex-col justify-center">
          <div className="p-7 sm:p-9 lg:p-10 rounded-[32px] bg-gradient-to-b from-[#FFFDF8] via-white to-[#FAF6EE] border-2 border-[#D4AF37] shadow-xl relative overflow-hidden flex flex-col justify-center">
            {/* Ambient Gold Glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Header Pills */}
            <div className="flex items-center justify-between gap-2 mb-8">
              <span className="px-3.5 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-[#5B001B] text-white shadow-xs">
                Head of Department
              </span>
              <span className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-wider">
                Academic Leadership
              </span>
            </div>

            {/* HOD Photo & Profile Info */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#5B001B] border-2 border-[#D4AF37] shadow-xl overflow-hidden flex items-center justify-center text-3xl font-extrabold text-[#D4AF37] shrink-0">
                {hodTeacher?.avatarUrl ? (
                  <Image
                    src={hodTeacher.avatarUrl}
                    alt={hodTeacher?.name || "HOD Profile"}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <span>{(hodTeacher?.name || "SM").replace(/[^A-Z]/g, "").slice(0, 2)}</span>
                )}
              </div>

              <div className="space-y-1 pt-1">
                <h3 className="text-xl sm:text-2xl font-black text-[#1E1B1C] leading-snug font-serif">
                  {hodTeacher?.name || "Prof. (Dr.) Subhashree Mohanty"}
                </h3>
                <p className="text-xs sm:text-sm font-extrabold text-[#5B001B]">
                  {hodTeacher?.designation || "Professor & Head of Department"}
                </p>
                {hodTeacher?.qualification && (
                  <p className="text-xs text-[#7A7476] font-semibold pt-0.5">
                    {hodTeacher.qualification}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
