// =============================================================================
// Ravenshaw Moments
// File      : src/features/hostel/components/HostelSkeleton.tsx
// Purpose   : Accessible loading skeletons for Hostel public & dashboard views
// =============================================================================

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const HostelHeaderSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 border-b border-border pb-6" role="status" aria-label="Loading hostel header">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-48" />
    </div>
  );
};

export const HostelBannerSkeleton: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden rounded-xl" role="status" aria-label="Loading hostel banner">
      <Skeleton className="h-48 w-full sm:h-64" />
    </div>
  );
};

export const HostelGridSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3" role="status" aria-label="Loading hostel items">
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-32 w-full rounded-xl" />
    </div>
  );
};
