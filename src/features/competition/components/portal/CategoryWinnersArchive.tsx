"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Filter, Archive, RotateCcw } from "lucide-react";

interface CategoryWinnersArchiveProps {
  currentYear?: number;
  currentMonth?: number;
  currentLevel?: string;
}

const ARCHIVE_YEARS = [2026, 2025, 2024];
const ARCHIVE_MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" }
];

const CANONICAL_LEVEL_OPTIONS = [
  { value: "", label: "All Levels" },
  { value: "department", label: "Department Level" },
  { value: "hostel", label: "Hostel Level" },
  { value: "university", label: "University Level" },
  { value: "inter_university", label: "Inter-University Level" },
  { value: "district", label: "District Level" },
  { value: "state", label: "State Level" },
  { value: "national", label: "National Level" }
];

export function CategoryWinnersArchive({
  currentYear,
  currentMonth,
  currentLevel
}: CategoryWinnersArchiveProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleFilterChange = (paramKey: string, paramValue: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (paramValue) {
      params.set(paramKey, paramValue);
    } else {
      params.delete(paramKey);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const resetFilters = () => {
    router.push(pathname, { scroll: false });
  };

  const hasActiveFilters = Boolean(
    searchParams.get("year") || searchParams.get("month") || searchParams.get("level")
  );

  return (
    <div className="rounded-2xl border border-[#8A1735]/40 bg-[#2B070E]/70 p-4 sm:p-6 text-[#FFF9F0] shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Archive className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="text-lg font-bold">Historical Winners Archive</h3>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 text-xs text-[#D4AF37] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Archive Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Year Select */}
        <div>
          <label htmlFor="archive-year" className="block text-xs font-semibold text-[#FFF9F0]/70 mb-1">
            Academic Year
          </label>
          <select
            id="archive-year"
            aria-label="Filter by year"
            value={currentYear ? String(currentYear) : ""}
            onChange={(e) => handleFilterChange("year", e.target.value)}
            className="w-full rounded-xl border border-[#8A1735]/60 bg-[#4A0E17]/80 px-3 py-2 text-sm text-[#FFF9F0] focus:border-[#D4AF37] focus:outline-none"
          >
            <option value="">Latest Period</option>
            {ARCHIVE_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Month Select */}
        <div>
          <label htmlFor="archive-month" className="block text-xs font-semibold text-[#FFF9F0]/70 mb-1">
            Month
          </label>
          <select
            id="archive-month"
            aria-label="Filter by month"
            value={currentMonth ? String(currentMonth) : ""}
            onChange={(e) => handleFilterChange("month", e.target.value)}
            className="w-full rounded-xl border border-[#8A1735]/60 bg-[#4A0E17]/80 px-3 py-2 text-sm text-[#FFF9F0] focus:border-[#D4AF37] focus:outline-none"
          >
            <option value="">All Months</option>
            {ARCHIVE_MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Level Select */}
        <div>
          <label htmlFor="archive-level" className="block text-xs font-semibold text-[#FFF9F0]/70 mb-1">
            Competition Level
          </label>
          <select
            id="archive-level"
            aria-label="Filter by competition level"
            value={currentLevel || ""}
            onChange={(e) => handleFilterChange("level", e.target.value)}
            className="w-full rounded-xl border border-[#8A1735]/60 bg-[#4A0E17]/80 px-3 py-2 text-sm text-[#FFF9F0] focus:border-[#D4AF37] focus:outline-none"
          >
            {CANONICAL_LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
