import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HostelMessService } from "@/services/hostel/hostelMess.service";
import Link from "next/link";
import { ChevronRight, Utensils } from "lucide-react";
import { MessMenuClient } from "./MessMenuClient";

export default async function HostelMessPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) redirect("/auth/login");

  // Fetch hostel
  const { data: hostel, error } = await (supabase as any)
    .from("hostels")
    .select("*, hostel_wardens(*), hostel_bmcs(*)")
    .eq("id", params.id)
    .single();

  if (error || !hostel) {
    return <div>Hostel not found.</div>;
  }

  const messService = new HostelMessService({ supabase: supabase as any });
  const weeklyMenu = await messService.getWeeklyMenu(hostel.id);

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/dashboard/hostels/${hostel.id}`} className="hover:text-foreground">{hostel.name} Hub</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Mess Menu</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
          <Utensils className="w-6 h-6 mr-3 text-rose-700" /> Mess Management
        </h1>
        <p className="text-sm text-muted-foreground">Configure the weekly meal schedule for {hostel.name}.</p>
      </div>

      <MessMenuClient hostelId={hostel.id} initialMenu={weeklyMenu} />
    </div>
  );
}
