"use client";

import React, { useState, useMemo } from "react";
import { Search, ArrowDownAZ, ArrowUpZA, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HostelCard } from "./HostelCard";

interface Hostel {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  hostel_type: string;
  capacity: number | null;
  address: string | null;
  cover_image_url: string | null;
}

interface HostelListProps {
  hostels: Hostel[];
}

export function HostelList({ hostels }: HostelListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "boys" | "girls">("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredAndSortedHostels = useMemo(() => {
    let result = [...hostels];

    // Search filter
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(
        (h) =>
          h.name.toLowerCase().includes(lowerSearch) ||
          (h.description && h.description.toLowerCase().includes(lowerSearch))
      );
    }

    // Type filter
    if (filterType !== "all") {
      result = result.filter((h) => h.hostel_type === filterType);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });

    return result;
  }, [hostels, searchTerm, filterType, sortOrder]);

  return (
    <div className="w-full">
      {/* Search & Filter Controls */}
      <div className="mb-12 bg-white p-6 rounded-2xl shadow-sm border border-[#3A0016]/10 flex flex-col lg:flex-row gap-6 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#3A0016]/40" />
          <input
            type="text"
            placeholder="Search hostels..."
            className="w-full pl-12 pr-4 py-3 bg-[#F8F4EC] border border-[#3A0016]/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C8A046] focus:border-transparent text-[#3A0016] placeholder-[#3A0016]/40 font-medium transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Type Filter */}
          <div className="flex bg-[#F8F4EC] p-1 rounded-xl border border-[#3A0016]/10">
            {(["all", "boys", "girls"] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                  filterType === type 
                    ? "bg-[#3A0016] text-white shadow-md" 
                    : "text-[#5A1024]/70 hover:text-[#3A0016] hover:bg-white/50"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Sort */}
          <button
            onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
            className="flex items-center justify-center px-4 py-2 bg-[#F8F4EC] border border-[#3A0016]/10 rounded-xl text-[#5A1024] font-bold text-sm hover:bg-white transition-all shadow-sm"
          >
            Sort {sortOrder === "asc" ? <ArrowDownAZ className="ml-2 w-4 h-4" /> : <ArrowUpZA className="ml-2 w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Grid */}
      {filteredAndSortedHostels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
          {filteredAndSortedHostels.map((hostel, index) => (
            <div
              key={hostel.id}
              className="h-full animate-in fade-in-0 slide-in-from-bottom-5 zoom-in-[0.96] duration-500 fill-mode-both"
              style={{ animationDelay: `${Math.min(index * 45, 450)}ms` }}
            >
              <HostelCard hostel={hostel} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-[#3A0016]/10">
          <Building2 className="w-16 h-16 text-[#C8A046]/40 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-[#3A0016] mb-2 font-serif">No Hostels Found</h3>
          <p className="text-[#5A1024]/70 max-w-md mx-auto">
            Try adjusting your search criteria or filters to see available residential options.
          </p>
          <Button 
            variant="outline" 
            className="mt-6 border-[#C8A046] text-[#C8A046] hover:bg-[#C8A046]/10"
            onClick={() => {
              setSearchTerm("");
              setFilterType("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
