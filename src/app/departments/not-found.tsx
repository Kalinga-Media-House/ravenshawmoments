// =============================================================================
// Ravenshaw Moments
// File      : src/app/departments/not-found.tsx
// Purpose   : Next.js 404 Not Found Boundary for Departments Directory
// =============================================================================

import React from "react";
import Link from "next/link";
import { EmptyDepartmentState } from "@/features/department/components";

export default function DepartmentsNotFound() {
  return (
    <main className="container mx-auto px-4 py-12 max-w-xl">
      <EmptyDepartmentState
        title="Departments Not Found"
        description="The requested department directory or resource could not be found."
        action={
          <Link
            href="/"
            className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Return to Homepage
          </Link>
        }
      />
    </main>
  );
}
