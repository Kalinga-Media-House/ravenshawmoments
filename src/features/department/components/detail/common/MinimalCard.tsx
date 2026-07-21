"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, LucideIcon } from "lucide-react";

export interface MinimalCardProps {
  badge?: string;
  badgeStyle?: string;
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
  metaLeft?: string | React.ReactNode;
  metaRight?: string | React.ReactNode;
  onClick: () => void;
  index?: number;
  className?: string;
}

export const MinimalCard: React.FC<MinimalCardProps> = ({
  badge,
  badgeStyle = "bg-[#FAF8F5] text-[#5B001B] border border-[#EADFCF]",
  icon: IconComponent,
  title,
  subtitle,
  metaLeft,
  metaRight,
  onClick,
  index = 0,
  className = "",
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.4) }}
      className={`group text-left rounded-[24px] bg-[#FFFDF8] border border-[#EADFCF] p-5 sm:p-6 shadow-xs hover:shadow-xl sm:hover:shadow-2xl hover:border-[#D4AF37] hover:bg-gradient-to-br hover:from-[#FFFDF8] hover:via-[#FAF6EE] hover:to-[#F3ECE1] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between min-h-[180px] sm:min-h-[220px] relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#5B001B] ${className}`}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Top Row: Badge & Optional Icon */}
      {(badge || IconComponent) && (
        <div className="flex items-center justify-between gap-2 w-full mb-3">
          {badge ? (
            <span className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-black tracking-wider uppercase shadow-2xs truncate ${badgeStyle}`}>
              {badge}
            </span>
          ) : <div />}

          {IconComponent && (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-white/80 border border-[#EADFCF] flex items-center justify-center text-[#5B001B] group-hover:text-[#D4AF37] group-hover:border-[#D4AF37] group-hover:rotate-12 transition-all duration-300 shrink-0">
              <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          )}
        </div>
      )}

      {/* Middle: Title & Subtitle */}
      <div className="my-auto py-2">
        <h3 className="text-base sm:text-lg lg:text-xl font-black text-[#1E1B1C] group-hover:text-[#5B001B] transition-colors leading-snug font-serif line-clamp-3">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#4A4446] font-semibold mt-1 line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom Row: Meta info & Sliding Arrow */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-[#EADFCF]/60 w-full text-xs sm:text-sm font-bold text-[#7A7476] group-hover:text-[#1E1B1C] transition-colors mt-3">
        <div className="truncate flex items-center gap-2">
          {metaLeft && <span>{metaLeft}</span>}
          {metaRight && <span>{metaRight}</span>}
        </div>

        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5B001B]/10 group-hover:bg-[#5B001B] text-[#5B001B] group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1.5 shrink-0">
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </span>
      </div>
    </motion.button>
  );
};
