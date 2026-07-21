// =============================================================================
// Ravenshaw Moments
// File      : src/features/hostel/components/HostelSkeleton.tsx
// Purpose   : Accessible luxury loading skeletons for Hostel public & dashboard views
// =============================================================================

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const HostelHeaderSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 border-b border-[#EADED2] pb-6" role="status" aria-label="Loading hostel header">
      <Skeleton className="h-9 w-64 sm:w-80 rounded-xl" />
      <Skeleton className="h-4.5 w-48 sm:w-64 rounded-md" />
    </div>
  );
};

export const HostelBannerSkeleton: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-[24px] border border-[#EADED2] bg-white p-2" role="status" aria-label="Loading hostel banner">
      <Skeleton className="h-56 w-full sm:h-80 rounded-[20px]" />
    </div>
  );
};

export const HostelGridSkeleton: React.FC = () => {
  const items = [1, 2, 3, 4, 5, 6];
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Loading hostel items">
      {items.map((i) => (
        <div key={i} className="rounded-[24px] border border-[#EADED2] bg-white p-5 shadow-xs space-y-4">
          <Skeleton className="h-44 w-full rounded-2xl" />
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
