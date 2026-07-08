// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/departments/[id]/students/page.tsx
// Purpose   : Dashboard Student Directory Management Page
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getDepartmentDashboardData } from "@/app/actions/department";
import { StudentGrid, StudentSpotlight, EmptyDepartmentState } from "@/features/department/components";

export const metadata: Metadata = {
  title: "Student Directory Management | Dashboard",
  description: "Verify students, manage batch rolls, and highlight student spotlight leaders.",
};

interface StudentsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardStudentsPage({ params }: StudentsPageProps) {
  const { id } = await params;
  const response = await getDepartmentDashboardData(id);

  if (!response.success || !response.data) {
    return (
      <EmptyDepartmentState
        title="Unable to load student directory"
        description="We couldn't load student records for this department."
      />
    );
  }

  const { students } = response.data;
  const featured = students.filter((s) => s.is_featured);

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={`/dashboard/departments/${id}`} className="hover:text-foreground transition-colors">
          Department Hub
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Students</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Student Directory Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Verify enrolled department students and manage student spotlights.
        </p>
      </div>

      {/* Featured Student Spotlight Section */}
      {featured.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-foreground">Featured Student Spotlights</h2>
          <StudentSpotlight featuredStudents={featured} />
        </section>
      )}

      {/* Directory Grid */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">All Enrolled Students</h2>
        <StudentGrid students={students} />
      </section>
    </div>
  );
}
