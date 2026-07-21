"use client";

import React from "react";
import { Search, X, SlidersHorizontal, LayoutGrid, CalendarDays } from "lucide-react";

export type MemorySortOption = "newest" | "oldest" | "a-z";
export type MemoryViewMode = "gallery" | "timeline";

export interface MemoryFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: string;
  onCategoryChange: (val: string) => void;
  availableCategories: string[];
  selectedCommunity: string;
  onCommunityChange: (val: string) => void;
  availableCommunities: string[];
  selectedYear: string;
  onYearChange: (val: string) => void;
  availableYears: string[];
  sortBy: MemorySortOption;
  onSortChange: (val: MemorySortOption) => void;
  viewMode: MemoryViewMode;
  onViewModeChange: (mode: MemoryViewMode) => void;
}

export const MemoryFilters = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  availableCategories,
  selectedCommunity,
  onCommunityChange,
  availableCommunities,
  selectedYear,
  onYearChange,
  availableYears,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: MemoryFiltersProps) => {
  return (
    <section aria-label="Search and Filter Controls" className="w-full space-y-6 mb-10">
      {/* Search Input, Sort Dropdown & View Mode Switcher */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-2xl">
          <label htmlFor="memory-search" className="sr-only">
            Search memories, communities, years, or stories...
          </label>
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none"
              aria-hidden="true"
            />
            <input
              id="memory-search"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search memories, communities, years, or stories..."
              className="w-full pl-12 pr-11 py-3.5 bg-black/5 border border-[var(--color-rm-glass-border)] rounded-xl text-foreground placeholder-muted-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-maroon)] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-black/50 hover:text-foreground rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Sort and View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sorting Control */}
          <div className="flex items-center gap-2 bg-black/5 border border-[var(--color-rm-glass-border)] rounded-xl px-3.5 py-2">
            <SlidersHorizontal className="w-4 h-4 text-[var(--color-maroon)]" aria-hidden="true" />
            <label htmlFor="memory-sort" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Sort:
            </label>
            <select
              id="memory-sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as MemorySortOption)}
              className="bg-transparent text-sm font-bold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="newest" className="bg-white text-foreground">
                Newest Memories
              </option>
              <option value="oldest" className="bg-white text-foreground">
                Oldest Memories
              </option>
              <option value="a-z" className="bg-white text-foreground">
                A to Z
              </option>
            </select>
          </div>

          {/* View Mode Switcher */}
          <div
            role="group"
            aria-label="View switch"
            className="flex items-center bg-black/5 border border-[var(--color-rm-glass-border)] rounded-xl p-1"
          >
            <button
              type="button"
              onClick={() => onViewModeChange("gallery")}
              aria-pressed={viewMode === "gallery"}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] ${
                viewMode === "gallery"
                  ? "bg-[var(--color-maroon)] text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" aria-hidden="true" />
              Gallery View
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("timeline")}
              aria-pressed={viewMode === "timeline"}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] ${
                viewMode === "timeline"
                  ? "bg-[var(--color-maroon)] text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
              Timeline View
            </button>
          </div>
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-maroon)] block">
          Category
        </span>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter by memory category">
          {availableCategories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                aria-pressed={isSelected}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] ${
                  isSelected
                    ? "bg-[var(--color-maroon)] text-white"
                    : "bg-black/5 text-black/75 hover:bg-black/10 hover:text-foreground border border-black/10"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Secondary Filters: Community and Year */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/10">
        {/* Community Filter */}
        {availableCommunities.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-black/60 mr-1">
              Community:
            </span>
            {availableCommunities.map((comm) => {
              const isSelected = selectedCommunity === comm;
              return (
                <button
                  key={comm}
                  type="button"
                  onClick={() => onCommunityChange(comm)}
                  aria-pressed={isSelected}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] ${
                    isSelected
                      ? "bg-[var(--color-maroon)] text-white border border-[var(--color-maroon)]/50"
                      : "bg-black/5 text-black/65 hover:bg-black/10 hover:text-foreground border border-transparent"
                  }`}
                >
                  {comm}
                </button>
              );
            })}
          </div>
        )}

        {/* Year Filter */}
        {availableYears.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-black/60 mr-1">
              Year:
            </span>
            {availableYears.map((yr) => {
              const isSelected = selectedYear === yr;
              return (
                <button
                  key={yr}
                  type="button"
                  onClick={() => onYearChange(yr)}
                  aria-pressed={isSelected}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-maroon)] ${
                    isSelected
                      ? "bg-[var(--color-maroon)] text-white border border-[var(--color-maroon)]/50"
                      : "bg-black/5 text-black/65 hover:bg-black/10 hover:text-foreground border border-transparent"
                  }`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
