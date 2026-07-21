"use client";

import React from "react";
import { UserCheck, FileText, Sparkles, Trophy, Award } from "lucide-react";
import { DepartmentAchievementMock } from "../../data/mock-department-detail";

export interface HallOfFameFeaturedCardProps {
  achievement: DepartmentAchievementMock;
  onClickAchievement: () => void;
  onClickProfile?: () => void;
}

const getCategoryStyles = (category: string, subCategory?: string) => {
  const catString = `${category} ${subCategory || ""}`.toLowerCase();
  
  if (catString.includes("alumni")) {
    return { color: "text-blue-700", bg: "bg-blue-100", border: "border-blue-200", icon: UserCheck };
  }
  if (catString.includes("gold")) {
    return { color: "text-[#D4AF37]", bg: "bg-[#D4AF37]/10", border: "border-[#D4AF37]/20", icon: Trophy };
  }
  if (catString.includes("exam") || catString.includes("competition")) {
    return { color: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-200", icon: Award };
  }
  if (catString.includes("research") || catString.includes("publication") || catString.includes("scientist")) {
    return { color: "text-purple-700", bg: "bg-purple-100", border: "border-purple-200", icon: Sparkles };
  }
  return { color: "text-[#5B001B]", bg: "bg-[#5B001B]/10", border: "border-[#5B001B]/20", icon: Award };
};

export const HallOfFameFeaturedCard: React.FC<HallOfFameFeaturedCardProps> = ({
  achievement,
  onClickAchievement,
  onClickProfile
}) => {
  const name = (achievement as any).studentName || (achievement as any).recipient || "Department Scholar";
  const initials = name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
  const position = (achievement as any).currentPosition || (achievement as any).exam || "Academic Scholar";
  const org = (achievement as any).award || achievement.category;
  const year = (achievement as any).year || (achievement as any).date || "Recent";
  const badgeLabel = achievement.subCategory || achievement.category || "HONOR";
  
  const styles = getCategoryStyles(achievement.category, achievement.subCategory);
  const Icon = styles.icon;

  return (
    <div className="relative flex flex-col md:flex-row items-center gap-5 md:gap-8 p-5 sm:p-6 lg:p-8 bg-[#FFFDF8] rounded-[24px] sm:rounded-[28px] border border-[#EADFCF] shadow-sm hover:shadow-md hover:border-[#D4AF37]/50 transition-all duration-300 mt-8 mb-10 isolate overflow-hidden">
      
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 z-[-1] pointer-events-none" />

      {/* Top Right Icon */}
      <div className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center ${styles.bg} ${styles.color}`}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Left: Avatar */}
      <div className="shrink-0 flex flex-col items-center">
        <div className="w-[80px] h-[80px] lg:w-[100px] lg:h-[100px] rounded-full border-2 border-[#D4AF37]/30 shadow-md bg-gradient-to-br from-[#5B001B] to-[#1E1B1C] flex items-center justify-center overflow-hidden mb-3 transition-transform hover:scale-105">
          <span className="text-xl lg:text-2xl font-black text-[#D4AF37] tracking-widest">{initials}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${styles.bg} ${styles.color} ${styles.border}`}>
          {badgeLabel}
        </span>
      </div>

      {/* Right: Content */}
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
        
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1E1B1C] font-serif leading-tight mb-1.5">
          {name}
        </h3>
        
        <p className="text-sm lg:text-base font-bold text-[#4A4446] mb-1">
          {position}
        </p>
        
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-3 text-xs">
          <span className="font-medium text-[#7A7476]">{org}</span>
          <span className="w-1 h-1 rounded-full bg-[#EADFCF]" />
          {achievement.batch && (
            <>
              <span className="font-semibold text-[#7A7476]">Batch {achievement.batch}</span>
              <span className="w-1 h-1 rounded-full bg-[#EADFCF]" />
            </>
          )}
          <span className="font-bold text-[#5B001B] bg-[#5B001B]/5 px-1.5 py-0.5 rounded-md">
            {year}
          </span>
        </div>

        <p className="text-xs sm:text-sm text-[#4A4446] leading-relaxed max-w-xl font-medium mb-5 line-clamp-3">
          {achievement.description || "Recognized for outstanding academic excellence, leadership, and bringing honor to the department through exceptional institutional contributions."}
        </p>

        <div className="flex flex-row items-center gap-3 mt-auto w-full md:w-auto">
          <button 
            type="button"
            onClick={onClickProfile}
            className="flex-1 md:flex-none px-5 py-2.5 h-[42px] rounded-xl bg-[#5B001B] text-white text-xs font-bold shadow-sm hover:bg-[#720022] hover:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <UserCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>View Profile</span>
          </button>
          
          <button 
            type="button"
            onClick={onClickAchievement}
            className="flex-1 md:flex-none px-5 py-2.5 h-[42px] rounded-xl bg-[#FAF8F5] border border-[#EADFCF] text-[#1E1B1C] text-xs font-bold shadow-sm hover:border-[#D4AF37] hover:bg-white transition-all flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4 text-[#5B001B]" />
            <span>Achievement</span>
          </button>
        </div>

      </div>
    </div>
  );
};
