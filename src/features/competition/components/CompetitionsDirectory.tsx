"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { computeCompetitionStatus } from "../utils/competitionStatus";
import { CompetitionItem } from "../types/competition";
import { CompetitionStatistics } from "./CompetitionStatistics";
import { FeaturedCompetition } from "./FeaturedCompetition";
import { CompetitionCategories } from "./CompetitionCategories";
import { UpcomingCompetitions } from "./UpcomingCompetitions";
import { CompetitionHallOfFame } from "./CompetitionHallOfFame";
import { CompetitionLeaderboard } from "./CompetitionLeaderboard";
import { CompetitionCTACards } from "./CompetitionCTACards";
import { CompetitionDirectoryCategory } from "../types/categoryPortal";
import {
  CompetitionFilters,
  StatusFilterOption,
  ParticipationFilterOption,
  CompetitionSortOption,
} from "./CompetitionFilters";
import { CompetitionCard } from "./CompetitionCard";
import { CompetitionsEmptyState } from "./CompetitionsEmptyState";
import { LeaderboardEntry, ChampionSpotlightEntry, WinnerGalleryEntry } from "../types/results";

const ITEMS_PER_PAGE = 9;

export interface CompetitionsDirectoryProps {
  competitions: CompetitionItem[];
  categories: CompetitionDirectoryCategory[];
  leaderboard?: LeaderboardEntry[];
  champion?: ChampionSpotlightEntry | null;
  winners?: WinnerGalleryEntry[];
}

