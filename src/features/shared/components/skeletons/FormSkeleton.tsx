// =============================================================================
// Ravenshaw Moments - Standardized Enterprise Skeletons
// File: src/features/shared/components/skeletons/FormSkeleton.tsx
// =============================================================================

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function FormSkeleton({ fields = 4, className }: { fields?: number; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-sm space-y-6 w-full max-w-2xl", className)} role="status" aria-label="Loading form">
      <div className="space-y-2 pb-2 border-b border-border/60">
        <Skeleton className="h-7 w-48 rounded-lg" />
        <Skeleton className="h-4 w-80 rounded-md" />
      </div>

      <div className="space-y-5">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-28 rounded-md" />
            <Skeleton className={cn("w-full rounded-xl", i === fields - 1 ? "h-24" : "h-10")} />
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-border/60 flex items-center justify-end gap-3">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  );
}
