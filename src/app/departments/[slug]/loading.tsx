// =============================================================================
// Ravenshaw Moments
// File      : src/app/departments/[slug]/loading.tsx
// Purpose   : Next.js Loading Skeleton for Public Department Page
// =============================================================================

import React from "react";
import { DepartmentSkeleton } from "@/features/department/components";

export default function DepartmentDetailLoading() {
  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <DepartmentSkeleton />
    </main>
  );
}
