"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X, Calendar, CheckCircle2, FileText, Search } from "lucide-react";
import { DepartmentAchievementMock } from "../../data/mock-department-detail";
import { SectionHeader, EmptyState } from "./common";
import { HallOfFameMetrics } from "./HallOfFameMetrics";
import { HallOfFameFeaturedCard } from "./HallOfFameFeaturedCard";
import { HallOfFameProfileCard } from "./HallOfFameProfileCard";

export interface DepartmentAchievementsSectionProps {
  achievements: DepartmentAchievementMock[];
  departmentName: string;
  slug?: string;
}

export const DepartmentAchievementsSection: React.FC<DepartmentAchievementsSectionProps> = ({
  achievements,
  departmentName,
  slug,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAchievement, setSelectedAchievement] = useState<DepartmentAchievementMock | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!achievements || achievements.length === 0) {
    return null;
  }

  const categories = [
    { id: "All", label: "All Achievements" },
    { id: "Distinguished Alumni", label: "Distinguished Alumni" },
    { id: "Gold Medalists", label: "Gold Medalists" },
    { id: "Competitive Exam Success", label: "Competitive Exam Success" },
    { id: "Research & Innovation", label: "Research & Innovation" },
  ];

  // 1. Filter by category
  let filteredAchievements = selectedCategory === "All"
    ? achievements
    : achievements.filter((item) => {
        if (item.subCategory === selectedCategory) return true;
        if (selectedCategory === "Distinguished Alumni" && (item.category === "Alumni" || item.badge?.includes("Alumni"))) return true;
        if (selectedCategory === "Gold Medalists" && item.category === "Gold Medalists") return true;
        if (selectedCategory === "Competitive Exam Success" && (item.category === "Competitions" || item.exam)) return true;
        if (selectedCategory === "Research & Innovation" && (item.category === "Research" || item.category === "Publications")) return true;
        return false;
      });

  // 2. Filter by Search Query
  if (searchQuery.trim().length > 0) {
    const q = searchQuery.toLowerCase();
    filteredAchievements = filteredAchievements.filter((item) => {
      const searchable = [
        item.title,
        (item as any).studentName,
        (item as any).recipient,
        (item as any).currentPosition,
        item.batch,
        (item as any).award,
        (item as any).exam,
        item.category,
        item.subCategory,
        item.description
      ].filter(Boolean).join(" ").toLowerCase();
      
      return searchable.includes(q);
    });
  }

  const featuredAchievement = filteredAchievements.length > 0 ? filteredAchievements[0] : null;
  const gridAchievements = filteredAchievements.length > 1 ? filteredAchievements.slice(1) : [];

  return (
    <section id="achievements" className="scroll-mt-32 pt-10 sm:pt-16 pb-16 sm:pb-20 border-b border-[#EADED2]">
      
      {/* 1. Header & Metrics */}
      <div className="mb-12">
        <div className="flex items-center gap-2 text-[#5B001B] mb-2">
          <Trophy className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Honor Board</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#1E1B1C] font-serif leading-tight">
          Achievements Hub &amp; Hall of Fame
        </h2>
        <p className="text-base sm:text-lg text-[#7A7476] mt-3 max-w-3xl font-medium">
          Showcasing the department's top scholars, distinguished alumni, university gold medalists, national competitive qualifiers, and research triumphs.
        </p>

        <HallOfFameMetrics achievements={achievements} />
      </div>

      {/* 2. Segmented Controls & Search Box */}
      <div className="flex flex-col gap-6 mb-8 lg:mb-12">
        
        {/* Animated Segmented Control */}
        <div className="relative flex items-center bg-[#FAF8F5] p-1.5 rounded-full border border-[#EADFCF] w-full max-w-5xl overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => startTransition(() => setSelectedCategory(cat.id))}
              className="relative z-10 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-colors whitespace-nowrap flex-1 text-center"
              style={{ color: selectedCategory === cat.id ? "#FFFFFF" : "#4A4446" }}
            >
              {selectedCategory === cat.id && (
                <motion.div
                  layoutId="hallOfFameActiveTab"
                  className="absolute inset-0 bg-[#5B001B] rounded-full z-[-1] shadow-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <input
            type="text"
            placeholder="Search by name, batch, exam, position..."
            value={searchQuery}
            onChange={(e) => startTransition(() => setSearchQuery(e.target.value))}
            className="w-full pl-11 pr-4 py-3 bg-[#FFFDF8] border border-[#EADFCF] rounded-full text-sm font-medium text-[#1E1B1C] placeholder-[#7A7476] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-sm"
          />
        </div>

      </div>

      {/* 3. Featured & Grid Content */}
      <div
        className={`transition-opacity duration-300 ${
          isPending ? "opacity-50 scale-[0.99]" : "opacity-100 scale-100"
        }`}
      >
        {filteredAchievements.length === 0 ? (
          <EmptyState
            title="No records found"
            description="Adjust your search query or filters to explore the department's Hall of Fame."
          />
        ) : (
          <>
            {/* Featured Hero Card */}
            {featuredAchievement && (
              <HallOfFameFeaturedCard 
                achievement={featuredAchievement}
                onClickAchievement={() => setSelectedAchievement(featuredAchievement)}
                onClickProfile={() => alert(`Navigating to ${(featuredAchievement as any).studentName || (featuredAchievement as any).recipient}'s full profile...`)}
              />
            )}

            {/* Profile Cards Grid */}
            {gridAchievements.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 mt-8">
                {gridAchievements.map((item, idx) => (
                  <HallOfFameProfileCard
                    key={item.id || idx}
                    achievement={item}
                    onClickAchievement={() => setSelectedAchievement(item)}
                    onClickProfile={() => alert(`Navigating to ${(item as any).studentName || (item as any).recipient}'s full profile...`)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* 4. Original Premium Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAchievement(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl rounded-[32px] bg-[#FFFDF8] border-2 border-[#D4AF37] shadow-2xl p-6 sm:p-8 lg:p-10 z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setSelectedAchievement(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-[#FAF8F5] hover:bg-[#EADFCF] border border-[#EADFCF] flex items-center justify-center text-[#1E1B1C] transition-all hover:rotate-90 z-20 shadow-xs"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-[#5B001B] text-white">
                  {selectedAchievement.category}
                </span>
                <span className="text-xs font-bold text-[#7A7476] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Awarded {(selectedAchievement as any).year || (selectedAchievement as any).date || "Recent"}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-[#1E1B1C] font-serif leading-tight">
                {selectedAchievement.title}
              </h3>

              <div className="mt-4 p-4 rounded-2xl bg-white border border-[#EADFCF] flex items-center gap-3 shadow-2xs">
                <div className="w-12 h-12 rounded-full bg-[#5B001B] text-[#D4AF37] flex items-center justify-center font-extrabold text-lg shrink-0">
                  {((selectedAchievement as any).studentName || (selectedAchievement as any).recipient || "RS").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#1E1B1C]">
                    {(selectedAchievement as any).studentName || (selectedAchievement as any).recipient || "Department Scholar"}
                  </h4>
                  <p className="text-xs text-[#5B001B] font-extrabold">
                    Verified Award Recipient / Competitor
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#4A4446] mt-6 leading-relaxed font-medium">
                {selectedAchievement.description}
              </p>

              {/* Certificate Preview Box */}
              <div className="mt-6 p-6 rounded-2xl bg-[#FAF8F5] border-2 border-dashed border-[#D4AF37]/60 text-center space-y-3">
                <Trophy className="w-10 h-10 text-[#D4AF37] mx-auto" />
                <h4 className="text-sm font-black text-[#1E1B1C] font-serif">
                  Official Institutional Citation &amp; Certificate
                </h4>
                <p className="text-xs text-[#7A7476] max-w-md mx-auto">
                  Verified record archived under Ravenshaw University academic excellence records.
                </p>
                <button
                  type="button"
                  onClick={() => alert(`Downloading official certificate/citation PDF for ${(selectedAchievement as any).studentName || (selectedAchievement as any).recipient || "recipient"}...`)}
                  className="px-5 py-2 rounded-full bg-[#5B001B] hover:bg-[#720022] text-white text-xs font-extrabold transition-all shadow-md inline-flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Download Certificate Copy</span>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EADFCF] text-xs text-[#7A7476] flex items-center justify-between font-medium">
                <span className="flex items-center gap-1 text-[#5B001B] font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Verified Institutional Triumph
                </span>
                <span>ID: #{selectedAchievement.id.toUpperCase()}</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
