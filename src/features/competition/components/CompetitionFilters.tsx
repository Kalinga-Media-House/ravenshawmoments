"use client";

import React from "react";
import { Search, X, Filter, ArrowUpDown } from "lucide-react";
import { CompetitionCategory, CompetitionLevel } from "../types/competition";
import { COMPETITION_CATEGORY_GROUPS, ALL_COMPETITION_CATEGORIES } from "@/lib/competition-categories";

export type StatusFilterOption =
  | "All Competitions"
  | "Registration Open"
  | "Upcoming"
  | "Ongoing"
  | "Completed"
  | "Results Published";

export type ParticipationFilterOption =
  | "All Opportunities"
  | "Individual"
  | "Team"
  | "Ravenshaw Only"
  | "External Participants Allowed";

export type CompetitionSortOption =
  | "Registration Closing Soon"
  | "Upcoming First"
  | "Latest Added"
  | "Oldest First"
  | "A to Z";

export interface CompetitionFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilterOption;
  onStatusChange: (status: StatusFilterOption) => void;
  availableStatuses: StatusFilterOption[];
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  availableCategories: CompetitionCategory[];
  participationFilter: ParticipationFilterOption;
  onParticipationChange: (participation: ParticipationFilterOption) => void;
  availableParticipationOptions: ParticipationFilterOption[];
  levelFilter: string;
  onLevelChange: (level: string) => void;
  availableLevels: CompetitionLevel[];
  sortOption: CompetitionSortOption;
  onSortChange: (sort: CompetitionSortOption) => void;
  totalCount: number;
}

