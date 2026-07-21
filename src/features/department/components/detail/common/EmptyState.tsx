"use client";

import React from "react";
import { LucideIcon, Sparkles } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: IconComponent = Sparkles,
}) => {
  return (
    <div className="p-12 text-center rounded-[24px] bg-[#FFFDF8] border border-[#EADFCF] shadow-xs max-w-xl mx-auto my-6">
      <div className="w-12 h-12 rounded-2xl bg-[#FAF8F5] border border-[#EADFCF] flex items-center justify-center text-[#5B001B] mx-auto mb-4">
        <IconComponent className="w-6 h-6 text-[#D4AF37]" />
      </div>
      <h3 className="text-lg font-bold text-[#1E1B1C]">{title}</h3>
      <p className="text-sm text-[#4A4446] mt-1 leading-relaxed">{description}</p>
    </div>
  );
};
