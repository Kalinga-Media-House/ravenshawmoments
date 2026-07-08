// =============================================================================
// Ravenshaw Moments
// File      : src/app/departments/[slug]/error.tsx
// Purpose   : Next.js Error Boundary for Public Department Page
// =============================================================================

"use client";

import React from "react";
import { DepartmentErrorCard } from "@/features/department/components";

export default function DepartmentDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="container mx-auto px-4 py-12 max-w-xl">
      <DepartmentErrorCard
        title="Failed to load department profile"
        message={error.message || "An error occurred while loading this department."}
        onRetry={reset}
      />
    </main>
  );
}
