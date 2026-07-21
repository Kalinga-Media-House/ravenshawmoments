// =============================================================================
// Ravenshaw Moments - Standardized Enterprise Skeletons
// File: src/features/shared/components/skeletons/DashboardWidgetSkeleton.tsx
// =============================================================================

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function DashboardWidgetSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-2xl border border-border/80 bg-card p-6 shadow-sm space-y-5", className)}
      role="status"
      aria-label="Loading dashboard widget"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-36 rounded-md" />
          <Skeleton className="h-3.5 w-48 rounded-md" />
        </div>
        <Skeleton className="size-8 rounded-lg" />
      </div>

      <div className="grid grid-cols-2 gap-4 py-2">
        <div className="space-y-1 p-3 rounded-xl bg-muted/40">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
        <div className="space-y-1 p-3 rounded-xl bg-muted/40">
          <Skeleton className="h-3 w-16 rounded-md" />
          <Skeleton className="h-7 w-24 rounded-lg" />
        </div>
      </div>

      <div className="space-y-2.5">
        <Skeleton className="h-10 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
