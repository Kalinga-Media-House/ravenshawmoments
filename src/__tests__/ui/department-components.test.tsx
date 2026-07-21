// =============================================================================
// Ravenshaw Moments
// File      : src/__tests__/ui/department-components.test.tsx
// Purpose   : UI Component Tests for Department Reusable Components
// =============================================================================

import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  EmptyDepartmentState,
  DepartmentErrorCard,
  DepartmentSkeleton,
} from "@/features/department/components";

describe("Department UI Component Rendering Tests", () => {
  it("EmptyDepartmentState renders title and descriptive feedback", () => {
    render(
      <EmptyDepartmentState
        title="No Faculty Members"
        description="Faculty records have not been published yet."
      />
    );
    expect(screen.getByText("No Faculty Members")).toBeDefined();
    expect(screen.getByText("Faculty records have not been published yet.")).toBeDefined();
  });

  it("DepartmentErrorCard renders error alert box with ARIA role", () => {
    render(
      <DepartmentErrorCard
        title="Load Error"
        message="Unable to fetch department schedule."
      />
    );
    expect(screen.getByRole("alert")).toBeDefined();
    expect(screen.getByText("Load Error")).toBeDefined();
    expect(screen.getByText("Unable to fetch department schedule.")).toBeDefined();
  });

  it("DepartmentSkeleton renders animated pulse container", () => {
    const { container } = render(<DepartmentSkeleton />);
    const skeletonEl = container.querySelector('[data-slot="skeleton"], .animate-shimmer, .animate-pulse');
    expect(skeletonEl).not.toBeNull();
  });
});
