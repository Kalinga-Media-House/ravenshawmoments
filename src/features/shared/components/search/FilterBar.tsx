// =============================================================================
// Ravenshaw Moments - Enterprise Search & Filter Primitives
// File: src/features/shared/components/search/FilterBar.tsx
// =============================================================================

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  search?: React.ReactNode;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export function FilterBar({
  search,
  filters,
  actions,
  className,
  children,
  ...props
}: FilterBarProps) {
  return (
    <div
      data-slot="filter-bar"
      className={cn(
        "flex flex-col gap-4 p-4 sm:p-5 rounded-2xl bg-card border border-border/80 shadow-xs mb-6",
        className
      )}
      {...props}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {search && <div className="w-full sm:max-w-md flex-1">{search}</div>}
        {actions && <div className="flex items-center gap-2.5 shrink-0 sm:self-center">{actions}</div>}
      </div>

      {filters && (
        <div className="pt-2 border-t border-border/50 flex items-center justify-between flex-wrap gap-3">
          {filters}
        </div>
      )}

      {children}
    </div>
  );
}
