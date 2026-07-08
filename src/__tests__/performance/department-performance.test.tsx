// =============================================================================
// Ravenshaw Moments
// File      : src/__tests__/performance/department-performance.test.tsx
// Purpose   : Performance Benchmarking Tests for Department Data Processing
// =============================================================================

import { describe, it, expect } from "vitest";

describe("Department Module Performance Benchmarks", () => {
  it("should transform large faculty rosters (500+ items) in under 15ms", () => {
    const rawTeachers = Array.from({ length: 500 }, (_, i) => ({
      id: `teacher-${i}`,
      designation_title: i === 0 ? "Professor & HOD" : "Assistant Professor",
      is_hod: i === 0,
      display_order: i,
    }));

    const startTime = performance.now();
    const hod = rawTeachers.find((t) => t.is_hod);
    const sortedRoster = [...rawTeachers].sort((a, b) => a.display_order - b.display_order);
    const endTime = performance.now();

    const durationMs = endTime - startTime;
    expect(hod?.id).toBe("teacher-0");
    expect(sortedRoster).toHaveLength(500);
    expect(durationMs).toBeLessThan(15);
  });

  it("should filter student spotlight records from 1000 enrolled students in under 15ms", () => {
    const rawStudents = Array.from({ length: 1000 }, (_, i) => ({
      id: `stud-${i}`,
      roll_number: `RM-2023-CS-${i}`,
      is_featured: i < 10,
    }));

    const startTime = performance.now();
    const spotlightStudents = rawStudents.filter((s) => s.is_featured);
    const endTime = performance.now();

    const durationMs = endTime - startTime;
    expect(spotlightStudents).toHaveLength(10);
    expect(durationMs).toBeLessThan(15);
  });
});
