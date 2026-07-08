// =============================================================================
// Ravenshaw Moments
// File      : src/app/departments/error.tsx
// Purpose   : Next.js Error Boundary for Public Departments Directory
// =============================================================================

"use client";

import React from "react";
import { DepartmentErrorCard } from "@/features/department/components";

export default function DepartmentsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container mx-auto px-4 py-12 max-w-xl">
      <DepartmentErrorCard
        title="Failed to load departments"
        message={error.message || "An error occurred while loading academic departments."}
        onRetry={reset}
      />
    </main>
  );
}
