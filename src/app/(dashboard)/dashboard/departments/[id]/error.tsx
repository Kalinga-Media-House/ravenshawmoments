// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/departments/[id]/error.tsx
// Purpose   : Error Boundary for Department Dashboard Detail
// =============================================================================

"use client";

import React from "react";
import { DepartmentErrorCard } from "@/features/department/components";

export default function DashboardDepartmentDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="py-8 max-w-xl">
      <DepartmentErrorCard
        title="Failed to load department management hub"
        message={error.message || "An error occurred while loading management details."}
        onRetry={reset}
      />
    </div>
  );
}
