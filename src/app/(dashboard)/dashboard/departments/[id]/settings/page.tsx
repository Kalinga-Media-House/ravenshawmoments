// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/departments/[id]/settings/page.tsx
// Purpose   : Dashboard Department Configuration & Settings Page
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DepartmentContactCard } from "@/features/department/components";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Department } from "@/types/department";

export const metadata: Metadata = {
  title: "Department Configuration | Dashboard",
  description: "Configure department office details, contact channels, and verification badge.",
};

interface SettingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardSettingsPage({ params }: SettingsPageProps) {
  const { id } = await params;

  const demoDepartment: Department = {
    id,
    name: "Academic Department",
    slug: "department",
    short_name: "DEPT",
    established_year: 1868,
    office_location: "Ravenshaw Campus East Wing",
    contact_email: "contact@ravenshawmoments.com",
    contact_phone: "+91 671 2410 443",
    is_active: true,
    is_verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={`/dashboard/departments/${id}`} className="hover:text-foreground transition-colors">
          Department Hub
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Settings</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Department Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage department description, vision, office contact information, and verification status.
        </p>
      </div>

      {/* Current Contact Profile Preview */}
      <div className="max-w-2xl space-y-4">
        <h2 className="text-lg font-bold text-foreground">Current Contact Profile</h2>
        <DepartmentContactCard department={demoDepartment} />
      </div>

      {/* Configuration Status Card */}
      <Card className="max-w-2xl rounded-xl border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Administrative Access Policy</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>
            Modifications to official department name, established year, and verification badge require authorization from a Super Admin.
          </p>
          <p>
            Department CRs and HODs may manage circulars, events, student verification, and publications within their scope.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
