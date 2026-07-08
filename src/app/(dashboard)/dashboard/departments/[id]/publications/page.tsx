// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/departments/[id]/publications/page.tsx
// Purpose   : Dashboard Research & Publications Management Page
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getDepartmentDashboardData } from "@/app/actions/department";
import { PublicationList, EmptyDepartmentState } from "@/features/department/components";

export const metadata: Metadata = {
  title: "Publications Management | Dashboard",
  description: "Manage annual journals, newsletters, syllabus documents, and research archives.",
};

interface PublicationsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardPublicationsPage({ params }: PublicationsPageProps) {
  const { id } = await params;
  const response = await getDepartmentDashboardData(id);

  if (!response.success || !response.data) {
    return (
      <EmptyDepartmentState
        title="Unable to load publications"
        description="We couldn't retrieve department publications."
      />
    );
  }

  const { publications } = response.data;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={`/dashboard/departments/${id}`} className="hover:text-foreground transition-colors">
          Department Hub
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Publications</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Research Publications & Archives
        </h1>
        <p className="text-sm text-muted-foreground">
          Upload and manage annual magazines, research digests, and course syllabus files.
        </p>
      </div>

      {/* Publications Grid */}
      <PublicationList publications={publications} />
    </div>
  );
}
