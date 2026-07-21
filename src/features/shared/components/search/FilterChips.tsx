// =============================================================================
// Ravenshaw Moments - Enterprise Search & Filter Primitives
// File: src/features/shared/components/search/FilterChips.tsx
// =============================================================================

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FilterChipOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterChipsProps {
  options: FilterChipOption[];
  selectedValue: string | string[];
  onSelect: (value: string) => void;
  isMulti?: boolean;
  className?: string;
}

export function FilterChips({
  options,
  selectedValue,
  onSelect,
  isMulti = false,
  className,
}: FilterChipsProps) {
  const isSelected = (val: string) => {
    if (Array.isArray(selectedValue)) {
      return selectedValue.includes(val);
    }
    return selectedValue === val;
  };

  return (
    <div
      data-slot="filter-chips"
      role="group"
      aria-label="Filter options"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {options.map((opt) => {
        const active = isSelected(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 outline-none select-none",
              active
                ? "bg-primary text-primary-foreground shadow-sm scale-[1.02]"
                : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
            )}
          >
            <span>{opt.label}</span>
            {typeof opt.count === "number" && (
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none",
                  active
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background text-muted-foreground border border-border/60"
                )}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
