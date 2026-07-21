// =============================================================================
// Ravenshaw Moments
// File      : src/features/department/components/shared/DepartmentSkeleton.tsx
// Purpose   : Reusable luxury loading skeletons for Department UI components
// =============================================================================

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export interface DepartmentSkeletonProps {
  variant?: "card" | "header" | "list" | "grid" | "directory";
  count?: number;
}

export const DepartmentSkeleton: React.FC<DepartmentSkeletonProps> = ({
  variant = "card",
  count = 1,
}) => {
  const items = Array.from({ length: count }, (_, i) => i);

  if (variant === "directory" || variant === "grid") {
    const gridCount = count === 1 ? 15 : count;
    const gridItems = Array.from({ length: gridCount }, (_, i) => i);
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-5 gap-2 sm:gap-4 md:gap-5 lg:gap-6 w-full">
        {gridItems.map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between w-full h-[108px] sm:h-[155px] md:h-[165px] lg:h-[175px] rounded-[16px] sm:rounded-[24px] p-2.5 sm:p-4 md:p-5 border border-[#EADED2]/80 bg-gradient-to-br from-[#FFFDF8] via-[#FDFBF7] to-[#F8F3EB] shadow-xs"
          >
            <div className="flex items-center justify-between w-full">
              <Skeleton className="w-[35px] h-[35px] sm:w-[44px] sm:h-[44px] rounded-full shrink-0" />
              <Skeleton className="w-6 h-6 sm:w-7 sm:h-7 rounded-full shrink-0" />
            </div>
            <div className="space-y-1 sm:space-y-1.5 mt-auto pt-1">
              <Skeleton className="h-3.5 sm:h-4.5 w-4/5 rounded-md" />
              <Skeleton className="h-3 sm:h-4 w-1/2 rounded-md hidden sm:block" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "header") {
    return (
      <div className="w-full space-y-5 rounded-[24px] border border-[#EADED2] bg-[#FFFDF8] p-6 sm:p-8 shadow-sm">
        <Skeleton className="h-56 sm:h-72 w-full rounded-[20px]" />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pt-2">
          <div className="space-y-2.5">
            <Skeleton className="h-9 w-64 sm:w-80 rounded-lg" />
            <Skeleton className="h-4 w-48 sm:w-60 rounded-md" />
          </div>
          <Skeleton className="h-11 w-36 rounded-full" />
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3 w-full">
        {items.map((i) => (
          <div key={i} className="flex items-center space-x-4 p-4 rounded-2xl border border-[#EADED2] bg-[#FFFDF8] shadow-xs">
            <Skeleton className="h-12 w-12 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4.5 w-3/4 rounded-md" />
              <Skeleton className="h-3.5 w-1/2 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 w-full">
      {items.map((i) => (
        <div key={i} className="rounded-[24px] border border-[#EADED2] bg-[#FFFDF8] p-5 shadow-xs space-y-4">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <div className="space-y-2 pt-1">
            <Skeleton className="h-5 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
};
