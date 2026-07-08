// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/departments/[id]/notices/page.tsx
// Purpose   : Dashboard Department Notices & Circulars Management Page
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getDepartmentDashboardData } from "@/app/actions/department";
import { NoticeList, EmptyDepartmentState } from "@/features/department/components";

export const metadata: Metadata = {
  title: "Notices Management | Dashboard",
  description: "Publish circulars, announcements, and examination schedules.",
};

interface NoticesPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardNoticesPage({ params }: NoticesPageProps) {
  const { id } = await params;
  const response = await getDepartmentDashboardData(id);

  if (!response.success || !response.data) {
    return (
      <EmptyDepartmentState
        title="Unable to load notices"
        description="We couldn't retrieve department circulars."
      />
    );
  }

  const { notices } = response.data;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={`/dashboard/departments/${id}`} className="hover:text-foreground transition-colors">
          Department Hub
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Notices</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Notices & Circulars Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage announcements, pinned notices, and circular downloads.
        </p>
      </div>

      {/* Notice List */}
      <NoticeList notices={notices} />
    </div>
  );
}
