// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/departments/[id]/events/page.tsx
// Purpose   : Dashboard Department Events Management Page
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getDepartmentDashboardData } from "@/app/actions/department";
import { UpcomingEvents, EventTimeline, EmptyDepartmentState } from "@/features/department/components";

export const metadata: Metadata = {
  title: "Events Management | Dashboard",
  description: "Schedule seminars, symposiums, and cultural events for your department.",
};

interface EventsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardEventsPage({ params }: EventsPageProps) {
  const { id } = await params;
  const response = await getDepartmentDashboardData(id);

  if (!response.success || !response.data) {
    return (
      <EmptyDepartmentState
        title="Unable to load events"
        description="We couldn't retrieve scheduled department events."
      />
    );
  }

  const { events } = response.data;

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={`/dashboard/departments/${id}`} className="hover:text-foreground transition-colors">
          Department Hub
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Events</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Events Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Schedule and manage academic seminars, guest lectures, and student activities.
        </p>
      </div>

      {/* Grid View */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">All Events Showcase</h2>
        <UpcomingEvents events={events} />
      </section>

      {/* Chronological Timeline */}
      {events.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Event Schedule Timeline</h2>
          <EventTimeline events={events} />
        </section>
      )}
    </div>
  );
}
