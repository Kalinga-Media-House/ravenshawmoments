// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/departments/error.tsx
// Purpose   : Error Boundary for Department Management Dashboard
// =============================================================================

"use client";

import React from "react";
import { DepartmentErrorCard } from "@/features/department/components";

export default function DashboardDepartmentsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-8 max-w-xl">
      <DepartmentErrorCard
        title="Failed to load department dashboard"
        message={error.message || "Unable to load managed departments."}
        onRetry={reset}
      />
    </div>
  );
}
