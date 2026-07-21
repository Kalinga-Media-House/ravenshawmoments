"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export interface SectionHeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeIcon?: LucideIcon;
  actionButton?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badgeText,
  badgeIcon: BadgeIcon,
  actionButton,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-12">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-1 bg-[#D4AF37] rounded-full" />
          <h2 className="font-black text-[#1E1B1C] tracking-tight font-serif" style={{ fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
            {title}
          </h2>
        </div>
        <p className="text-sm sm:text-base text-[#4A4446] max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
        {badgeText && (
          <span className="text-xs font-semibold bg-[#FAF8F5] text-[#5B001B] px-3.5 py-1.5 rounded-full border border-[#EADFCF] flex items-center gap-1.5 shadow-2xs">
            {BadgeIcon && <BadgeIcon className="w-4 h-4 text-[#D4AF37]" />}
            <span>{badgeText}</span>
          </span>
        )}
        {actionButton}
      </div>
    </div>
  );
};
