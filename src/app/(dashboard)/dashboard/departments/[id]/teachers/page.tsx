// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/departments/[id]/teachers/page.tsx
// Purpose   : Dashboard Faculty Roster Management Page
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getDepartmentDashboardData } from "@/app/actions/department";
import { TeacherGrid, EmptyDepartmentState } from "@/features/department/components";

export const metadata: Metadata = {
  title: "Faculty Roster Management | Dashboard",
  description: "Manage department faculty members, designations, and HOD appointments.",
};

interface TeachersPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardTeachersPage({ params }: TeachersPageProps) {
  const { id } = await params;
  const response = await getDepartmentDashboardData(id);

  if (!response.success || !response.data) {
    return (
      <EmptyDepartmentState
        title="Unable to load faculty roster"
        description="We couldn't load faculty records for this department."
      />
    );
  }

  const { teachers } = response.data;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={`/dashboard/departments/${id}`} className="hover:text-foreground transition-colors">
          Department Hub
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Teachers</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Faculty Roster Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage active teaching staff, HOD designation, and display order.
          </p>
        </div>
      </div>

      {/* Roster Grid */}
      <TeacherGrid teachers={teachers} />
    </div>
  );
}
