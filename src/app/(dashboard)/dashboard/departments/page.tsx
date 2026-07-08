// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/departments/page.tsx
// Purpose   : Department Management Portal Index Page
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Building2, Settings, Users, FileText } from "lucide-react";
import { listPublicDepartments } from "@/app/actions/department";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyDepartmentState } from "@/features/department/components";

export const metadata: Metadata = {
  title: "Department Management | Dashboard",
  description: "Manage academic departments, faculty rosters, student directories, circulars, and events.",
};

export default async function DashboardDepartmentsPage() {
  const response = await listPublicDepartments(100, 0);
  const departments = (response.success && response.data) ? response.data : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Department Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Select an academic department to manage rosters, notices, events, and configuration.
          </p>
        </div>
      </div>

      {/* Departments Grid */}
      {departments.length === 0 ? (
        <EmptyDepartmentState
          title="No Departments Assigned"
          description="You do not have active management permissions for any department yet."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Card key={dept.id} className="flex flex-col justify-between rounded-xl border border-border bg-card shadow-xs">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg font-bold text-foreground">
                    {dept.name}
                  </CardTitle>
                  <Badge variant={dept.is_verified ? "default" : "secondary"}>
                    {dept.is_verified ? "Verified" : "Pending"}
                  </Badge>
                </div>
                {dept.short_name && (
                  <p className="font-mono text-xs text-muted-foreground">{dept.short_name}</p>
                )}
              </CardHeader>

              <CardContent className="space-y-4 pt-0">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {dept.description || "Manage department configuration and rosters."}
                </p>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
                  <Link
                    href={`/dashboard/departments/${dept.id}`}
                    className="flex items-center gap-1.5 rounded-md bg-secondary/80 px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    <span>Overview</span>
                  </Link>
                  <Link
                    href={`/dashboard/departments/${dept.id}/teachers`}
                    className="flex items-center gap-1.5 rounded-md bg-secondary/80 px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    <Users className="h-3.5 w-3.5 text-primary" />
                    <span>Teachers</span>
                  </Link>
                  <Link
                    href={`/dashboard/departments/${dept.id}/notices`}
                    className="flex items-center gap-1.5 rounded-md bg-secondary/80 px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    <span>Notices</span>
                  </Link>
                  <Link
                    href={`/dashboard/departments/${dept.id}/settings`}
                    className="flex items-center gap-1.5 rounded-md bg-secondary/80 px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                  >
                    <Settings className="h-3.5 w-3.5 text-primary" />
                    <span>Settings</span>
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
