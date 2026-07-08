// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/shared/DepartmentSkeleton.tsx
// Purpose   : Reusable loading skeleton variants for Department UI components
// =============================================================================

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export interface DepartmentSkeletonProps {
  variant?: "card" | "header" | "list" | "grid";
  count?: number;
}

export const DepartmentSkeleton: React.FC<DepartmentSkeletonProps> = ({
  variant = "card",
  count = 1,
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === "header") {
    return (
      <div className="w-full space-y-4 rounded-2xl border border-border bg-card p-6 shadow-xs">
        <Skeleton className="h-48 w-full rounded-xl" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3 w-full">
        {items.map((i) => (
          <div key={i} className="flex items-center space-x-4 p-4 rounded-lg border border-border bg-card">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((i) => (
          <div key={i} className="space-y-3 rounded-xl border border-border bg-card p-5 shadow-xs">
            <Skeleton className="h-40 w-full rounded-lg" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ))}
    </div>
  );
};
