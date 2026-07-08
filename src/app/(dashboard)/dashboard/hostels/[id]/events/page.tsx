// =============================================================================
// Ravenshaw Moments — Dashboard Hostel Events Management
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HostelEmptyState } from "@/features/hostel/components";

export const metadata: Metadata = {
  title: "Events Management | Dashboard",
  description: "Schedule and manage hostel cultural events, fests, and annual functions.",
};

interface EventsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardHostelEventsPage({ params }: EventsPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={`/dashboard/hostels/${id}`} className="hover:text-foreground transition-colors">Hostel Hub</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Events</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Events Management</h1>
        <p className="text-sm text-muted-foreground">Schedule hostel day, pujas, cultural nights, and sports events.</p>
      </div>

      <HostelEmptyState
        title="No Events Scheduled"
        description="Upcoming hostel events will appear here once published by the BMC council."
      />
    </div>
  );
}
