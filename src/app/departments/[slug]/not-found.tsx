// =============================================================================
// Ravenshaw Moments
// File      : src/app/departments/[slug]/not-found.tsx
// Purpose   : Next.js 404 Not Found Boundary for Public Department Page
// =============================================================================

import React from "react";
import Link from "next/link";
import { EmptyDepartmentState } from "@/features/department/components";

export default function DepartmentDetailNotFound() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-xl">
      <EmptyDepartmentState
        title="Department Not Found"
        description="We couldn't find an academic department matching this URL slug."
        action={
          <Link
            href="/departments"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Back to Departments
          </Link>
        }
      />
    </main>
  );
}
