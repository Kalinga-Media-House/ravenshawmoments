// =============================================================================
// Ravenshaw Moments — Dashboard Hostel Gallery Management
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HostelEmptyState } from "@/features/hostel/components";

export const metadata: Metadata = {
  title: "Gallery Management | Dashboard",
  description: "Upload and manage hostel photos, historic images, and event memories.",
};

interface GalleryPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardHostelGalleryPage({ params }: GalleryPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={`/dashboard/hostels/${id}`} className="hover:text-foreground transition-colors">Hostel Hub</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Gallery</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Gallery Management</h1>
        <p className="text-sm text-muted-foreground">Upload event photos, historic images, celebrations, and daily life memories.</p>
      </div>

      <HostelEmptyState
        title="No Gallery Items"
        description="Upload hostel photos to build the hostel's visual archive."
      />
    </div>
  );
}