export const CompetitionsDirectory: React.FC<CompetitionsDirectoryProps> = ({
  competitions,
  categories,
  leaderboard = [],
  champion = null,
  winners = [],
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>("All Competitions");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [participationFilter, setParticipationFilter] =
    useState<ParticipationFilterOption>("All Opportunities");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [sortOption, setSortOption] =
    useState<CompetitionSortOption>("Registration Closing Soon");
  const [currentPage, setCurrentPage] = useState(1);

  // Derive unique categories, statuses, levels, and participation options available in data
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(competitions.map((c) => c.category)));
    return cats;
  }, [competitions]);

  const availableStatuses = useMemo(() => {
    const statuses = new Set<StatusFilterOption>();
    statuses.add("All Competitions");
    competitions.forEach((c) => {
      statuses.add(computeCompetitionStatus(c) as StatusFilterOption);
    });
    return Array.from(statuses);
  }, [competitions]);

  const availableLevels = useMemo(() => {
    const levels = Array.from(new Set(competitions.map((c) => c.level)));
    return levels;
  }, [competitions]);

  const availableParticipationOptions: ParticipationFilterOption[] = useMemo(() => {
    return [
      "All Opportunities",
      "Individual",
      "Team",
      "Ravenshaw Only",
      "External Participants Allowed",
    ];
  }, []);

  // Reset page to 1 whenever filters change
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleStatusChange = (status: StatusFilterOption) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category);
    setCurrentPage(1);
  };

  const handleParticipationChange = (participation: ParticipationFilterOption) => {
    setParticipationFilter(participation);
    setCurrentPage(1);
  };

  const handleLevelChange = (level: string) => {
    setLevelFilter(level);
    setCurrentPage(1);
  };

  const handleSortChange = (sort: CompetitionSortOption) => {
    setSortOption(sort);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setStatusFilter("All Competitions");
    setCategoryFilter("All Categories");
    setParticipationFilter("All Opportunities");
    setLevelFilter("All Levels");
    setSortOption("Registration Closing Soon");
    setCurrentPage(1);
  };

  const filteredCompetitions = useMemo(() => {
    return competitions.filter((item) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchShortDesc = item.shortDescription?.toLowerCase().includes(q) || false;
        const matchFullDesc = item.fullDescription?.toLowerCase().includes(q) || false;
        const matchOrganizer = item.organizerName?.toLowerCase().includes(q) || false;
        const matchCategory = item.category.toLowerCase().includes(q);
        const matchTags = item.tags?.some((t) => t.toLowerCase().includes(q)) || false;
        const matchKeywords = item.searchKeywords?.some((k) => k.toLowerCase().includes(q)) || false;

        if (
          !matchesTitle &&
          !matchShortDesc &&
          !matchFullDesc &&
          !matchOrganizer &&
          !matchCategory &&
          !matchTags &&
          !matchKeywords
        ) {
          return false;
        }
      }

      // 2. Status Filter
      if (statusFilter !== "All Competitions") {
        const currentStatus = computeCompetitionStatus(item);
        if (currentStatus !== statusFilter) {
          return false;
        }
      }

      // 3. Category Filter
      if (categoryFilter !== "All Categories") {
        if (item.category !== categoryFilter) {
          return false;
        }
      }

      // 4. Participation Filter
      if (participationFilter !== "All Opportunities") {
        if (participationFilter === "Individual" && item.participationMode !== "Individual") {
          return false;
        }
        if (participationFilter === "Team" && item.participationMode !== "Team") {
          return false;
        }
        if (
          participationFilter === "Ravenshaw Only" &&
          item.externalParticipantsAllowed === true
        ) {
          return false;
        }
        if (
          participationFilter === "External Participants Allowed" &&
          item.externalParticipantsAllowed !== true
        ) {
          return false;
        }
      }

      // 5. Level Filter
      if (levelFilter !== "All Levels") {
        if (item.level !== levelFilter) {
          return false;
        }
      }

      return true;
    });
  }, [
    competitions,
    searchQuery,
    statusFilter,
    categoryFilter,
    participationFilter,
    levelFilter,
  ]);

  const sortedCompetitions = useMemo(() => {
    const list = [...filteredCompetitions];

    list.sort((a, b) => {
      if (sortOption === "Registration Closing Soon") {
        if (a.registrationDeadline && b.registrationDeadline) {
          return (
            new Date(a.registrationDeadline).getTime() -
            new Date(b.registrationDeadline).getTime()
          );
        }
        if (a.registrationDeadline && !b.registrationDeadline) return -1;
        if (!a.registrationDeadline && b.registrationDeadline) return 1;
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }

      if (sortOption === "Upcoming First") {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }

      if (sortOption === "Latest Added") {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }

      if (sortOption === "Oldest First") {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }

      if (sortOption === "A to Z") {
        return a.title.localeCompare(b.title);
      }

      return 0;
    });

    return list;
  }, [filteredCompetitions, sortOption]);

  const totalPages = Math.ceil(sortedCompetitions.length / ITEMS_PER_PAGE);
  const paginatedCompetitions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedCompetitions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedCompetitions, currentPage]);

  return (
    <div className="w-full space-y-10 sm:space-y-12 lg:space-y-16">


      <div className="flex flex-col gap-16 lg:gap-24 pb-8">
        {/* Statistics Section */}
        <CompetitionStatistics competitions={competitions} />

        {/* Categories Grid */}
        <CompetitionCategories categories={categories} />

        {/* Featured Competition Section */}
        <FeaturedCompetition competitions={competitions} />

        {/* Upcoming Competitions Timeline & Month Explorer */}
        <UpcomingCompetitions competitions={competitions} />

        {/* Search and Filters */}
        <CompetitionFilters
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          statusFilter={statusFilter}
          onStatusChange={handleStatusChange}
          availableStatuses={availableStatuses}
          categoryFilter={categoryFilter}
          onCategoryChange={handleCategoryChange}
          availableCategories={availableCategories}
          participationFilter={participationFilter}
          onParticipationChange={handleParticipationChange}
          availableParticipationOptions={availableParticipationOptions}
          levelFilter={levelFilter}
          onLevelChange={handleLevelChange}
          availableLevels={availableLevels}
          sortOption={sortOption}
          onSortChange={handleSortChange}
          totalCount={sortedCompetitions.length}
        />

        {/* Results Grid or Empty State */}
        <section aria-label="Competitions List" className="w-full">
          {paginatedCompetitions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {paginatedCompetitions.map((competition) => (
                <CompetitionCard key={competition.id} competition={competition} />
              ))}
            </div>
          ) : (
            <CompetitionsEmptyState onReset={handleResetFilters} />
          )}
        </section>

        {/* Accessible Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Competitions directory pagination"
            className="flex items-center justify-center gap-2"
          >
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              aria-label="Previous page"
              className="p-2.5 rounded-xl bg-white border border-[var(--color-rm-gold)]/30 text-[var(--color-rm-maroon)] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#FFF8F1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
            >
              <ChevronLeft className="w-5 h-5" aria-hidden="true" />
            </button>

            <span className="px-4 py-2 rounded-xl bg-white border border-[var(--color-rm-gold)]/30 text-xs sm:text-sm font-bold text-[var(--color-rm-maroon)]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              aria-label="Next page"
              className="p-2.5 rounded-xl bg-white border border-[var(--color-rm-gold)]/30 text-[var(--color-rm-maroon)] disabled:opacity-30 disabled:pointer-events-none hover:bg-[#FFF8F1] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
            >
              <ChevronRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </nav>
        )}

        {/* Leaderboard Section */}
        <CompetitionLeaderboard leaderboard={leaderboard} champion={champion} />

        {/* Hall of Fame Section */}
        <CompetitionHallOfFame winners={winners} />

        {/* Call to Action Cards */}
        <CompetitionCTACards />
      </div>
    </div>
  );
};
