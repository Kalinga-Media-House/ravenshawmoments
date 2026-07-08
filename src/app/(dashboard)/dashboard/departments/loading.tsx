// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/departments/loading.tsx
// Purpose   : Loading Skeleton for Department Management Dashboard
// =============================================================================

import React from "react";
import { DepartmentSkeleton } from "@/features/department/components";

export default function DashboardDepartmentsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-8 w-48 rounded-md bg-muted animate-pulse" />
      <DepartmentSkeleton />
    </div>
  );
}
