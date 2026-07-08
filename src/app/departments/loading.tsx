// =============================================================================
// Ravenshaw Moments
// File      : src/app/departments/loading.tsx
// Purpose   : Next.js Loading Skeleton for Public Departments Directory
// =============================================================================

import React from "react";
import { DepartmentSkeleton } from "@/features/department/components";

export default function DepartmentsLoading() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <div className="h-8 w-64 rounded-md bg-muted animate-pulse" />
        <div className="h-4 w-96 rounded-md bg-muted animate-pulse" />
      </div>
      <DepartmentSkeleton />
    </main>
  );
}
