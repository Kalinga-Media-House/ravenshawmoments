export const revalidate = 3600;
// =============================================================================
// Ravenshaw Moments
// File      : src/app/departments/page.tsx
// Purpose   : Public Academic Departments Directory Page
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ChevronRight, BadgeCheck } from "lucide-react";
import { listPublicDepartments } from "@/app/actions/department";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyDepartmentState } from "@/features/department/components";

export const metadata: Metadata = {
  title: "Academic Departments | Ravenshaw Moments",
  description: "Explore verified academic departments, faculty, student leaders, and notices at Ravenshaw University.",
  alternates: {
    canonical: "/departments",
  },
};

export default async function DepartmentsDirectoryPage() {
  const response = await listPublicDepartments(100, 0);
  const departments = (response.success && response.data) ? response.data : [];

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Departments</span>
      </nav>

      {/* Page Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Academic Departments
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          Directory of verified academic departments at Ravenshaw University. Select a department to explore faculty rosters, notices, upcoming events, and publications.
        </p>
      </header>

      {/* Departments Grid */}
      {departments.length === 0 ? (
        <EmptyDepartmentState
          title="No Departments Listed"
          description="Verified academic departments will appear here once published."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <Link key={dept.id} href={`/departments/${dept.slug}`} className="group block">
              <Card className="h-full rounded-xl border border-border bg-card shadow-xs transition-all group-hover:border-primary/50 group-hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      <span>{dept.name}</span>
                      {dept.is_verified && (
                        <BadgeCheck className="h-5 w-5 text-primary shrink-0" aria-label="Verified" />
                      )}
                    </CardTitle>
                    {dept.short_name && (
                      <Badge variant="secondary" className="font-mono text-xs">
                        {dept.short_name}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p className="line-clamp-2">
                    {dept.description || "Explore department faculty, announcements, and events."}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" />
                      <span>{dept.office_location || "Campus Office"}</span>
                    </span>

                    <span className="font-medium text-primary group-hover:underline">
                      Explore Department &rarr;
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
