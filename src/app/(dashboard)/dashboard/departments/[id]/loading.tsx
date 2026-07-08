// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/departments/[id]/loading.tsx
// Purpose   : Loading Skeleton for Department Dashboard Detail
// =============================================================================

import React from "react";
import { DepartmentSkeleton } from "@/features/department/components";

export default function DashboardDepartmentDetailLoading() {
  return (
    <div className="space-y-6">
      <DepartmentSkeleton />
    </div>
  );
}
