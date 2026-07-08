// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/departments/[id]/gallery/page.tsx
// Purpose   : Dashboard Department Photo & Media Gallery Management Page
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DepartmentGallery } from "@/features/department/components";

export const metadata: Metadata = {
  title: "Gallery Management | Dashboard",
  description: "Manage department event albums, photos, and campus memories.",
};

interface GalleryPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardGalleryPage({ params }: GalleryPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={`/dashboard/departments/${id}`} className="hover:text-foreground transition-colors">
          Department Hub
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Gallery</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Gallery & Album Management
        </h1>
        <p className="text-sm text-muted-foreground">
          Curate academic symposium albums, student celebrations, and campus photography.
        </p>
      </div>

      {/* Gallery Showcase */}
      <DepartmentGallery items={[]} title="Managed Media Albums" />
    </div>
  );
}
