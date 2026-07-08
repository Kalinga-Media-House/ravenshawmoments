// =============================================================================
// Ravenshaw Moments — Dashboard Hostel Settings
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Hostel Settings | Dashboard",
  description: "Configure hostel profile, verification, facilities, and administration settings.",
};

interface SettingsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardHostelSettingsPage({ params }: SettingsPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href={`/dashboard/hostels/${id}`} className="hover:text-foreground transition-colors">Hostel Hub</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Settings</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Hostel Settings</h1>
        <p className="text-sm text-muted-foreground">Configure hostel profile, logo, cover image, facilities, and administration settings.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Profile Settings</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Edit hostel name, description, history, address, and contact details.</p>
            <Badge variant="secondary" className="mt-3 text-2xs">Super Admin Only</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Verification Status</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Manage hostel verification and sponsored listing status.</p>
            <Badge variant="secondary" className="mt-3 text-2xs">Super Admin Only</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Facilities Management</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Add, edit, or remove hostel amenities and room type configurations.</p>
            <Badge variant="secondary" className="mt-3 text-2xs">Super Admin Only</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">BMC Council</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>Assign Block Management Committee members and permissions.</p>
            <Badge variant="secondary" className="mt-3 text-2xs">Super Admin Only</Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
