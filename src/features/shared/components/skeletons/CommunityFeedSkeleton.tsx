// =============================================================================
// Ravenshaw Moments - Standardized Enterprise Skeletons
// File: src/features/shared/components/skeletons/CommunityFeedSkeleton.tsx
// =============================================================================

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CommunityFeedSkeleton({ count = 3, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("space-y-6 w-full", className)} role="status" aria-label="Loading community posts">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="size-11 rounded-full shrink-0" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-36 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            </div>
            <Skeleton className="size-8 rounded-lg" />
          </div>

          <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-11/12 rounded-md" />
            <Skeleton className="h-4 w-3/4 rounded-md" />
          </div>

          {i % 2 === 0 && <Skeleton className="h-56 w-full rounded-xl" />}

          <div className="pt-3 border-t border-border/60 flex items-center justify-between">
            <div className="flex gap-4">
              <Skeleton className="h-8 w-20 rounded-lg" />
              <Skeleton className="h-8 w-20 rounded-lg" />
            </div>
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
