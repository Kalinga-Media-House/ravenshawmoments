"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { AchievementItem } from "../types/achievement";
import { AchievementCard } from "./AchievementCard";
import { FeaturedAchievement } from "./FeaturedAchievement";
import { AchievementStatistics } from "./AchievementStatistics";
import { AchievementsEmptyState } from "./AchievementsEmptyState";

const ITEMS_PER_PAGE = 9;

export interface AchievementsDirectoryProps {
  initialAchievements: AchievementItem[];
}

type SortOption = "latest" | "oldest" | "a-z";

export const AchievementsDirectory = ({ initialAchievements }: AchievementsDirectoryProps) => {
  const resultsRef = useRef<HTMLDivElement>(null);

  // Exclude featured from regular grid
  const featured = useMemo(() => initialAchievements.find(a => a.featured), [initialAchievements]);
  const regularAchievements = useMemo(() => initialAchievements, [initialAchievements]); // Search includes all

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedAchieverType, setSelectedAchieverType] = useState<string>("All");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 0);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedAchieverType, selectedLevel, sortBy]);

  // Derived filter options from actual data
  const availableCategories = useMemo(() => {
    const cats = new Set(initialAchievements.map(a => a.category).filter(Boolean));
    return ["All", ...Array.from(cats)].sort();
  }, [initialAchievements]);

  const availableAchieverTypes = useMemo(() => {
    const types = new Set(initialAchievements.map(a => a.achieverType).filter(Boolean));
    return ["All", ...Array.from(types)].sort();
  }, [initialAchievements]);

  const availableLevels = useMemo(() => {
    const levels = new Set(initialAchievements.map(a => a.level).filter(Boolean));
    return ["All", ...Array.from(levels)].sort();
  }, [initialAchievements]);

  // Filtering Logic
  const filteredAchievements = useMemo(() => {
    let result = regularAchievements;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(a => {
        return (
          a.title.toLowerCase().includes(q) ||
          a.shortDescription.toLowerCase().includes(q) ||
          (a.fullDescription && a.fullDescription.toLowerCase().includes(q)) ||
          a.category.toLowerCase().includes(q) ||
          a.level.toLowerCase().includes(q) ||
          (a.awardName && a.awardName.toLowerCase().includes(q)) ||
          (a.achieverName && a.achieverName.toLowerCase().includes(q)) ||
          (a.departmentName && a.departmentName.toLowerCase().includes(q)) ||
          (a.organizationName && a.organizationName.toLowerCase().includes(q)) ||
          (a.teamName && a.teamName.toLowerCase().includes(q)) ||
          (a.eventName && a.eventName.toLowerCase().includes(q))
        );
      });
    }

    if (selectedCategory !== "All") {
      result = result.filter(a => a.category === selectedCategory);
    }
    
    if (selectedAchieverType !== "All") {
      result = result.filter(a => a.achieverType === selectedAchieverType);
    }
    
    if (selectedLevel !== "All") {
      result = result.filter(a => a.level === selectedLevel);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.achievedAt).getTime() - new Date(b.achievedAt).getTime();
      }
      if (sortBy === "a-z") {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [regularAchievements, searchQuery, selectedCategory, selectedAchieverType, selectedLevel, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAchievements.length / ITEMS_PER_PAGE);
  const showPagination = filteredAchievements.length > ITEMS_PER_PAGE;
  
  const currentItems = useMemo(() => {
    if (!showPagination) return filteredAchievements;
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAchievements.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAchievements, currentPage, showPagination]);

  const handleClear = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedAchieverType("All");
    setSelectedLevel("All");
    setSortBy("latest");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full">
      {/* Featured section shown only if not actively searching/filtering heavily */}
      {featured && !searchQuery && selectedCategory === "All" && selectedAchieverType === "All" && selectedLevel === "All" && currentPage === 1 && (
        <FeaturedAchievement achievement={featured} />
      )}

      {/* Statistics */}
      {!searchQuery && selectedCategory === "All" && selectedAchieverType === "All" && selectedLevel === "All" && currentPage === 1 && (
        <AchievementStatistics achievements={initialAchievements} />
      )}

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12" ref={resultsRef}>
        
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-[320px] shrink-0 space-y-6 rm-reveal">
          
          {/* Search */}
          <div className="rm-glass-card rounded-[1.5rem] p-6 border border-[var(--color-rm-glass-border)]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black/40" aria-hidden="true" />
              <input
                type="text"
                placeholder="Search achievements..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-10 bg-black/5 border border-black/10 rounded-xl text-foreground placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-maroon)] transition-all"
                aria-label="Search achievements"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/10 text-black/60 hover:text-black transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filtering & Sorting */}
          <div className="rm-glass-card rounded-[1.5rem] p-6 border border-[var(--color-rm-glass-border)] space-y-6">
            <div className="flex items-center gap-2 text-white font-bold pb-4 border-b border-black/10">
              <SlidersHorizontal className="w-5 h-5 text-[var(--color-maroon)]" />
              Filters & Sorting
            </div>

            {/* Sort */}
            <div className="space-y-3">
              <label htmlFor="sort-by" className="text-[0.8rem] font-bold tracking-widest text-[var(--color-maroon)] uppercase block">
                Sort By
              </label>
              <select
                id="sort-by"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full h-11 px-4 bg-black/5 border border-black/10 rounded-xl text-white font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-maroon)] appearance-none cursor-pointer"
              >
                <option value="latest" className="bg-white">Latest Achievements</option>
                <option value="oldest" className="bg-white">Oldest Achievements</option>
                <option value="a-z" className="bg-white">A to Z</option>
              </select>
            </div>

            {/* Category */}
            {availableCategories.length > 1 && (
              <div className="space-y-3">
                <label className="text-[0.8rem] font-bold tracking-widest text-[var(--color-maroon)] uppercase block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableCategories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      aria-pressed={selectedCategory === cat}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        selectedCategory === cat 
                          ? "bg-[var(--color-maroon)] text-[#12070B] shadow-[0_4px_15px_rgba(217,164,65,0.3)]" 
                          : "bg-black/5 text-black/70 hover:bg-black/10 hover:text-black border border-black/10"
                      }`}
                    >
                      {cat === "All" ? "All Achievements" : cat}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Achiever Type */}
            {availableAchieverTypes.length > 1 && (
              <div className="space-y-3">
                <label className="text-[0.8rem] font-bold tracking-widest text-[var(--color-maroon)] uppercase block">
                  Community
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableAchieverTypes.map(type => (
                    <button
                      key={type}
                      onClick={() => setSelectedAchieverType(type)}
                      aria-pressed={selectedAchieverType === type}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        selectedAchieverType === type 
                          ? "bg-[var(--color-maroon)] text-[#12070B] shadow-[0_4px_15px_rgba(217,164,65,0.3)]" 
                          : "bg-black/5 text-black/70 hover:bg-black/10 hover:text-black border border-black/10"
                      }`}
                    >
                      {type === "All" ? "All Achievers" : type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Level */}
            {availableLevels.length > 1 && (
              <div className="space-y-3">
                <label className="text-[0.8rem] font-bold tracking-widest text-[var(--color-maroon)] uppercase block">
                  Level
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableLevels.map(level => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      aria-pressed={selectedLevel === level}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        selectedLevel === level 
                          ? "bg-[var(--color-maroon)] text-[#12070B] shadow-[0_4px_15px_rgba(217,164,65,0.3)]" 
                          : "bg-black/5 text-black/70 hover:bg-black/10 hover:text-black border border-black/10"
                      }`}
                    >
                      {level === "All" ? "All Levels" : level}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>

        {/* Results Column */}
        <div className="flex-grow">
          
          {/* Results Count Header */}
          <div className="mb-8 flex items-center justify-between rm-reveal">
            <h2 className="text-xl font-bold rm-heading-primary" aria-live="polite">
              {filteredAchievements.length === 0 
                ? "No matching achievements" 
                : `Showing ${filteredAchievements.length} ${filteredAchievements.length === 1 ? 'achievement' : 'achievements'}`}
            </h2>
          </div>

          {/* Grid */}
          {filteredAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {currentItems.map((item, idx) => (
                <div key={item.id} className="rm-reveal h-full" style={{ transitionDelay: `${Math.min(idx * 50, 300)}ms` }}>
                  <AchievementCard achievement={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rm-reveal">
              <AchievementsEmptyState onClear={handleClear} />
            </div>
          )}

          {/* Pagination */}
          {showPagination && (
            <div className="mt-12 flex items-center justify-center gap-2 rm-reveal">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-black/5 border border-black/10 text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/10 transition-colors"
                aria-label="Previous page"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    aria-pressed={currentPage === page}
                    aria-label={`Page ${page}`}
                    className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                      currentPage === page 
                        ? "bg-[var(--color-maroon)] text-[#12070B]" 
                        : "bg-black/5 border border-black/10 text-white hover:bg-black/10"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-black/5 border border-black/10 text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black/10 transition-colors"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
