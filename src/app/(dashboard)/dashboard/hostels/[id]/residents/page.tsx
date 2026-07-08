// =============================================================================
// Ravenshaw Moments — Dashboard Hostel Residents Management
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { listHostelResidents } from "@/app/actions/hostel";
import { HostelResidentGrid, HostelEmptyState } from "@/features/hostel/components";

export const metadata: Metadata = {
  title: "Residents Management | Dashboard",
  description: "Manage hostel residents and alumni records.",
};

interface ResidentsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardResidentsPage({ params }: ResidentsPageProps) {
  const { id } = await params;
  const response = await listHostelResidents(id, false, 1, 50);
  const residents = response.success && response.data ? response.data.residents : [];

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={`/dashboard/hostels/${id}`} className="hover:text-foreground transition-colors">Hostel Hub</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Residents</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Residents Management</h1>
        <p className="text-sm text-muted-foreground">View and manage current hostel residents and alumni records.</p>
      </div>

      {residents.length > 0 ? (
        <HostelResidentGrid residents={residents} />
      ) : (
        <HostelEmptyState title="No Residents Recorded" description="Verified resident records will appear here once assigned." />
      )}
    </div>
  );
}
