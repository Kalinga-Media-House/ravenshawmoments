// =============================================================================
// Ravenshaw Moments - Standardized Enterprise Skeletons
// File: src/features/shared/components/skeletons/CardSkeleton.tsx
// =============================================================================

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4", className)}
      role="status"
      aria-label="Loading card"
    >
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-1/3 rounded-lg" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="space-y-2.5 pt-1">
        <Skeleton className="h-4.5 w-full rounded-md" />
        <Skeleton className="h-4.5 w-4/5 rounded-md" />
        <Skeleton className="h-4.5 w-3/5 rounded-md" />
      </div>
      <div className="pt-2 flex items-center justify-between">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  );
}
