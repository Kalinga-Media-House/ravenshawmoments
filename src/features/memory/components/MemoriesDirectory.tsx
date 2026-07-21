"use client";

import React, { useState, useMemo, useRef } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { MemoryItem } from "../types/memory";
import { MemoryCard } from "./MemoryCard";
import { FeaturedMemories } from "./FeaturedMemories";
import { MemoryStatistics } from "./MemoryStatistics";
import {
  MemoryFilters,
  MemorySortOption,
  MemoryViewMode,
} from "./MemoryFilters";
import { MemoryTimeline } from "./MemoryTimeline";
import { MemoriesEmptyState } from "./MemoriesEmptyState";
import { MemoryContributionCTA } from "./MemoryContributionCTA";

export interface MemoriesDirectoryProps {
  initialMemories: MemoryItem[];
}

const ITEMS_PER_PAGE = 12;

export const MemoriesDirectory = ({
  initialMemories,
}: MemoriesDirectoryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Memories");
  const [selectedCommunity, setSelectedCommunity] = useState("All Communities");
  const [selectedYear, setSelectedYear] = useState("All Years");
  const [sortBy, setSortBy] = useState<MemorySortOption>("newest");
  const [viewMode, setViewMode] = useState<MemoryViewMode>("gallery");
  const [currentPage, setCurrentPage] = useState(1);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Filter only approved & public memories
  const approvedMemories = useMemo(() => {
    return initialMemories.filter(
      (item) => item.approved !== false && item.publicVisibility !== false
    );
  }, [initialMemories]);

  // Dynamically extract available filter options
  const availableCategories = useMemo(() => {
    const cats = new Set<string>();
    approvedMemories.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return ["All Memories", ...Array.from(cats).sort()];
  }, [approvedMemories]);

  const availableCommunities = useMemo(() => {
    const comms = new Set<string>();
    approvedMemories.forEach((item) => {
      if (item.communityType) comms.add(item.communityType);
    });
    return ["All Communities", ...Array.from(comms).sort()];
  }, [approvedMemories]);

  const availableYears = useMemo(() => {
    const yrs = new Set<string>();
    approvedMemories.forEach((item) => {
      if (item.memoryYear) yrs.add(item.memoryYear);
    });
    const sortedYrs = Array.from(yrs).sort((a, b) => Number(b) - Number(a));
    return ["All Years", ...sortedYrs];
  }, [approvedMemories]);

  // Apply search, category, community, year filters & sort
  const filteredMemories = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();

    const filtered = approvedMemories.filter((item) => {
      // Search across approved fields
      if (trimmedQuery) {
        const matchesTitle = item.title.toLowerCase().includes(trimmedQuery);
        const matchesShort = item.shortDescription
          .toLowerCase()
          .includes(trimmedQuery);
        const matchesStory =
          item.fullStory?.toLowerCase().includes(trimmedQuery) || false;
        const matchesCategory = item.category
          .toLowerCase()
          .includes(trimmedQuery);
        const matchesYear =
          item.memoryYear?.toLowerCase().includes(trimmedQuery) || false;
        const matchesLocation =
          item.location?.toLowerCase().includes(trimmedQuery) || false;
        const matchesDepartment =
          item.departmentName?.toLowerCase().includes(trimmedQuery) || false;
        const matchesHostel =
          item.hostelName?.toLowerCase().includes(trimmedQuery) || false;
        const matchesOrg =
          item.organizationName?.toLowerCase().includes(trimmedQuery) || false;
        const matchesEvent =
          item.eventName?.toLowerCase().includes(trimmedQuery) || false;
        const matchesAchievement =
          item.achievementName?.toLowerCase().includes(trimmedQuery) || false;
        const matchesTags =
          item.tags?.some((t) => t.toLowerCase().includes(trimmedQuery)) ||
          false;
        const matchesKeywords =
          item.searchKeywords?.some((k) =>
            k.toLowerCase().includes(trimmedQuery)
          ) || false;

        if (
          !matchesTitle &&
          !matchesShort &&
          !matchesStory &&
          !matchesCategory &&
          !matchesYear &&
          !matchesLocation &&
          !matchesDepartment &&
          !matchesHostel &&
          !matchesOrg &&
          !matchesEvent &&
          !matchesAchievement &&
          !matchesTags &&
          !matchesKeywords
        ) {
          return false;
        }
      }

      // Category filter
      if (
        selectedCategory !== "All Memories" &&
        item.category !== selectedCategory
      ) {
        return false;
      }

      // Community filter
      if (
        selectedCommunity !== "All Communities" &&
        item.communityType !== selectedCommunity
      ) {
        return false;
      }

      // Year filter
      if (selectedYear !== "All Years" && item.memoryYear !== selectedYear) {
        return false;
      }

      return true;
    });

    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === "a-z") {
        return a.title.localeCompare(b.title);
      }
      const yearA = Number(a.memoryYear) || 0;
      const yearB = Number(b.memoryYear) || 0;
      if (sortBy === "newest") {
        return yearB - yearA;
      }
      return yearA - yearB;
    });
  }, [
    approvedMemories,
    searchQuery,
    selectedCategory,
    selectedCommunity,
    selectedYear,
    sortBy,
  ]);

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    setCurrentPage(1);
  };

  const handleCommunityChange = (val: string) => {
    setSelectedCommunity(val);
    setCurrentPage(1);
  };

  const handleYearChange = (val: string) => {
    setSelectedYear(val);
    setCurrentPage(1);
  };

  const handleSortChange = (val: MemorySortOption) => {
    setSortBy(val);
    setCurrentPage(1);
  };

  const handleViewModeChange = (val: MemoryViewMode) => {
    setViewMode(val);
    setCurrentPage(1);
  };

  const totalResults = filteredMemories.length;
  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  const paginatedMemories = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredMemories.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredMemories, currentPage]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Memories");
    setSelectedCommunity("All Communities");
    setSelectedYear("All Years");
    setSortBy("newest");
    setViewMode("gallery");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Memories Hero */}
      <section className="relative w-full pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden border-b border-black/10">
        {/* Subtle Heritage Background Details */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-rm-maroon)]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[var(--color-rm-gold)]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px] relative z-10">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-black/60">
              <li>
                <Link
                  href="/"
                  className="hover:text-[var(--color-maroon)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] rounded"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true" className="text-black/40">
                /
              </li>
              <li className="text-[var(--color-maroon)] font-bold" aria-current="page">
                Memories
              </li>
            </ol>
          </nav>

          {/* Hero Header */}
          <div className="max-w-3xl">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-maroon)] block mb-3">
              PRESERVING OUR JOURNEY
            </span>

            <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] font-extrabold rm-heading-primary leading-[1.08] mb-6">
              Where Every Memory Lives On
            </h1>

            <p className="text-base sm:text-lg md:text-xl rm-text-body text-black/80 font-medium leading-relaxed mb-4">
              From friendships and celebrations to quiet campus moments, achievements, farewells, and new beginnings, every memory carries a piece of Ravenshaw that deserves to be remembered.
            </p>

            <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--color-maroon)]">
              Created by Ravenshawvians, preserved for generations.
            </p>
          </div>
        </div>
      </section>

      {/* Main Directory Body */}
      <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px] py-12 md:py-16">
        {/* Dynamic Memory Statistics */}
        <MemoryStatistics memories={approvedMemories} />

        {/* Featured Memories Editorial Layout */}
        <FeaturedMemories memories={approvedMemories} />

        {/* Anchor point for search/filters/results */}
        <div ref={resultsRef} className="scroll-mt-28">
          <MemoryFilters
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
            availableCategories={availableCategories}
            selectedCommunity={selectedCommunity}
            onCommunityChange={handleCommunityChange}
            availableCommunities={availableCommunities}
            selectedYear={selectedYear}
            onYearChange={handleYearChange}
            availableYears={availableYears}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            viewMode={viewMode}
            onViewModeChange={handleViewModeChange}
          />

          {/* Dynamic Result Count Bar */}
          <div
            aria-live="polite"
            className="flex items-center justify-between pb-6 mb-8 border-b border-black/10"
          >
            <p className="text-sm sm:text-base font-bold text-black/85">
              {totalResults === 0 && "No matching memories"}
              {totalResults === 1 && "Showing 1 memory"}
              {totalResults > 1 && `Showing ${totalResults} memories`}
            </p>

            {(searchQuery ||
              selectedCategory !== "All Memories" ||
              selectedCommunity !== "All Communities" ||
              selectedYear !== "All Years") && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-[var(--color-maroon)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] rounded"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Memory Results Layout */}
          {totalResults === 0 ? (
            <MemoriesEmptyState onReset={handleResetFilters} />
          ) : viewMode === "timeline" ? (
            <MemoryTimeline memories={filteredMemories} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {paginatedMemories.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} />
              ))}
            </div>
          )}

          {/* Client-side Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Pagination"
              className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-black/10"
            >
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/5 border border-[var(--color-rm-glass-border)] text-black/80 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                    className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold transition-all ${
                      currentPage === pageNum
                        ? "bg-[var(--color-rm-gold)] text-[#12070B]"
                        : "bg-black/5 border border-[var(--color-rm-glass-border)] text-black/80 hover:text-foreground"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}

              <button
                type="button"
                onClick={() =>
                  handlePageChange(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                aria-label="Next page"
                className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black/5 border border-[var(--color-rm-glass-border)] text-black/80 hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </nav>
          )}
        </div>

        {/* Contribution Call to Action */}
        <MemoryContributionCTA />
      </div>
    </div>
  );
};
