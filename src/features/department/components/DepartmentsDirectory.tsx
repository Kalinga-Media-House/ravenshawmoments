"use client";

import React, { useState, useMemo, useTransition } from "react";
import { Search, X, BookOpen, ArrowUpDown, Filter, Loader2 } from "lucide-react";
import { DIRECTORY_DEPARTMENTS } from "../data/departments-directory";
import { DepartmentDirectoryCard } from "./DepartmentDirectoryCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const FILTER_OPTIONS = [
  "All",
  "Science",
  "Arts",
  "Commerce",
  "Professional",
  "Language"
] as const;

type FilterOption = typeof FILTER_OPTIONS[number];
type SortOption = "A-Z" | "Newest" | "Most Active";

export const DepartmentsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
  const [sortOrder, setSortOrder] = useState<SortOption>("A-Z");
  const [isPending, startTransition] = useTransition();
  const revealRef = useScrollReveal();

  const filteredDepartments = useMemo(() => {
    const result = DIRECTORY_DEPARTMENTS.filter(dept => {
      // Filter Match
      let matchesCategory = false;
      if (activeFilter === "All") {
        matchesCategory = true;
      } else if (activeFilter === "Science") {
        matchesCategory = dept.category === "Science" || ["botany", "chemistry", "physics", "mathematics", "statistics", "geology", "geography", "computer-science", "zoology"].includes(dept.slug);
      } else if (activeFilter === "Arts") {
        matchesCategory = dept.category === "Arts" || ["english", "odia", "hindi", "sanskrit", "history", "philosophy", "education"].includes(dept.slug);
      } else if (activeFilter === "Commerce") {
        matchesCategory = dept.category === "Commerce" || ["commerce", "business-administration", "information-technology-management"].includes(dept.slug);
      } else if (activeFilter === "Professional") {
        matchesCategory = ["business-administration", "computer-application", "information-technology-management", "journalism-mass-communication", "education"].includes(dept.slug) || dept.category === "Management" || dept.category === "Computer Science";
      } else if (activeFilter === "Language") {
        matchesCategory = ["english", "odia", "hindi", "sanskrit"].includes(dept.slug);
      }
      
      // Search Match
      const cleanQuery = searchQuery.trim().toLowerCase();
      const matchesSearch = !cleanQuery || [
        dept.name,
        dept.shortName,
        dept.category,
        dept.description,
        ...dept.searchKeywords
      ].filter(Boolean).join(" ").toLowerCase().includes(cleanQuery);

      return matchesCategory && matchesSearch;
    });

    // Sorting
    if (sortOrder === "A-Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "Newest") {
      result.sort((a, b) => (b.establishedYear || 1900) - (a.establishedYear || 1900));
    } else if (sortOrder === "Most Active") {
      result.sort((a, b) => ((b.studentCount || 350) + (b.memoriesCount || 100) * 3) - ((a.studentCount || 350) + (a.memoriesCount || 100) * 3));
    }

    return result;
  }, [searchQuery, activeFilter, sortOrder]);

  const handleSearchChange = (val: string) => {
    startTransition(() => {
      setSearchQuery(val);
    });
  };

  const handleFilterChange = (filter: FilterOption) => {
    startTransition(() => {
      setActiveFilter(filter);
    });
  };

  const handleSortChange = (sort: SortOption) => {
    startTransition(() => {
      setSortOrder(sort);
    });
  };

  const handleClear = () => {
    startTransition(() => {
      setSearchQuery("");
      setActiveFilter("All");
      setSortOrder("A-Z");
    });
  };

  const resultText = useMemo(() => {
    const count = filteredDepartments.length;
    const countStr = count === 1 ? "1 department" : `${count} departments`;
    
    if (searchQuery.trim()) {
      return `${countStr} found for "${searchQuery.trim()}"`;
    }
    if (activeFilter !== "All") {
      return `Showing ${count} ${activeFilter} departments`;
    }
    return `Showing all ${count} academic departments`;
  }, [filteredDepartments.length, searchQuery, activeFilter]);

  return (
    <section 
      className="w-full py-8 sm:py-12 md:py-16 lg:py-20 bg-[#FFFDF8] text-[#2D1F1F]" 
      ref={revealRef as React.RefObject<HTMLDivElement>}
    >
      <div className="container mx-auto px-3 sm:px-[clamp(1.5rem,4vw,3rem)] max-w-[1400px]">
        
        {/* Mobile-Optimized Search & Filter Container */}
        <div className="sticky top-16 md:top-20 z-30 mb-7 sm:mb-12 lg:mb-16 rounded-[18px] sm:rounded-[24px] bg-white/85 backdrop-blur-2xl border border-[#D4AF37]/30 p-3.5 sm:p-5 md:p-6 shadow-[0_6px_24px_rgba(91,0,27,0.045)] transition-all rm-reveal">
          
          {/* Top Row: 42-44px Mobile Search Bar & Sort Control */}
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 mb-3.5 sm:mb-5">
            {/* White Glass Input */}
            <div className="relative flex-grow md:max-w-xl">
              <label htmlFor="department-search" className="sr-only">Search Departments...</label>
              <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4.5 flex items-center pointer-events-none">
                {isPending ? (
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-[#5B001B] animate-spin" aria-hidden="true" />
                ) : (
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-[#5B001B]" aria-hidden="true" />
                )}
              </div>
              <input
                id="department-search"
                type="text"
                className="block w-full pl-9.5 sm:pl-12 pr-9 sm:pr-12 py-2 sm:py-3.5 h-[42px] sm:h-auto bg-white border border-[#EADED2] rounded-[18px] sm:rounded-full text-[13px] sm:text-base text-[#2D1F1F] placeholder:text-[13px] sm:placeholder:text-[#7C6B67] focus:outline-none focus:ring-2 focus:ring-[#5B001B] focus:border-transparent transition-all shadow-inner"
                placeholder="Search Departments..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                  aria-label="Clear search"
                >
                  <div className="p-1 rounded-full hover:bg-[#F8F3EB] text-[#7C6B67] hover:text-[#5B001B] transition-colors">
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                  </div>
                </button>
              )}
            </div>

            {/* Compact Sort Dropdown (115px on mobile) */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
              <span className="text-[11px] sm:text-sm font-semibold text-[#7C6B67] hidden sm:flex items-center gap-1.5">
                <ArrowUpDown className="w-4 h-4 text-[#5B001B]" />
                Sort:
              </span>
              <select
                value={sortOrder}
                onChange={(e) => handleSortChange(e.target.value as SortOption)}
                disabled={isPending}
                className="bg-white border border-[#EADED2] text-[#2D1F1F] text-[13px] sm:text-sm font-semibold rounded-[18px] sm:rounded-full h-[42px] sm:h-auto px-3 sm:px-4 py-2 sm:py-2.5 w-[112px] sm:w-auto focus:outline-none focus:ring-2 focus:ring-[#5B001B] shadow-sm cursor-pointer hover:border-[#D4AF37] transition-colors disabled:opacity-60"
                aria-label="Sort departments"
              >
                <option value="A-Z">A-Z</option>
                <option value="Newest">Newest</option>
                <option value="Most Active">Active</option>
              </select>
            </div>
          </div>

          {/* Filters & Results Row (Compact 30-32px Chips) */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-2.5 sm:pt-4 border-t border-[#EADED2]/70 gap-2 sm:gap-3">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#5B001B] mr-0.5 sm:mr-1 flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                Filter:
              </span>
              {FILTER_OPTIONS.map((filter) => {
                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    disabled={isPending}
                    aria-pressed={isActive}
                    className={cn(
                      "h-[30px] sm:h-auto px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-[13px] font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5B001B] flex items-center justify-center disabled:opacity-70",
                      isActive 
                        ? "bg-[#5B001B] text-white border border-[#D4AF37]/60 shadow-sm font-bold scale-[1.03]" 
                        : "bg-white/95 text-[#2D1F1F] border border-[#EADED2] hover:bg-[#F8F3EB] hover:border-[#D4AF37]"
                    )}
                  >
                    {filter}
                  </button>
                );
              })}
            </div>

            <div className="text-[11px] sm:text-xs font-semibold text-[#7C6B67] self-end sm:self-center shrink-0 pt-0.5 sm:pt-0 flex items-center gap-1.5" aria-live="polite">
              {isPending && <Loader2 className="w-3 h-3 animate-spin text-[#5B001B]" />}
              {resultText}
            </div>
          </div>
        </div>

        {/* Department Grid: 3 columns on Mobile (<480px), 4 on Tablet, 5 on Desktop & Laptop */}
        <div 
          className={cn(
            "transition-all duration-300 ease-out",
            isPending ? "opacity-45 scale-[0.99] pointer-events-none" : "opacity-100 scale-100"
          )}
        >
          {filteredDepartments.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-5 lg:gap-6">
              {filteredDepartments.map((dept, index) => (
                <div
                  key={dept.id}
                  className="h-full animate-in fade-in-0 slide-in-from-bottom-5 zoom-in-[0.96] duration-500 fill-mode-both"
                  style={{ animationDelay: `${Math.min(index * 45, 450)}ms` }}
                >
                  <DepartmentDirectoryCard department={dept} />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-center bg-white rounded-[24px] max-w-2xl mx-auto rm-reveal shadow-lg border border-[#EADED2]">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#F8F3EB] border border-[#D4AF37]/40 flex items-center justify-center mb-5 sm:mb-6 text-[#5B001B]">
                <BookOpen className="w-7 h-7 sm:w-8 sm:h-8" aria-hidden="true" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#2D1F1F] mb-2 sm:mb-3">No Departments Found</h3>
              <p className="text-xs sm:text-base text-[#7C6B67] mb-6 sm:mb-8 max-w-md leading-relaxed">
                We couldn&apos;t find any departments matching &quot;{searchQuery}&quot; under the &quot;{activeFilter}&quot; filter.
              </p>
              <button
                onClick={handleClear}
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-[#5B001B] text-white rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 shadow-md hover:bg-[#720022] hover:scale-105"
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
