// =============================================================================
// Ravenshaw Moments
// File      : src/app/(dashboard)/dashboard/hostels/[id]/page.tsx
// Purpose   : Dashboard Hostel Hub — Overview & Quick Links
// =============================================================================

import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Users, Calendar, Image, Bell, Settings } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Hostel Hub | Dashboard",
  description: "Hostel administration overview — residents, events, notices, gallery, and settings.",
};

interface HostelHubPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardHostelHubPage({ params }: HostelHubPageProps) {
  const { id } = await params;


  const quickLinks = [
    { label: "Residents", icon: Users, href: `/dashboard/hostels/${id}/residents` },
    { label: "Events", icon: Calendar, href: `/dashboard/hostels/${id}/events` },
    { label: "Gallery", icon: Image, href: `/dashboard/hostels/${id}/gallery` },
    { label: "Notices", icon: Bell, href: `/dashboard/hostels/${id}/notices` },
    { label: "Settings", icon: Settings, href: `/dashboard/hostels/${id}/settings` },
  ];

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-xs text-muted-foreground"
      >
        <Link href="/dashboard" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/dashboard/hostels" className="hover:text-foreground transition-colors">
          Hostels
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Hostel Hub</span>
      </nav>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Hostel Management Hub
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage residents, council, events, notices, and hostel settings.
        </p>
      </div>

      {/* Quick Links Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Operations</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {quickLinks.map((link) => (
            <Link key={link.label} href={link.href} className="group block">
              <Card className="h-full transition-all group-hover:border-primary/50 group-hover:shadow-md">
                <CardContent className="flex flex-col items-center justify-center p-6 gap-3 text-center">
                  <link.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {link.label}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