export const CompetitionFilters: React.FC<CompetitionFiltersProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  availableStatuses,
  categoryFilter,
  onCategoryChange,
  availableCategories,
  participationFilter,
  onParticipationChange,
  availableParticipationOptions,
  levelFilter,
  onLevelChange,
  availableLevels,
  sortOption,
  onSortChange,
  totalCount,
}) => {
  const getResultCountText = () => {
    if (totalCount === 0) return "No matching competitions";
    if (totalCount === 1) return "Showing 1 competition";
    return `Showing ${totalCount} competitions`;
  };

  return (
    <section aria-label="Competition Search and Filters" className="w-full space-y-6">
      {/* Search Input Bar */}
      <div 
        className="rounded-2xl p-3 sm:p-4 transition-all duration-300"
        style={{
          background: 'linear-gradient(135deg, #3A0010 0%, #58071D 100%)',
          border: '1px solid rgba(228, 181, 54, 0.30)',
          boxShadow: '0 8px 25px rgba(61, 0, 18, 0.14)'
        }}
      >
        <div className="relative">
          <label htmlFor="competitions-search" className="sr-only">
            Search competitions, categories, organizers, or opportunities
          </label>
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
            style={{ color: '#E4B536' }}
            aria-hidden="true"
          />
          <input
            id="competitions-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search competitions, categories, organizers, or opportunities..."
            className="w-full pl-12 pr-12 py-3.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 outline-none"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#FFFFFF',
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(228, 181, 54, 0.80)';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(228, 181, 54, 0.13)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.11)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
          />
          {/* Inject placeholder styling to target the specific input */}
          <style dangerouslySetInnerHTML={{
            __html: `
              #competitions-search::placeholder {
                color: rgba(255, 255, 255, 0.58);
              }
            `
          }} />
          
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search query"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#E4B536]"
              style={{ color: 'rgba(255, 255, 255, 0.58)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#FFFFFF'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.58)'}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Status Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="w-4 h-4 text-[#E4B536]" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-wider mr-1" style={{ color: '#4A343B' }}>
            Status:
          </span>
        </div>
        {availableStatuses.map((status) => {
          const isActive = statusFilter === status;
          return (
            <button
              key={status}
              type="button"
              aria-pressed={isActive}
              onClick={() => onStatusChange(status)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#E4B536]"
              style={isActive ? {
                background: 'linear-gradient(135deg, #500619, #760D2C)',
                borderColor: '#760D2C',
                borderWidth: '1px',
                borderStyle: 'solid',
                color: '#FFFFFF',
              } : {
                background: '#FFFFFF',
                border: '1px solid rgba(111, 8, 40, 0.25)',
                color: '#5A122A',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#F9EEF2';
                  e.currentTarget.style.borderColor = '#7A1233';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = '#FFFFFF';
                  e.currentTarget.style.borderColor = 'rgba(111, 8, 40, 0.25)';
                }
              }}
            >
              {status}
            </button>
          );
        })}
      </div>

      {/* Category, Participation, Level, and Sort Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Category Dropdown */}
        <div>
          <label
            htmlFor="category-filter"
            className="block text-[11px] font-bold text-[var(--color-rm-maroon)]/80 uppercase tracking-wider mb-1"
          >
            Category
          </label>
          <select
            id="category-filter"
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-[var(--color-rm-gold)]/30 text-[var(--color-rm-maroon)] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)] max-h-[400px] overflow-y-auto"
          >
            <option value="All Categories">All Categories</option>
            {COMPETITION_CATEGORY_GROUPS.map((group) => (
              <optgroup key={group.group} label={group.group} className="font-bold text-[var(--color-rm-maroon)] bg-[#FFF9EF]">
                {group.categories.map((cat) => (
                  <option key={cat} value={cat} className="font-medium text-[var(--color-rm-maroon)]">
                    {cat}
                  </option>
                ))}
              </optgroup>
            ))}
            {/* Backward compatibility for existing categories not in the master list */}
            {availableCategories.filter((cat) => !ALL_COMPETITION_CATEGORIES.includes(cat)).length > 0 && (
              <optgroup label="OTHER" className="font-bold text-[var(--color-rm-maroon)] bg-[#FFF9EF]">
                {availableCategories
                  .filter((cat) => !ALL_COMPETITION_CATEGORIES.includes(cat))
                  .map((cat) => (
                    <option key={cat} value={cat} className="font-medium text-[var(--color-rm-maroon)]">
                      {cat}
                    </option>
                  ))}
              </optgroup>
            )}
          </select>
        </div>

        {/* Participation Dropdown */}
        <div>
          <label
            htmlFor="participation-filter"
            className="block text-[11px] font-bold text-[var(--color-rm-maroon)]/80 uppercase tracking-wider mb-1"
          >
            Participation Opportunity
          </label>
          <select
            id="participation-filter"
            value={participationFilter}
            onChange={(e) => onParticipationChange(e.target.value as ParticipationFilterOption)}
            className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-[var(--color-rm-gold)]/30 text-[var(--color-rm-maroon)] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)]"
          >
            {availableParticipationOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Level Dropdown */}
        <div>
          <label
            htmlFor="level-filter"
            className="block text-[11px] font-bold text-[var(--color-rm-maroon)]/80 uppercase tracking-wider mb-1"
          >
            Competition Level
          </label>
          <select
            id="level-filter"
            value={levelFilter}
            onChange={(e) => onLevelChange(e.target.value)}
            className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-[var(--color-rm-gold)]/30 text-[var(--color-rm-maroon)] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)]"
          >
            <option value="All Levels">All Levels</option>
            {availableLevels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div>
          <label
            htmlFor="sort-select"
            className="block text-[11px] font-bold text-[var(--color-rm-maroon)]/80 uppercase tracking-wider mb-1 flex items-center gap-1.5"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[var(--color-rm-gold)]" aria-hidden="true" />
            <span>Sort By</span>
          </label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as CompetitionSortOption)}
            className="w-full min-h-[42px] px-3.5 py-2 rounded-xl bg-white border border-[var(--color-rm-gold)]/30 text-[var(--color-rm-maroon)] text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[var(--color-rm-gold)]"
          >
            <option value="Registration Closing Soon">Registration Closing Soon</option>
            <option value="Upcoming First">Upcoming First</option>
            <option value="Latest Added">Latest Added</option>
            <option value="Oldest First">Oldest First</option>
            <option value="A to Z">A to Z</option>
          </select>
        </div>
      </div>

      {/* Dynamic Result Count */}
      <div className="flex items-center justify-between gap-4 pt-1 border-t border-white/10">
        <p
          aria-live="polite"
          className="text-xs sm:text-sm font-bold text-[var(--color-rm-gold)]"
        >
          {getResultCountText()}
        </p>
      </div>
    </section>
  );
};
