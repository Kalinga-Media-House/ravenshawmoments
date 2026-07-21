"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CompetitionDirectoryCategory } from "../types/categoryPortal";
import {
  getCategoryPortalTheme,
  renderCategoryPortalIcon,
} from "./portal/CategoryThemeRegistry";

interface CompetitionCategoriesProps {
  categories: CompetitionDirectoryCategory[];
}

export const CompetitionCategories: React.FC<CompetitionCategoriesProps> = ({
  categories,
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const handleToggle = () => {
    if (isExpanded && sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < 0) {
        // Only scroll if the heading is above the viewport
        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        sectionRef.current.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    }
    setIsExpanded(!isExpanded);
  };

  if (!categories || categories.length === 0) {
    return (
      <section aria-labelledby="competition-categories-empty-heading" className="w-full">
        <div className="flex flex-col items-center justify-center p-12 text-center border border-[var(--color-rm-gold)]/20 rounded-2xl bg-white">
          <h2 id="competition-categories-empty-heading" className="text-xl font-bold text-[var(--color-rm-maroon)] mb-2">
            No Active Categories
          </h2>
          <p className="text-black/60">
            There are currently no active competition categories. Please check back later.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      aria-labelledby="competition-categories-heading" 
      className="w-full scroll-mt-24"
    >
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2
            id="competition-categories-heading"
            className="text-2xl sm:text-3xl font-black text-[var(--color-rm-maroon)] tracking-tight"
          >
            Explore Categories
          </h2>
          <p className="text-sm sm:text-base text-black/60 mt-1 font-medium">
            Find the perfect stage for your talent
          </p>
        </div>
      </div>

      <div 
        id="categories-grid"
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-5"
      >
        {(isExpanded ? categories : categories.slice(0, 12)).map((category) => {
          const isActive = activeCategory === category.name;
          const theme = getCategoryPortalTheme(category.slug);

          return (
            <Link
              href={`/competitions/categories/${category.slug}`}
              key={category.id}
              className="block outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-rm-gold)] rounded-2xl"
              onFocus={() => setActiveCategory(category.name)}
              onBlur={() => setActiveCategory(null)}
            >
              <div
                className="group relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 ease-out h-full"
                style={{
                  backgroundColor: theme.backgroundColor,
                  borderColor: isActive ? theme.accentColor : theme.borderColor,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  boxShadow: isActive
                    ? `0 0 0 2px ${theme.backgroundColor}, 0 0 0 4px ${theme.accentColor}40, 0 10px 25px rgba(35, 20, 25, 0.1)`
                    : "0 6px 20px rgba(35, 20, 25, 0.06)",
                  transform: isActive ? "translateY(-6px)" : "translateY(0)",
                }}
                onMouseEnter={(e) => {
                  setActiveCategory(category.name);
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.boxShadow = `0 12px 28px rgba(35, 20, 25, 0.08), 0 0 15px ${theme.accentColor}15`;
                  e.currentTarget.style.borderColor = theme.accentColor;
                }}
                onMouseLeave={(e) => {
                  setActiveCategory(null);
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(35, 20, 25, 0.06)";
                  e.currentTarget.style.borderColor = theme.borderColor;
                }}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 rounded-b-full transition-all duration-300"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                )}

                {/* Icon Container */}
                <div
                  className="w-[48px] h-[48px] sm:w-[52px] sm:h-[52px] flex items-center justify-center rounded-[16px] mb-3 sm:mb-4 transition-all duration-300 ease-out group-hover:scale-[1.08] group-hover:rotate-[2deg] flex-shrink-0"
                  style={{
                    backgroundColor: `${theme.accentColor}15`, // 15% opacity of accent
                    color: theme.accentColor,
                  }}
                >
                  {renderCategoryPortalIcon(theme.iconName, "w-6 h-6")}
                </div>

                {/* Category Title */}
                <h3
                  className="text-xs sm:text-sm font-bold text-center transition-colors duration-300 leading-tight w-full break-words"
                  style={{
                    color: theme.isDarkTheme ? "#FFFFFF" : (isActive ? theme.accentColor : "#352E31"),
                  }}
                  onMouseEnter={(e) => {
                    if (!theme.isDarkTheme && !isActive) e.currentTarget.style.color = theme.accentColor;
                  }}
                  onMouseLeave={(e) => {
                    if (!theme.isDarkTheme && !isActive) e.currentTarget.style.color = "#352E31";
                  }}
                >
                  {category.name}
                </h3>

                {/* Hover Glow Effect */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                  style={{
                    boxShadow: `inset 0 0 20px ${theme.accentColor}05`,
                  }}
                />
              </div>
            </Link>
          );
        })}
      </div>

      {categories.length > 12 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleToggle}
            aria-expanded={isExpanded}
            aria-controls="categories-grid"
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm sm:text-base text-white bg-[#4A0711] border border-[#6B1724] hover:bg-[#650D1B] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D4AF37]"
          >
            {isExpanded ? (
              <>
                Show Fewer Categories
                <ChevronUp className="w-5 h-5 text-white" />
              </>
            ) : (
              <>
                Explore More Categories
                <ChevronDown className="w-5 h-5 text-white" />
              </>
            )}
          </button>
        </div>
      )}
    </section>
  );
};
