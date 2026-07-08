// =============================================================================
// Ravenshaw Moments — Dashboard Hostel Notices Management
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HostelEmptyState } from "@/features/hostel/components";

export const metadata: Metadata = {
  title: "Notices Management | Dashboard",
  description: "Publish and manage hostel circulars, announcements, and notices.",
};

interface NoticesPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardHostelNoticesPage({ params }: NoticesPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={`/dashboard/hostels/${id}`} className="hover:text-foreground transition-colors">Hostel Hub</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Notices</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Notices Management</h1>
        <p className="text-sm text-muted-foreground">Publish hostel circulars, announcements, and priority bulletins.</p>
      </div>

      <HostelEmptyState
        title="No Notices Published"
        description="Hostel notices and circulars will appear here once published by BMC or administration."
      />
    </div>
  );
}
