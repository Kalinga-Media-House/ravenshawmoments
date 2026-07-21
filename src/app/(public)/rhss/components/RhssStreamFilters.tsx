"use client";

import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export interface RhssStreamFiltersProps {
  initialQuery?: string;
  initialBatch?: string;
  availableBatches: string[];
}

export function RhssStreamFilters({
  initialQuery = "",
  initialBatch = "",
  availableBatches,
}: RhssStreamFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [query, setQuery] = useState(initialQuery);
  const [batch, setBatch] = useState(initialBatch);

  // Map "2026" (graduation year) to "2024-2026" (academic batch)
  const batchOptions = availableBatches.map(b => {
    const year = parseInt(b, 10);
    if (!isNaN(year) && b.length === 4) {
      return { label: `${year - 2}–${year}`, value: `${year - 2}-${year}` };
    }
    return { label: b, value: b };
  });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }

    if (batch) {
      params.set("batch", batch);
    } else {
      params.delete("batch");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery("");
    setBatch("");
    router.push(pathname);
  };

  return (
    <div className="bg-card border rounded-xl p-5 shadow-sm sticky top-24">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Filter className="h-4 w-4" /> Filters
      </h3>
      <form onSubmit={handleApply} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Search Name</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              name="query" 
              placeholder="Find student..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9" 
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Academic Batch</label>
          <SearchableCombobox
            options={batchOptions}
            value={batch}
            onChange={(val) => setBatch(val)}
            placeholder="Select Academic Batch"
            emptyText="No batch found."
          />
        </div>
        <Button type="submit" className="w-full bg-[#3A000E] text-white hover:bg-[#5A0016]">
          Apply Filters
        </Button>
        {(initialQuery || initialBatch) && (
          <Button 
            type="button" 
            variant="outline" 
            className="w-full mt-2"
            onClick={handleClear}
          >
            Clear Filters
          </Button>
        )}
      </form>
    </div>
  );
}
