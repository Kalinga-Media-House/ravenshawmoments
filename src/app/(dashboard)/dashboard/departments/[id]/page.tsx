// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/departments/[id]/page.tsx
// Purpose   : Department Management Hub / Overview Page
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Users, GraduationCap, FileText, Calendar, Image as ImageIcon, BookOpen, Settings } from "lucide-react";
import { getDepartmentDashboardData } from "@/app/actions/department";
import {
  DepartmentStats,
  CurrentCRCard,
  NoticeList,
  UpcomingEvents,
  EmptyDepartmentState,
} from "@/features/department/components";
import { Card } from "@/components/ui/card";

interface DashboardDepartmentPageProps {
  params: Promise<{ id: string }>;
}

export const metadata: Metadata = {
  title: "Department Overview | Dashboard",
  description: "Manage department faculty, student directory, notices, and events.",
};

export default async function DashboardDepartmentOverviewPage({ params }: DashboardDepartmentPageProps) {
  const { id } = await params;
  const response = await getDepartmentDashboardData(id);

  if (!response.success || !response.data) {
    return (
      <EmptyDepartmentState
        title="Unable to load department hub"
        description="We couldn't retrieve department management data or you lack permissions."
      />
    );
  }

  const { teachers, students, crs, notices, events, publications } = response.data;
  const activeCR = crs.find((c) => c.is_active) || crs[0];

  const statsObj = {
    department_id: id,
    department_name: "Academic Department",
    department_slug: "department",
    is_active: true,
    is_verified: true,
    total_students: students.length,
    total_teachers: teachers.length,
    total_crs: crs.length,
    total_events: events.length,
    total_notices: notices.length,
    total_publications: publications.length,
    total_gallery_albums: 0,
    total_achievements: 0,
  };

  return (
    <div className="space-y-8">
      {/* Navigation Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/dashboard/departments" className="hover:text-foreground transition-colors">
          Departments
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Management Hub</span>
      </nav>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Department Management Hub
        </h1>
        <p className="text-sm text-muted-foreground">
          Quick summary and administrative tools for your department ecosystem.
        </p>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-7">
        {[
          { label: "Teachers", href: `/dashboard/departments/${id}/teachers`, icon: Users, count: teachers.length },
          { label: "Students", href: `/dashboard/departments/${id}/students`, icon: GraduationCap, count: students.length },
          { label: "Notices", href: `/dashboard/departments/${id}/notices`, icon: FileText, count: notices.length },
          { label: "Events", href: `/dashboard/departments/${id}/events`, icon: Calendar, count: events.length },
          { label: "Gallery", href: `/dashboard/departments/${id}/gallery`, icon: ImageIcon, count: 0 },
          { label: "Publications", href: `/dashboard/departments/${id}/publications`, icon: BookOpen, count: publications.length },
          { label: "Settings", href: `/dashboard/departments/${id}/settings`, icon: Settings },
        ].map((item) => (
          <Link key={item.label} href={item.href} className="group block">
            <Card className="h-full rounded-xl border border-border bg-card p-4 shadow-xs transition-all hover:border-primary/50 hover:shadow-md">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <item.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-foreground">{item.label}</span>
                {item.count !== undefined && (
                  <span className="text-xs font-mono text-muted-foreground">({item.count})</span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Key Metrics */}
      <section aria-labelledby="mgmt-stats">
        <DepartmentStats stats={statsObj} />
      </section>

      {/* Active CR & Quick Circulars */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Current Class Representative</h2>
          {activeCR ? (
            <CurrentCRCard currentCR={activeCR} />
          ) : (
            <Card className="p-6 text-center text-sm text-muted-foreground rounded-xl border border-border">
              No active CR assigned.
            </Card>
          )}
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-foreground">Recent Circulars & Notices</h2>
          <NoticeList notices={notices.slice(0, 3)} />
        </div>
      </div>

      {/* Upcoming Scheduled Events */}
      <section aria-labelledby="mgmt-events" className="space-y-4">
        <h2 id="mgmt-events" className="text-lg font-bold text-foreground">
          Scheduled Events
        </h2>
        <UpcomingEvents events={events.slice(0, 3)} />
      </section>
    </div>
  );
}
