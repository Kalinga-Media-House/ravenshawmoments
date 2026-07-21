"use client";

import React, { useState, useMemo, useRef, useCallback } from "react";
import { Search, X, FilterX, SortAsc, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { CONTENT_ITEMS } from "../data/content";
import { ContentType, ContentCategory } from "../types/content";
import { NewsCard } from "./NewsCard";
import { FeaturedStoryCard } from "./FeaturedStoryCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const ITEMS_PER_PAGE = 9;

const ALL_CONTENT_TYPES: { label: string; value: "All" | ContentType }[] = [
  { label: "All", value: "All" },
  { label: "News", value: "News" },
  { label: "Announcements", value: "Announcement" },
  { label: "Stories", value: "Story" },
  { label: "Articles", value: "Article" },
  { label: "Interviews", value: "Interview" },
  { label: "Achievements", value: "Achievement" },
  { label: "Magazines", value: "Magazine" },
  { label: "Newsletters", value: "Newsletter" },
  { label: "Reports", value: "Report" },
  { label: "E-Publications", value: "E-Publication" },
];

type SortOption = "Latest First" | "Oldest First" | "A to Z";

export const NewsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<"All" | ContentType>("All");
  const [activeCategory, setActiveCategory] = useState<"All" | ContentCategory>("All");
  const [activeSort, setActiveSort] = useState<SortOption>("Latest First");
  const [currentPage, setCurrentPage] = useState(1);

  const revealRef = useScrollReveal();
  const gridRef = useRef<HTMLDivElement>(null);

  // Get unique categories from data
  const availableCategories = useMemo(() => {
    const cats = new Set<ContentCategory>();
    CONTENT_ITEMS.forEach(item => {
      if (item.status === "Published") cats.add(item.category);
    });
    return Array.from(cats).sort();
  }, []);

  // Filter and sort
  const filteredItems = useMemo(() => {
    const filtered = CONTENT_ITEMS.filter(item => {
      if (item.status !== "Published") return false;

      const matchesType = activeType === "All" || item.contentType === activeType;
      const matchesCategory = activeCategory === "All" || item.category === activeCategory;

      const cleanQuery = searchQuery.trim().toLowerCase();
      if (!cleanQuery) return matchesType && matchesCategory;

      const searchableString = [
        item.title,
        item.shortDescription,
        item.category,
        item.contentType,
        item.author,
        item.publisher,
        item.department,
        item.hostel,
        item.organization,
        ...(item.tags || []),
      ].filter(Boolean).join(" ").toLowerCase();

      return matchesType && matchesCategory && searchableString.includes(cleanQuery);
    });

    return filtered.sort((a, b) => {
      const dateA = new Date(a.publishedDate).getTime();
      const dateB = new Date(b.publishedDate).getTime();

      switch (activeSort) {
        case "Latest First":
          return dateB - dateA;
        case "Oldest First":
          return dateA - dateB;
        case "A to Z":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [searchQuery, activeType, activeCategory, activeSort]);

  // Featured item (only on first page with no active filters)
  const hasActiveFilters = searchQuery !== "" || activeType !== "All" || activeCategory !== "All";
  const featuredItem = !hasActiveFilters ? filteredItems.find(item => item.featured) : undefined;
  const gridItems = featuredItem
    ? filteredItems.filter(item => item.id !== featuredItem.id)
    : filteredItems;

  // Pagination
  const totalPages = Math.max(1, Math.ceil(gridItems.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const paginatedItems = gridItems.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const handleClear = () => {
    setSearchQuery("");
    setActiveType("All");
    setActiveCategory("All");
    setActiveSort("Latest First");
    setCurrentPage(1);
  };

  // Reset page on filter changes
  const handleTypeChange = (type: "All" | ContentType) => {
    setActiveType(type);
    setCurrentPage(1);
  };
  const handleCategoryChange = (cat: "All" | ContentCategory) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveSort(e.target.value as SortOption);
    setCurrentPage(1);
  };
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // Result count text
  const totalResults = gridItems.length + (featuredItem ? 1 : 0);
  const resultText = totalResults === 0
    ? "No matching publications"
    : totalResults === 1
      ? "Showing 1 publication"
      : `Showing ${totalResults} publications`;

  // Page numbers for pagination display
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push("...");
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safeCurrentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-transparent min-h-[60vh]" ref={revealRef as React.RefObject<HTMLDivElement>}>
      <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px]">

        {/* Featured Story */}
        {featuredItem && currentPage === 1 && (
          <div className="rm-reveal mb-16">
            <h2 className="text-lg sm:text-xl font-bold heritage-card-title mb-6 flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[var(--color-heritage-gold)]" aria-hidden="true" />
              Featured Story
            </h2>
            <FeaturedStoryCard item={featuredItem} />
          </div>
        )}

        {/* Controls Section */}
        <div className="rm-reveal space-y-6 mb-10" style={{ transitionDelay: "100ms" }}>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search news, stories and publications..."
              className="w-full pl-12 pr-12 py-3.5 bg-white border border-input rounded-xl text-[0.95rem] font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-heritage-gold)] focus:border-transparent transition-all duration-300 shadow-sm"
              aria-label="Search news, stories and publications"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setCurrentPage(1); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Content Type Filters */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by content type">
            {ALL_CONTENT_TYPES.map(({ label, value }) => (
              <button
                key={value}
                onClick={() => handleTypeChange(value)}
                className={cn(
                  "px-3.5 py-2 filter-chip focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-heritage-gold)]",
                  activeType === value && "filter-chip-active shadow-md"
                )}
                aria-pressed={activeType === value}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Category + Sort Row */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="relative">
              <select
                value={activeCategory}
                onChange={(e) => handleCategoryChange(e.target.value as "All" | ContentCategory)}
                className="appearance-none bg-white border border-input rounded-lg px-4 py-2.5 pr-10 text-[0.85rem] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-heritage-gold)] cursor-pointer shadow-sm"
                aria-label="Filter by category"
              >
                <option value="All">All Categories</option>
                {availableCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <FileText className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-heritage-gold)] pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={activeSort}
                onChange={handleSortChange}
                className="appearance-none bg-white border border-input rounded-lg px-4 py-2.5 pr-10 text-[0.85rem] font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-heritage-gold)] cursor-pointer shadow-sm"
                aria-label="Sort publications"
              >
                <option value="Latest First">Latest First</option>
                <option value="Oldest First">Oldest First</option>
                <option value="A to Z">A to Z</option>
              </select>
              <SortAsc className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-heritage-gold)] pointer-events-none" />
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-3 py-2 text-[0.8rem] font-bold text-red-400 hover:text-red-300 transition-colors"
                aria-label="Clear all filters"
              >
                <FilterX className="w-4 h-4" />
                Clear All Filters
              </button>
            )}
          </div>

          {/* Result Count */}
          <p className="text-[0.9rem] text-muted-foreground font-semibold tracking-wide">
            {resultText}
          </p>
        </div>

        {/* Content Grid */}
        <div ref={gridRef}>
          {paginatedItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {paginatedItems.map((item, idx) => (
                <div key={item.id} className="rm-reveal h-full" style={{ transitionDelay: `${Math.min(idx * 80, 400)}ms` }}>
                  <NewsCard item={item} />
                </div>
              ))}
            </div>
          ) : (
            <div className="rm-reveal flex flex-col items-center justify-center py-24 px-6 light-surface shadow-sm rounded-[2rem] text-center">
              <div className="inline-flex items-center justify-center p-4 bg-muted text-muted-foreground rounded-2xl mb-6">
                <FileText className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No Publications Found</h3>
              <p className="text-muted-foreground max-w-md mb-8 text-[0.95rem]">
                Try changing your search or selecting a different category.
              </p>
              <button
                onClick={handleClear}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-heritage-gold)] text-black font-bold rounded-xl hover:bg-[var(--color-heritage-gold)]/90 transition-all duration-300 shadow-sm"
              >
                <FilterX className="w-4 h-4" />
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && paginatedItems.length > 0 && (
          <nav className="rm-reveal flex items-center justify-center gap-2 mt-14" aria-label="Pagination" style={{ transitionDelay: "200ms" }}>
            <button
              onClick={() => handlePageChange(safeCurrentPage - 1)}
              disabled={safeCurrentPage <= 1}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-input text-foreground hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-heritage-gold)]"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground font-bold">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => handlePageChange(page as number)}
                  className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-lg border text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-heritage-gold)]",
                    safeCurrentPage === page
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "border-input text-foreground hover:bg-muted"
                  )}
                  aria-label={`Page ${page}`}
                  aria-current={safeCurrentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(safeCurrentPage + 1)}
              disabled={safeCurrentPage >= totalPages}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-input text-foreground hover:bg-muted transition-all disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-heritage-gold)]"
              aria-label="Next page"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        )}

      </div>
    </section>
  );
};
