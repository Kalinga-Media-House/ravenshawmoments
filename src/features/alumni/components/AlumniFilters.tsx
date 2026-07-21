"use client";

import React, { useEffect, useRef } from "react";
import { Search, X, Filter } from "lucide-react";
import { DIRECTORY_DEPARTMENTS } from "@/features/department/data/departments-directory";
import {
  AlumniDirectoryFilterState,
  AlumniSortOption,
  PublicAlumniProfile,
} from "../types/alumni";

interface AlumniFiltersProps {
  filterState: AlumniDirectoryFilterState;
  onFilterChange: (updates: Partial<AlumniDirectoryFilterState>) => void;
  onResetFilters: () => void;
  totalResults: number;
  allAlumni: PublicAlumniProfile[];
}

export const AlumniFilters: React.FC<AlumniFiltersProps> = ({
  filterState,
  onFilterChange,
  onResetFilters,
  totalResults,
  allAlumni,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract represented dynamic options
  const representedDepartments = DIRECTORY_DEPARTMENTS.filter((d) =>
    allAlumni.some(
      (a) => a.departmentSlug === d.slug || a.departmentName === d.name
    )
  );

  const representedBatches = Array.from(
    new Set(
      allAlumni
        .map((a) => a.batch)
        .filter((b): b is string => typeof b === "string" && b.trim().length > 0)
    )
  ).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

  const representedYears = Array.from(
    new Set(
      allAlumni
        .map((a) => a.graduationYear)
        .filter((y): y is string => typeof y === "string" && y.trim().length > 0)
    )
  ).sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

  const representedProfessions = Array.from(
    new Set(
      allAlumni
        .map((a) => a.currentProfession || a.industry)
        .filter((p): p is string => typeof p === "string" && p.trim().length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));

  const representedCountries = Array.from(
    new Set(
      allAlumni
        .map((a) => a.country)
        .filter((c): c is string => typeof c === "string" && c.trim().length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));

  const isFiltered =
    Boolean(filterState.query.trim()) ||
    filterState.departmentSlug !== "" ||
    filterState.batch !== "" ||
    filterState.graduationYear !== "" ||
    filterState.profession !== "" ||
    filterState.country !== "" ||
    filterState.sortBy !== "featured";

  useEffect(() => {
    // Fade upward animation
    if (containerRef.current) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.style.opacity = "1";
          containerRef.current.style.transform = "translateY(0)";
        }
      }, 50);
    }
  }, []);

  return (
    <section aria-label="Alumni Directory Search and Filters" className="px-4 sm:px-6 lg:px-8">
      <div 
        ref={containerRef}
        className="max-w-[1180px] mx-auto relative z-10"
        style={{
          marginTop: "-45px",
          opacity: 0,
          transform: "translateY(24px)",
          transition: "opacity 650ms ease-out, transform 650ms ease-out"
        }}
      >
        <div 
          className="rounded-[22px] overflow-hidden"
          style={{
            background: "rgba(255, 249, 244, 0.98)",
            border: "1px solid rgba(242, 185, 54, 0.35)",
            boxShadow: "0 20px 55px rgba(82, 0, 22, 0.15)",
            padding: "clamp(22px, 4vw, 32px)",
          }}
        >
          {/* Section Header inside Filter Panel */}
          <div className="mb-6">
            <h2 className="text-[#520016] font-[800] leading-tight text-[clamp(26px,4vw,36px)] mb-2">
              Alumni Directory
            </h2>
            <p className="text-[#4A4346] text-[15px] md:text-[16px] leading-relaxed max-w-2xl">
              Search across generations and reconnect with the Ravenshaw community.
            </p>
          </div>

          <div className="space-y-4">
            {/* Top Search Bar */}
            <div className="relative flex items-center">
              <label htmlFor="alumni-search-input" className="sr-only">
                Search alumni by name, department, batch, profession, or location
              </label>
              <Search
                className="absolute left-4 w-5 h-5 text-[#520016] pointer-events-none"
                aria-hidden="true"
              />
              <input
                id="alumni-search-input"
                type="text"
                value={filterState.query}
                onChange={(e) =>
                  onFilterChange({ query: e.target.value, page: 1 })
                }
                placeholder="Search alumni by name, department, batch, profession, or location..."
                className="w-full bg-white border border-[#D1CCC9] rounded-xl pl-12 pr-28 py-3 text-sm sm:text-base text-[#2E282A] placeholder-[#8A8184] focus:outline-none focus:border-[#520016] focus:ring-2 focus:ring-[#F2B936]/30 transition-all h-[48px]"
              />
              
              <div className="absolute right-2 flex items-center gap-2">
                {filterState.query.trim() !== "" && (
                  <button
                    type="button"
                    onClick={() => onFilterChange({ query: "", page: 1 })}
                    className="p-1.5 rounded-lg text-[#8A8184] hover:text-[#520016] hover:bg-[#F5F0EC] transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  className="bg-[#520016] text-white hidden sm:flex items-center justify-center h-[36px] px-4 rounded-lg font-bold text-sm transition-all hover:bg-[#68001C] hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(82,0,22,0.15)]"
                  aria-label="Submit search"
                >
                  <Search className="w-4 h-4 text-[#F2B936] mr-1.5" />
                  Search
                </button>
              </div>
            </div>

            {/* Filter Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Department Filter */}
              <div>
                <label
                  htmlFor="department-filter"
                  className="block text-[11px] font-bold uppercase tracking-wider text-[#520016]/80 mb-1.5"
                >
                  Department
                </label>
                <select
                  id="department-filter"
                  value={filterState.departmentSlug}
                  onChange={(e) =>
                    onFilterChange({ departmentSlug: e.target.value, page: 1 })
                  }
                  className="w-full bg-white border border-[#D1CCC9] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#520016] focus:outline-none focus:border-[#520016] focus:ring-2 focus:ring-[#F2B936]/30 transition-all h-[46px]"
                >
                  <option value="">All Departments</option>
                  {representedDepartments.map((dept) => (
                    <option key={dept.slug} value={dept.slug}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Batch Filter */}
              <div>
                <label
                  htmlFor="batch-filter"
                  className="block text-[11px] font-bold uppercase tracking-wider text-[#520016]/80 mb-1.5"
                >
                  Batch
                </label>
                <select
                  id="batch-filter"
                  value={filterState.batch}
                  onChange={(e) =>
                    onFilterChange({ batch: e.target.value, page: 1 })
                  }
                  className="w-full bg-white border border-[#D1CCC9] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#520016] focus:outline-none focus:border-[#520016] focus:ring-2 focus:ring-[#F2B936]/30 transition-all h-[46px]"
                >
                  <option value="">All Batches</option>
                  {representedBatches.map((batch) => (
                    <option key={batch} value={batch}>
                      {batch}
                    </option>
                  ))}
                </select>
              </div>

              {/* Graduation Year Filter */}
              {representedYears.length > 0 && (
                <div>
                  <label
                    htmlFor="graduation-year-filter"
                    className="block text-[11px] font-bold uppercase tracking-wider text-[#520016]/80 mb-1.5"
                  >
                    Graduation Year
                  </label>
                  <select
                    id="graduation-year-filter"
                    value={filterState.graduationYear}
                    onChange={(e) =>
                      onFilterChange({ graduationYear: e.target.value, page: 1 })
                    }
                    className="w-full bg-white border border-[#D1CCC9] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#520016] focus:outline-none focus:border-[#520016] focus:ring-2 focus:ring-[#F2B936]/30 transition-all h-[46px]"
                  >
                    <option value="">All Years</option>
                    {representedYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Profession / Industry Filter */}
              {representedProfessions.length > 0 && (
                <div>
                  <label
                    htmlFor="profession-filter"
                    className="block text-[11px] font-bold uppercase tracking-wider text-[#520016]/80 mb-1.5"
                  >
                    Profession
                  </label>
                  <select
                    id="profession-filter"
                    value={filterState.profession}
                    onChange={(e) =>
                      onFilterChange({ profession: e.target.value, page: 1 })
                    }
                    className="w-full bg-white border border-[#D1CCC9] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#520016] focus:outline-none focus:border-[#520016] focus:ring-2 focus:ring-[#F2B936]/30 transition-all h-[46px]"
                  >
                    <option value="">All Professions</option>
                    {representedProfessions.map((prof) => (
                      <option key={prof} value={prof}>
                        {prof}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Location Filter */}
              {representedCountries.length > 0 && (
                <div>
                  <label
                    htmlFor="location-filter"
                    className="block text-[11px] font-bold uppercase tracking-wider text-[#520016]/80 mb-1.5"
                  >
                    Location
                  </label>
                  <select
                    id="location-filter"
                    value={filterState.country}
                    onChange={(e) =>
                      onFilterChange({ country: e.target.value, page: 1 })
                    }
                    className="w-full bg-white border border-[#D1CCC9] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#520016] focus:outline-none focus:border-[#520016] focus:ring-2 focus:ring-[#F2B936]/30 transition-all h-[46px]"
                  >
                    <option value="">All Locations</option>
                    {representedCountries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sorting Control */}
              <div>
                <label
                  htmlFor="sorting-filter"
                  className="block text-[11px] font-bold uppercase tracking-wider text-[#520016]/80 mb-1.5"
                >
                  Sort By
                </label>
                <select
                  id="sorting-filter"
                  value={filterState.sortBy}
                  onChange={(e) =>
                    onFilterChange({
                      sortBy: e.target.value as AlumniSortOption,
                      page: 1,
                    })
                  }
                  className="w-full bg-white border border-[#D1CCC9] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#520016] focus:outline-none focus:border-[#520016] focus:ring-2 focus:ring-[#F2B936]/30 transition-all h-[46px]"
                >
                  <option value="featured">Featured First</option>
                  <option value="recently_added">Recently Added</option>
                  <option value="graduation_desc">Grad Year: Newest</option>
                  <option value="graduation_asc">Grad Year: Oldest</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dynamic Result Count and Reset Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5 px-1 pt-4 border-t border-[#D1CCC9]/40">
            <div aria-live="polite" aria-atomic="true">
              {totalResults === 0 ? (
                <p className="text-xs sm:text-sm font-bold text-[#520016]">
                  No matching alumni profiles found
                </p>
              ) : totalResults === 1 ? (
                <p className="text-xs sm:text-sm font-medium text-[#4A4346]">
                  Showing <span className="font-bold text-[#520016]">1</span> alumni profile
                </p>
              ) : (
                <p className="text-xs sm:text-sm font-medium text-[#4A4346]">
                  Showing <span className="font-bold text-[#520016]">{totalResults.toLocaleString()}</span> alumni profiles
                </p>
              )}
            </div>

            {isFiltered && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8E0028] hover:text-[#520016] transition-colors self-start sm:self-auto"
              >
                <Filter className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Clear Search and Filters</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
