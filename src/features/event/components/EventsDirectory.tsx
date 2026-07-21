"use client";

import React, { useState, useMemo } from "react";
import { Search, X, CalendarDays, FilterX, Clock, History, LayoutGrid, CheckCircle2 } from "lucide-react";
import { EVENTS } from "../data/events";
import { EventCategory, EventStatus } from "../types/event";
import { getEventStatus } from "../utils/event-date";
import { EventCard } from "./EventCard";
import { FeaturedEventCard } from "./FeaturedEventCard";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES = [
  "All Categories",
  "Academic",
  "Cultural",
  "Competition",
  "Seminar",
  "Workshop",
  "Sports",
  "Department",
  "Hostel",
  "Organization",
  "Reunion",
  "Celebration",
  "Other"
] as const;

type CategoryFilter = typeof ALL_CATEGORIES[number];
type StatusFilter = "All Events" | EventStatus;
type SortOption = "Upcoming First" | "Latest Added" | "Oldest First" | "A to Z";

export const EventsDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All Categories");
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("All Events");
  const [activeSort, setActiveSort] = useState<SortOption>("Upcoming First");
  
  const revealRef = useScrollReveal();

  // Attach dynamic statuses
  const eventsWithStatus = useMemo(() => {
    return EVENTS.map(event => ({
      ...event,
      currentStatus: getEventStatus(event.startsAt, event.endsAt)
    }));
  }, []);

  // Calculate statistics
  const stats = useMemo(() => {
    let upcoming = 0;
    let ongoing = 0;
    let past = 0;
    const categories = new Set<string>();

    eventsWithStatus.forEach(event => {
      if (event.currentStatus === "Upcoming") upcoming++;
      else if (event.currentStatus === "Ongoing") ongoing++;
      else if (event.currentStatus === "Past") past++;
      categories.add(event.category);
    });

    return {
      upcoming,
      ongoing,
      past,
      uniqueCategories: categories.size
    };
  }, [eventsWithStatus]);

  // Filter and Sort Logic
  const filteredAndSortedEvents = useMemo(() => {
    const filtered = eventsWithStatus.filter(event => {
      const matchesStatus = activeStatus === "All Events" || event.currentStatus === activeStatus;
      
      const matchesCategory = 
        activeCategory === "All Categories" || 
        event.category === activeCategory ||
        // Handle backwards compatibility mapping if needed
        ((activeCategory as string) === "University Event" && event.category === "University Event") ||
        ((activeCategory as string) === "Hostel Event" && event.category === "Hostel Event");

      const cleanQuery = searchQuery.trim().toLowerCase();
      if (!cleanQuery) return matchesStatus && matchesCategory;

      const searchableString = [
        event.title,
        event.description,
        event.shortDescription,
        event.category,
        event.organizerName,
        event.location,
        ...(event.searchKeywords || [])
      ].filter(Boolean).join(" ").toLowerCase();

      const matchesSearch = searchableString.includes(cleanQuery);

      return matchesStatus && matchesCategory && matchesSearch;
    });

    // Sort
    return filtered.sort((a, b) => {
      const dateA = new Date(a.startsAt).getTime();
      const dateB = new Date(b.startsAt).getTime();
      
      switch (activeSort) {
        case "Upcoming First":
          // Upcoming/Ongoing closer to now first, past further in past later
          if (a.currentStatus !== b.currentStatus) {
            const statusWeight = { Ongoing: 0, Upcoming: 1, Past: 2 };
            return statusWeight[a.currentStatus] - statusWeight[b.currentStatus];
          }
          return a.currentStatus === "Past" ? dateB - dateA : dateA - dateB;
        case "Latest Added":
          return dateB - dateA;
        case "Oldest First":
          return dateA - dateB;
        case "A to Z":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  }, [eventsWithStatus, searchQuery, activeCategory, activeStatus, activeSort]);

  // Handle Featured Event
  const featuredEvent = filteredAndSortedEvents.find(e => e.featured);
  const gridEvents = filteredAndSortedEvents.filter(e => e.id !== featuredEvent?.id);

  const hasActiveFilters = searchQuery !== "" || activeCategory !== "All Categories" || activeStatus !== "All Events";

  const handleClear = () => {
    setSearchQuery("");
    setActiveCategory("All Categories");
    setActiveStatus("All Events");
    setActiveSort("Upcoming First");
  };

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 bg-transparent min-h-[60vh]" ref={revealRef as React.RefObject<HTMLDivElement>}>
      <div className="container mx-auto px-[clamp(1.25rem,4vw,3rem)] max-w-[1400px]">
        
        {/* EVENT STATISTICS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16 rm-reveal">
          <div className="p-5 md:p-6 light-surface shadow-sm rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-full bg-[var(--color-heritage-gold)]/10 text-[var(--color-heritage-gold)]">
              <CalendarDays className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground leading-none mb-1">{stats.upcoming}</p>
              <p className="text-sm font-medium text-muted-foreground">Upcoming Events</p>
            </div>
          </div>
          <div className="p-5 md:p-6 light-surface shadow-sm rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground leading-none mb-1">{stats.ongoing}</p>
              <p className="text-sm font-medium text-muted-foreground">Ongoing Events</p>
            </div>
          </div>
          <div className="p-5 md:p-6 light-surface shadow-sm rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10 text-primary">
              <History className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground leading-none mb-1">{stats.past}</p>
              <p className="text-sm font-medium text-muted-foreground">Past Events</p>
            </div>
          </div>
          <div className="p-5 md:p-6 light-surface shadow-sm rounded-2xl flex items-center gap-4">
            <div className="p-3 rounded-full bg-muted text-muted-foreground">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-bold text-foreground leading-none mb-1">{stats.uniqueCategories}</p>
              <p className="text-sm font-medium text-muted-foreground">Event Categories</p>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTER SYSTEM */}
        <div className="flex flex-col mb-12 lg:mb-16 gap-8 rm-reveal" style={{ transitionDelay: '100ms' }}>
          
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
            {/* Search Bar */}
            <div className="relative w-full lg:max-w-xl">
              <label htmlFor="event-search" className="sr-only">Search events by title, category, venue, or organizer...</label>
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <input
                id="event-search"
                type="text"
                className="block w-full pl-14 pr-12 py-4 bg-white border border-input rounded-2xl text-[1rem] sm:text-[1.05rem] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--color-heritage-gold)] focus:border-transparent transition-shadow shadow-sm"
                placeholder="Search events by title, category, venue, or organizer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center group"
                  aria-label="Clear search"
                >
                  <div className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" aria-hidden="true" />
                  </div>
                </button>
              )}
            </div>

            {/* Status and Sort */}
            <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
              <select 
                value={activeStatus}
                onChange={(e) => setActiveStatus(e.target.value as StatusFilter)}
                className="appearance-none bg-white border border-input text-foreground rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-heritage-gold)] font-medium text-sm shadow-sm"
              >
                <option value="All Events">All Events</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Past">Past</option>
              </select>

              <select 
                value={activeSort}
                onChange={(e) => setActiveSort(e.target.value as SortOption)}
                className="appearance-none bg-white border border-input text-foreground rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-[var(--color-heritage-gold)] font-medium text-sm shadow-sm"
              >
                <option value="Upcoming First">Upcoming First</option>
                <option value="Latest Added">Latest Added</option>
                <option value="Oldest First">Oldest First</option>
                <option value="A to Z">A to Z</option>
              </select>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap items-center gap-3">
            {ALL_CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={isActive}
                  className={cn(
                    "px-4 py-2 filter-chip focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-heritage-gold)]",
                    isActive && "filter-chip-active shadow-md"
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between mt-2 px-1">
            <div className="text-[0.95rem] font-medium text-muted-foreground" aria-live="polite">
              Showing {filteredAndSortedEvents.length} {filteredAndSortedEvents.length === 1 ? 'event' : 'events'}
            </div>
            {hasActiveFilters && (
              <button 
                onClick={handleClear}
                className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                <FilterX className="w-4 h-4" /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* Directory Content */}
        {filteredAndSortedEvents.length > 0 ? (
          <div className="flex flex-col gap-12 lg:gap-16">
            
            {/* FEATURED EVENT */}
            {featuredEvent && (
              <div className="rm-reveal" style={{ transitionDelay: '200ms' }}>
                <FeaturedEventCard event={featuredEvent} />
              </div>
            )}

            {/* EVENTS GRID */}
            {gridEvents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 auto-rows-auto">
                {gridEvents.map((item, index) => (
                  <div
                    key={item.id}
                    className="h-full rm-reveal"
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <EventCard event={item} />
                  </div>
                ))}
              </div>
            )}

          </div>
        ) : (
          /* EMPTY RESULTS STATE */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center light-surface rounded-[2rem] max-w-2xl mx-auto rm-reveal shadow-sm">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
              <Search className="w-10 h-10 text-muted-foreground" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">No Events Found</h3>
            <p className="text-[1.05rem] text-muted-foreground mb-8">
              No events match your current search or filters. Try changing your search terms or clearing the selected filters.
            </p>
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[var(--color-heritage-gold)] text-black rounded-full text-[1rem] font-bold tracking-wide transition-all duration-300 shadow-sm hover:bg-[var(--color-heritage-gold)]/90 hover:-translate-y-0.5"
            >
              <FilterX className="w-5 h-5" /> Clear Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
