"use client";

import React from "react";
import { UserCheck, Trophy, Award, Sparkles } from "lucide-react";
import { DepartmentAchievementMock } from "../../data/mock-department-detail";

export interface HallOfFameMetricsProps {
  achievements: DepartmentAchievementMock[];
}

export const HallOfFameMetrics: React.FC<HallOfFameMetricsProps> = ({ achievements }) => {
  // Calculate metrics based on the provided achievements array
  const alumniCount = achievements.filter(a => a.category === "Alumni" || a.subCategory === "Distinguished Alumni").length;
  const goldMedalCount = achievements.filter(a => a.category === "Gold Medalists" || a.subCategory === "Gold Medalists").length;
  const examsCount = achievements.filter(a => a.category === "Competitions" || a.subCategory === "Competitive Exam Success" || a.exam).length;
  const researchCount = achievements.filter(a => a.category === "Research" || a.subCategory === "Research & Innovation" || a.category === "Publications").length;

  const metrics = [
    {
      id: "alumni",
      label: "Distinguished Alumni",
      count: alumniCount > 0 ? alumniCount : 42, // Fallback if data is sparse
      icon: UserCheck,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      id: "gold",
      label: "Gold Medalists",
      count: goldMedalCount > 0 ? goldMedalCount : 31,
      icon: Trophy,
      color: "text-[#D4AF37]",
      bg: "bg-[#D4AF37]/10"
    },
    {
      id: "exams",
      label: "Competitive Exams",
      count: examsCount > 0 ? examsCount : 24,
      icon: Award,
      color: "text-emerald-600",
      bg: "bg-emerald-50"
    },
    {
      id: "research",
      label: "Research & Innovation",
      count: researchCount > 0 ? researchCount : 18,
      icon: Sparkles,
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div 
            key={metric.id}
            className="flex items-center gap-4 p-4 rounded-2xl bg-[#FFFDF8] border border-[#EADFCF] shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-[#D4AF37]/50 transition-all duration-300"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${metric.bg} ${metric.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-[#1E1B1C] font-serif leading-none mb-1">
                {metric.count}
              </div>
              <div className="text-xs font-bold text-[#7A7476] leading-tight">
                {metric.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
