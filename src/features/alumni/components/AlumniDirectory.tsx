"use client";

import React, { useState, useMemo } from "react";
import {
  PublicAlumniProfile,
  AlumniDirectoryFilterState,
} from "../types/alumni";
import { AlumniHero } from "./AlumniHero";
import { AlumniStatistics } from "./AlumniStatistics";
import { FeaturedAlumni } from "./FeaturedAlumni";
import { AlumniFilters } from "./AlumniFilters";
import { AlumniDirectoryGrid } from "./AlumniDirectoryGrid";
import { AlumniEmptyState } from "./AlumniEmptyState";
import { AlumniEditorial } from "./AlumniEditorial";
import { AlumniDirectoryCTA } from "./AlumniDirectoryCTA";
import { AlumniPrivacyNotice } from "./AlumniPrivacyNotice";

interface AlumniDirectoryProps {
  initialAlumni: PublicAlumniProfile[];
}

export const AlumniDirectory: React.FC<AlumniDirectoryProps> = ({
  initialAlumni,
}) => {
  const [filterState, setFilterState] = useState<AlumniDirectoryFilterState>({
    query: "",
    departmentSlug: "",
    batch: "",
    graduationYear: "",
    profession: "",
    country: "",
    sortBy: "featured",
    page: 1,
  });

  const handleFilterChange = (
    updates: Partial<AlumniDirectoryFilterState>
  ) => {
    setFilterState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleResetFilters = () => {
    setFilterState({
      query: "",
      departmentSlug: "",
      batch: "",
      graduationYear: "",
      profession: "",
      country: "",
      sortBy: "featured",
      page: 1,
    });
  };

  const filteredAndSortedAlumni = useMemo(() => {
    const cleanQuery = filterState.query.trim().toLowerCase();

    // 1. Filter
    const filtered = initialAlumni.filter((alumnus) => {
      // Search matching
      if (cleanQuery) {
        const searchCorpus = [
          alumnus.fullName,
          alumnus.publicDisplayName,
          alumnus.departmentName,
          alumnus.programme,
          alumnus.academicLevel,
          alumnus.batch,
          alumnus.graduationYear,
          alumnus.currentProfession,
          alumnus.currentRole,
          alumnus.currentOrganization,
          alumnus.industry,
          alumnus.city,
          alumnus.state,
          alumnus.country,
          alumnus.shortBio,
          ...(alumnus.publicAchievements?.map((ach) => ach.title) || []),
          ...(alumnus.searchKeywords || []),
        ]
          .filter((val): val is string => Boolean(val))
          .join(" ")
          .toLowerCase();

        if (!searchCorpus.includes(cleanQuery)) {
          return false;
        }
      }

      // Department filter
      if (filterState.departmentSlug) {
        if (
          alumnus.departmentSlug !== filterState.departmentSlug &&
          alumnus.departmentName?.toLowerCase() !==
            filterState.departmentSlug.toLowerCase()
        ) {
          return false;
        }
      }

      // Batch filter
      if (filterState.batch) {
        if (alumnus.batch !== filterState.batch) {
          return false;
        }
      }

      // Graduation year filter
      if (filterState.graduationYear) {
        if (alumnus.graduationYear !== filterState.graduationYear) {
          return false;
        }
      }

      // Profession filter
      if (filterState.profession) {
        const profMatch =
          alumnus.currentProfession === filterState.profession ||
          alumnus.industry === filterState.profession;
        if (!profMatch) {
          return false;
        }
      }

      // Location / country filter
      if (filterState.country) {
        if (alumnus.country !== filterState.country) {
          return false;
        }
      }

      return true;
    });

    // 2. Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (filterState.sortBy) {
        case "featured": {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.fullName.localeCompare(b.fullName);
        }
        case "recently_added": {
          return b.id.localeCompare(a.id);
        }
        case "graduation_desc": {
          const yearA = parseInt(a.graduationYear || "0", 10);
          const yearB = parseInt(b.graduationYear || "0", 10);
          if (yearA !== yearB) return yearB - yearA;
          return a.fullName.localeCompare(b.fullName);
        }
        case "graduation_asc": {
          const yearA = parseInt(a.graduationYear || "9999", 10);
          const yearB = parseInt(b.graduationYear || "9999", 10);
          if (yearA !== yearB) return yearA - yearB;
          return a.fullName.localeCompare(b.fullName);
        }
        case "name_asc": {
          return a.fullName.localeCompare(b.fullName);
        }
        case "name_desc": {
          return b.fullName.localeCompare(a.fullName);
        }
        default:
          return a.fullName.localeCompare(b.fullName);
      }
    });

    return sorted;
  }, [initialAlumni, filterState]);

  const isFiltered =
    Boolean(filterState.query.trim()) ||
    filterState.departmentSlug !== "" ||
    filterState.batch !== "" ||
    filterState.graduationYear !== "" ||
    filterState.profession !== "" ||
    filterState.country !== "" ||
    filterState.sortBy !== "featured";

  return (
    <div className="min-h-screen bg-[#FFF9F4]">
      {/* Page Hero */}
      <AlumniHero />

      {/* Statistics Section */}
      <AlumniStatistics alumni={initialAlumni} />

      {/* Featured Alumni Section */}
      <FeaturedAlumni alumni={initialAlumni} />

      {/* Main Directory Experience */}
      {initialAlumni.length === 0 ? (
        <AlumniEmptyState />
      ) : (
        <>
          <AlumniFilters
            filterState={filterState}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            totalResults={filteredAndSortedAlumni.length}
            allAlumni={initialAlumni}
          />

          <AlumniDirectoryGrid
            alumni={filteredAndSortedAlumni}
            currentPage={filterState.page}
            onPageChange={(page) => handleFilterChange({ page })}
            onResetFilters={handleResetFilters}
            isFiltered={isFiltered}
          />
        </>
      )}

      {/* Editorial Section */}
      <AlumniEditorial />

      {/* Join CTA */}
      <AlumniDirectoryCTA />

      {/* Privacy Notice */}
      <AlumniPrivacyNotice />
    </div>
  );
};
