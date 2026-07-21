// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/departments/loading.tsx
// Purpose   : Luxury Loading Skeleton for Department Management Dashboard
// =============================================================================

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DepartmentSkeleton } from "@/features/department/components";

export default function DashboardDepartmentsLoading() {
  return (
    <div className="space-y-8 w-full p-2 sm:p-6">
      {/* Dashboard Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EADED2] pb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-56 rounded-xl" />
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
        <Skeleton className="h-11 w-40 rounded-full" />
      </div>

      {/* Dashboard Filter & Action Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <Skeleton className="h-11 w-full max-w-md rounded-full" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-28 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>

      {/* Dashboard Grid/Table Skeletons */}
      <DepartmentSkeleton variant="grid" count={6} />
    </div>
  );
}
