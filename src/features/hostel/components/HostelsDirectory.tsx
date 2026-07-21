"use client";

import React, { useState, useMemo } from "react";
import { Search, X, BookOpen } from "lucide-react";
import { DIRECTORY_HOSTELS } from "../data/hostels-directory";
import { HostelGenderCategory } from "../types/directory";
import { HostelDirectoryCard } from "./HostelDirectoryCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const CATEGORIES: HostelGenderCategory[] = [
  "All Hostels",
  "Boys' Hostels",
  "Girls' Hostels"
];

export const HostelsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<HostelGenderCategory>("All Hostels");
  const revealRef = useScrollReveal();

  const filteredHostels = useMemo(() => {
    return DIRECTORY_HOSTELS.filter(hostel => {
      // Category Match
      const matchesCategory = activeCategory === "All Hostels" || hostel.genderCategory === activeCategory;
      
      // Search Match
      const cleanQuery = searchQuery.trim().toLowerCase();
      if (!cleanQuery) return matchesCategory;

      const searchableString = [
        hostel.name,
        hostel.genderCategory,
        ...hostel.searchKeywords
      ].filter(Boolean).join(" ").toLowerCase();

      const matchesSearch = searchableString.includes(cleanQuery);

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const handleClear = () => {
    setSearchQuery("");
    setActiveCategory("All Hostels");
  };

  // Generate accessible result string
  const resultText = useMemo(() => {
    const count = filteredHostels.length;
    const countStr = count === 1 ? "1 hostel" : `${count} hostels`;
    
    if (searchQuery.trim()) {
      return `${countStr} found for "${searchQuery.trim()}"`;
    }
    
    if (activeCategory !== "All Hostels") {
      return `Showing ${count} ${activeCategory.toLowerCase()}`;
    }
    
    return `Showing ${count} hostels`;
  }, [filteredHostels.length, searchQuery, activeCategory]);

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-transparent" ref={revealRef as React.RefObject<HTMLDivElement>}>
      <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px]">
        
        {/* Search and Filters Block */}
        <div className="flex flex-col mb-12 lg:mb-16 gap-8 rm-reveal">
          {/* Search Bar */}
          <div className="relative w-full max-w-2xl mx-auto md:mx-0">
            <label htmlFor="hostel-search" className="sr-only">Search hostels...</label>
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            </div>
            <input
              id="hostel-search"
              type="text"
              className="block w-full pl-12 pr-12 py-4 bg-white border border-input rounded-full text-[1rem] sm:text-[1.05rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-heritage-gold)] focus:border-transparent transition-shadow shadow-sm"
              placeholder="Search hostels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
                aria-label="Clear search"
              >
                <div className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-heritage-gold)]">
                  <X className="h-4 w-4" aria-hidden="true" />
                </div>
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="flex flex-col space-y-4">
            <div className="flex flex-wrap gap-2.5 sm:gap-3">
              {CATEGORIES.map((category) => {
                const isActive = activeCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    aria-pressed={isActive}
                    className={cn(
                      "min-h-[44px] px-5 sm:px-6 py-2 filter-chip focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-heritage-gold)] focus-visible:ring-offset-2",
                      isActive && "filter-chip-active shadow-md"
                    )}
                  >
                    {category}
                  </button>
                );
              })}
            </div>

            {/* Results Live Region */}
            <div 
              className="text-[0.9rem] font-medium text-muted-foreground px-1 pt-2"
              aria-live="polite"
            >
              {resultText}
            </div>
          </div>
        </div>

        {/* Directory Grid */}
        {filteredHostels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 lg:gap-8">
            {filteredHostels.map((hostel, index) => (
              <div
                key={hostel.id}
                className="h-full rm-reveal"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <HostelDirectoryCard hostel={hostel} />
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center light-surface rounded-3xl max-w-3xl mx-auto rm-reveal shadow-sm">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
              <BookOpen className="w-8 h-8 text-muted-foreground" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3">No Hostels Found</h3>
            <p className="text-[1.05rem] text-muted-foreground mb-8 max-w-md">
              We could not find a hostel matching your search. Try another name or clear the selected filter.
            </p>
            <button
              onClick={handleClear}
              className="min-h-[44px] px-8 py-3 bg-[var(--color-heritage-gold)] text-black rounded-full text-[1rem] font-bold tracking-wide transition-all duration-300 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-heritage-gold)] focus-visible:ring-offset-2 hover:bg-[var(--color-heritage-gold)]/90 hover:-translate-y-0.5"
            >
              Clear Search and Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
