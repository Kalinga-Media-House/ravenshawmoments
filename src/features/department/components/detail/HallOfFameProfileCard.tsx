"use client";

import React from "react";
import Image from "next/image";
import { Award, Trophy, Sparkles, UserCheck, ChevronRight, FileText } from "lucide-react";
import { DepartmentAchievementMock } from "../../data/mock-department-detail";

export interface HallOfFameProfileCardProps {
  achievement: DepartmentAchievementMock;
  onClickAchievement: () => void;
  onClickProfile?: () => void;
}

const getCategoryStyles = (category: string, subCategory?: string) => {
  const catString = `${category} ${subCategory || ""}`.toLowerCase();
  
  if (catString.includes("alumni")) {
    return {
      color: "text-blue-700",
      bg: "bg-blue-100",
      border: "border-blue-200",
      icon: UserCheck
    };
  }
  if (catString.includes("gold")) {
    return {
      color: "text-[#D4AF37]",
      bg: "bg-[#D4AF37]/10",
      border: "border-[#D4AF37]/20",
      icon: Trophy
    };
  }
  if (catString.includes("exam") || catString.includes("competition")) {
    return {
      color: "text-emerald-700",
      bg: "bg-emerald-100",
      border: "border-emerald-200",
      icon: Award
    };
  }
  if (catString.includes("research") || catString.includes("publication") || catString.includes("scientist")) {
    return {
      color: "text-purple-700",
      bg: "bg-purple-100",
      border: "border-purple-200",
      icon: Sparkles
    };
  }
  // Default (National Awards, etc)
  return {
    color: "text-[#5B001B]",
    bg: "bg-[#5B001B]/10",
    border: "border-[#5B001B]/20",
    icon: Award
  };
};

export const HallOfFameProfileCard: React.FC<HallOfFameProfileCardProps> = ({
  achievement,
  onClickAchievement,
  onClickProfile
}) => {
  const name = (achievement as any).studentName || (achievement as any).recipient || "Department Scholar";
  const initials = name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase();
  const position = (achievement as any).currentPosition || (achievement as any).exam || "Academic Scholar";
  const org = (achievement as any).award || achievement.category; // Fallback mapping for organization
  const year = (achievement as any).year || (achievement as any).date || "Recent";
  const badgeLabel = achievement.subCategory || achievement.category || "HONOR";
  
  const styles = getCategoryStyles(achievement.category, achievement.subCategory);
  const Icon = styles.icon;

  return (
    <div className="group relative flex flex-col h-full bg-[#FFFDF8] rounded-[20px] sm:rounded-[24px] border border-[#EADFCF] shadow-sm transition-all duration-300 hover:-translate-y-[6px] hover:shadow-[0_12px_24px_rgba(212,175,55,0.12)] hover:border-[#5B001B]/30 isolate overflow-hidden p-4 sm:p-5">
      
      {/* Top Row: Avatar & Icon */}
      <div className="flex justify-between items-start mb-3">
        <div className="w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-full border-2 border-[#D4AF37]/30 shadow-sm bg-gradient-to-br from-[#5B001B] to-[#1E1B1C] flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 shrink-0">
          <span className="text-sm sm:text-base font-black text-[#D4AF37] tracking-widest">{initials}</span>
        </div>
        
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${styles.bg} ${styles.color} shrink-0 transition-transform group-hover:scale-110`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Category Badge */}
      <div className="mb-2">
        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${styles.bg} ${styles.color} ${styles.border} inline-block`}>
          {badgeLabel}
        </span>
      </div>

      {/* Identity */}
      <h3 className="text-base sm:text-lg lg:text-[20px] font-black text-[#1E1B1C] font-serif leading-tight mb-1 line-clamp-2">
        {name}
      </h3>
      <p className="text-[13px] sm:text-[14px] font-bold text-[#4A4446] mb-0.5 truncate">
        {position}
      </p>
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span className="text-[11px] sm:text-[12px] font-medium text-[#7A7476] truncate max-w-full">
          {org}
        </span>
        {achievement.batch && (
          <>
            <span className="w-1 h-1 rounded-full bg-[#EADFCF] shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-bold text-[#5B001B] shrink-0 bg-[#5B001B]/5 px-1.5 rounded">
              Batch {achievement.batch}
            </span>
          </>
        )}
      </div>

      {/* Summary */}
      <p className="text-[11px] sm:text-[12px] text-[#7A7476] leading-relaxed line-clamp-2 mb-4 font-medium flex-1">
        {achievement.description || "Recognized for outstanding academic excellence and institutional pride."}
      </p>

      {/* Buttons */}
      <div className="mt-auto flex items-center gap-2 w-full pt-3 border-t border-[#EADFCF]/50">
        <button 
          type="button"
          onClick={onClickProfile}
          className="flex-1 h-[38px] sm:h-[40px] rounded-xl bg-[#FAF8F5] border border-[#EADFCF] hover:border-[#5B001B] hover:bg-[#5B001B] hover:text-white text-[#1E1B1C] text-[10px] sm:text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Profile</span>
          <span className="sm:hidden">View</span>
        </button>
        
        <button 
          type="button"
          onClick={onClickAchievement}
          className="flex-1 h-[38px] sm:h-[40px] rounded-xl bg-transparent border border-transparent hover:bg-[#FAF8F5] hover:border-[#EADFCF] text-[#5B001B] text-[10px] sm:text-[11px] font-bold transition-colors flex items-center justify-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Details</span>
          <span className="sm:hidden">Info</span>
        </button>
      </div>

    </div>
  );
};
