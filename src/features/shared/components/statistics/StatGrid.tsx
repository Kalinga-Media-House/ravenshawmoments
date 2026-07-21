// =============================================================================
// Ravenshaw Moments - Enterprise Statistics Components
// File: src/features/shared/components/statistics/StatGrid.tsx
// =============================================================================

import * as React from "react";
import { cn } from "@/lib/utils";

export interface StatGridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4;
}

export function StatGrid({ cols = 4, className, children, ...props }: StatGridProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div
      data-slot="stat-grid"
      className={cn("grid gap-5 sm:gap-6", gridCols[cols], className)}
      {...props}
    >
      {children}
    </div>
  );
}
