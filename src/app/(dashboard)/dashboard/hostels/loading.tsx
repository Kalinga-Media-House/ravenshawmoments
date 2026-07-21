// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/hostels/loading.tsx
// Purpose   : Luxury Loading Skeleton for Hostel Management Dashboard
// =============================================================================

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { HostelHeaderSkeleton, HostelGridSkeleton } from "@/features/hostel/components/HostelSkeleton";

export default function DashboardHostelsLoading() {
  return (
    <div className="space-y-8 w-full p-2 sm:p-6">
      <HostelHeaderSkeleton />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Skeleton className="h-11 w-full max-w-md rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
      <HostelGridSkeleton />
    </div>
  );
}
