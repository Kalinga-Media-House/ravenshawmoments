// =============================================================================
// Ravenshaw Moments - Standardized Enterprise Skeletons
// File: src/features/shared/components/skeletons/TableSkeleton.tsx
// =============================================================================

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function TableSkeleton({
  rows = 5,
  columns = 4,
  className,
}: TableSkeletonProps) {
  return (
    <div
      className={cn("w-full rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm", className)}
      role="status"
      aria-label="Loading table data"
    >
      {/* Header bar */}
      <div className="flex items-center justify-between p-4 bg-muted/60 border-b border-border/60">
        <Skeleton className="h-5 w-32 rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-48 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>

      {/* Table rows */}
      <div className="divide-y divide-border/60">
        {Array.from({ length: rows }).map((_, rIndex) => (
          <div key={rIndex} className="flex items-center justify-between p-4 gap-4">
            {Array.from({ length: columns }).map((_, cIndex) => (
              <Skeleton
                key={cIndex}
                className={cn(
                  "h-4.5 rounded-md",
                  cIndex === 0 ? "w-1/3" : cIndex === columns - 1 ? "w-16" : "w-1/4"
                )}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Footer bar */}
      <div className="flex items-center justify-between p-4 bg-muted/40 border-t border-border/60">
        <Skeleton className="h-4 w-36 rounded-md" />
        <Skeleton className="h-8 w-64 rounded-lg" />
      </div>
    </div>
  );
}
