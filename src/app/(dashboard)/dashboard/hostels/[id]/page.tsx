import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Users, Calendar, Image, Bell, Settings, Building2, Utensils, ShieldAlert, BedDouble } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Hostel Hub | Dashboard",
  description: "Hostel administration overview — residents, rooms, mess, complaints, and settings.",
};

interface HostelHubPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardHostelHubPage({ params }: HostelHubPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) redirect("/auth/login");

  // Fetch hostel details and current occupancy
  const { data: hostel, error } = await (supabase as any).from("hostels")
    .select("*, hostel_wardens(*), hostel_bmcs(*)")
    .eq("id", id)
    .single();

  if (error || !hostel) {
    return <div>Hostel not found.</div>;
  }

  // Fetch quick metrics
  const { count: activeComplaints } = await (supabase as any).from("hostel_complaints")
    .select("*", { count: "exact", head: true })
    .eq("hostel_id", id)
    .in("status", ["open", "in_progress"]);

  const { count: pendingVisitors } = await (supabase as any).from("hostel_visitors")
    .select("*", { count: "exact", head: true })
    .eq("hostel_id", id)
    .eq("status", "pending");

  const quickLinks = [
    { label: "Rooms & Allocations", icon: BedDouble, href: `/dashboard/hostels/${id}/rooms` },
    { label: "Mess Menu", icon: Utensils, href: `/dashboard/hostels/${id}/mess` },
    { label: "Complaints", icon: ShieldAlert, href: `/dashboard/hostels/${id}/complaints` },
    { label: "Visitors", icon: Users, href: `/dashboard/hostels/${id}/visitors` },
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
        <span className="font-medium text-foreground">{hostel.name} Hub</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {hostel.name} Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage rooms, residents, mess, complaints, and general settings.
          </p>
        </div>
        <div>
           <Link href={`/dashboard/hostels/${id}/rooms`} className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 transition-colors">
              <BedDouble className="w-4 h-4 mr-2" /> Allocate Room
           </Link>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Occupancy</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{hostel.current_occupancy || 0} / {hostel.capacity || 0}</div>
            <p className="text-xs text-muted-foreground">Residents Checked In</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Active Complaints</h3>
            <ShieldAlert className="h-4 w-4 text-rose-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{activeComplaints || 0}</div>
            <p className="text-xs text-muted-foreground">Open or In Progress</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Pending Visitors</h3>
            <Users className="h-4 w-4 text-blue-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{pendingVisitors || 0}</div>
            <p className="text-xs text-muted-foreground">Awaiting Approval</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium">Hostel Status</h3>
            <Building2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">{hostel.is_active ? "Active" : "Closed"}</div>
            <p className="text-xs text-muted-foreground">Operations State</p>
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-foreground">Operations</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
