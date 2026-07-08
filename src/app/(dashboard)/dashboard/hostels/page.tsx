// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/hostels/page.tsx
// Purpose   : Dashboard Hostels Management Directory
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Building2, BadgeCheck, Settings } from "lucide-react";
import { listPublicHostels } from "@/app/actions/hostel";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HostelEmptyState } from "@/features/hostel/components";

export const metadata: Metadata = {
  title: "Hostels Dashboard | Ravenshaw Moments",
  description: "Manage university hostels, residents, and BMC operations.",
};

export default async function DashboardHostelsPage() {
  const response = await listPublicHostels(undefined, 1, 100);
  const hostels =
    response.success && response.data ? response.data.hostels : [];

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link
          href="/dashboard"
          className="hover:text-foreground transition-colors"
        >
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Hostels</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Hostel Administration
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage hostels, wardens, BMC council, and resident records.
          </p>
        </div>
      </div>

      {/* Grid */}
      {hostels.length === 0 ? (
        <HostelEmptyState
          title="No Hostels Configured"
          description="University and sponsored hostels will appear here once created by an administrator."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hostels.map((hostel) => (
            <Card
              key={hostel.id}
              className="h-full rounded-xl border border-border bg-card shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="flex items-center gap-2 text-base font-bold text-foreground">
                    <Building2 className="h-4 w-4 text-primary shrink-0" />
                    <span>{hostel.name}</span>
                    {hostel.is_verified && (
                      <BadgeCheck
                        className="h-4 w-4 text-primary shrink-0"
                        aria-label="Verified"
                      />
                    )}
                  </CardTitle>
                  <Badge variant="outline" className="text-2xs capitalize">
                    {hostel.hostel_type.replace(/_/g, " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p className="line-clamp-2">
                  {hostel.description || "Manage this hostel's operations."}
                </p>
                <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                  <Link
                    href={`/dashboard/hostels/${hostel.id}`}
                    className="flex-1 inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-background px-2.5 h-7 text-[0.8rem] font-medium hover:bg-muted hover:text-foreground transition-all"
                  >
                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                    Manage
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
