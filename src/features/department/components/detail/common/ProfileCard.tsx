"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export interface ProfileCardProps {
  photoUrl?: string;
  name: string;
  title: string; // Designation or Graduation Year or Batch
  subtitle: string; // Research specialization (1 line) or Course or Company
  onClick: () => void;
  index?: number;
  badge?: string;
  badgeStyle?: string;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  photoUrl,
  name,
  title,
  subtitle,
  onClick,
  index = 0,
  badge,
  badgeStyle = "bg-[#FAF8F5] text-[#5B001B] border border-[#EADFCF]",
}) => {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.08, 0.4) }}
      className="group text-left rounded-[24px] bg-[#FFFDF8] border border-[#EADFCF] p-5 sm:p-6 shadow-xs hover:shadow-xl sm:hover:shadow-2xl hover:border-[#D4AF37] hover:bg-gradient-to-br hover:from-[#FFFDF8] hover:via-[#FAF6EE] hover:to-[#F3ECE1] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#5B001B]"
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Top: Optional Badge */}
      {badge && (
        <div className="mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${badgeStyle}`}>
            {badge}
          </span>
        </div>
      )}

      {/* Profile Photo & Name */}
      <div className="flex flex-col items-center text-center space-y-3.5 my-auto py-2">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#5B001B] border-2 border-[#D4AF37] shadow-md group-hover:scale-105 transition-transform duration-300 overflow-hidden flex items-center justify-center text-xl sm:text-2xl font-extrabold text-[#D4AF37] shrink-0">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt={name}
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <span>{name.replace(/[^A-Z]/g, "").slice(0, 2) || "RM"}</span>
          )}
        </div>

        <div className="space-y-1 w-full px-1">
          <h3 className="text-base sm:text-lg font-black text-[#1E1B1C] group-hover:text-[#5B001B] transition-colors leading-snug font-serif line-clamp-1">
            {name}
          </h3>
          <p className="text-xs sm:text-sm font-extrabold text-[#5B001B] line-clamp-1">
            {title}
          </p>
          <p className="text-xs text-[#7A7476] font-medium line-clamp-1">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Bottom Row: Sliding Arrow */}
      <div className="flex items-center justify-end pt-3 border-t border-[#EADFCF]/60 w-full mt-3">
        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#5B001B]/10 group-hover:bg-[#5B001B] text-[#5B001B] group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:translate-x-1.5 shrink-0">
          <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </span>
      </div>
    </motion.button>
  );
};
