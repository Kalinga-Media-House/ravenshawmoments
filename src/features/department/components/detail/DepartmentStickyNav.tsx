"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export interface DepartmentStickyNavProps {
  facultyCount?: number;
  studentsCount?: number;
  programsCount?: number;
  achievementsCount?: number;
  galleryCount?: number;


}

export const DepartmentStickyNav: React.FC<DepartmentStickyNavProps> = ({
  facultyCount = 16,
  studentsCount = 350,
  programsCount = 4,
  achievementsCount = 48,
  galleryCount = 320,


}) => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [hoveredTab, setHoveredTab] = useState<string | null>(null);

  const navItems = [
    { id: "overview", label: "Overview" },
    { id: "programs", label: "Programs", count: programsCount },
    { id: "faculty", label: "Faculty", count: facultyCount },
    { id: "students", label: "Students", count: studentsCount },
    { id: "achievements", label: "Achievements", count: achievementsCount },

    { id: "gallery", label: "Gallery", count: galleryCount },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const item of navItems) {
        const element = document.getElementById(item.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveTab(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav aria-label="Department Sections Navigation" className="sticky top-[72px] z-40 w-full bg-white/95 backdrop-blur-xl border-b border-[#EADED2]/80 shadow-xs transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-[1400px]">
        <div 
          className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2 sm:py-3 relative"
          onMouseLeave={() => setHoveredTab(null)}
        >
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isHovered = hoveredTab === item.id;
            const hasUnderline = (hoveredTab ?? activeTab) === item.id;

            return (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                onMouseEnter={() => setHoveredTab(item.id)}
                className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-bold tracking-tight transition-colors duration-300 shrink-0 flex items-center gap-1.5 outline-none ${
                  isActive
                    ? "text-white bg-[#5B001B] shadow-sm"
                    : isHovered
                    ? "text-[#5B001B] bg-transparent"
                    : "text-[#4A4446] bg-transparent hover:bg-[#FAF8F5]"
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-colors duration-300 relative z-10 ${
                      isActive
                        ? "bg-[#D4AF37] text-[#1E1B1C]"
                        : isHovered
                        ? "bg-[#5B001B]/10 text-[#5B001B]"
                        : "bg-[#EADED2]/60 text-[#7A7476]"
                    }`}
                  >
                    {item.count}
                  </span>
                )}

                {hasUnderline && (
                  <motion.div
                    layoutId="navHoverUnderline"
                    className="absolute -bottom-[9px] sm:-bottom-[13px] left-3 right-3 h-[2.5px] bg-[#D4AF37] rounded-full shadow-[0_0_8px_rgba(212,175,55,0.4)] z-20"
                    transition={{ type: "spring", stiffness: 350, damping: 35, mass: 0.8 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
