import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HostelBmcRepository } from "@/repositories/hostel/hostelBmc.repository";
import { CommitteeClient } from "./CommitteeClient";
import Link from "next/link";
import { ChevronRight, Shield } from "lucide-react";

export default async function CommitteePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) redirect("/auth/login");

  const { data: hostel } = await (supabase as any).from("hostels").select("*").eq("id", params.id).single();
  if (!hostel) return <div>Hostel not found.</div>;

  const repo = new HostelBmcRepository({ supabase: supabase as any });
  const members = await repo.getBmcMembersByHostelId(hostel.id);

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/dashboard/hostels/${hostel.id}`} className="hover:text-foreground">{hostel.name} Hub</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Committee (BMC)</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
          <Shield className="w-6 h-6 mr-3 text-orange-500" /> Committee Management
        </h1>
      </div>

      <CommitteeClient hostelId={hostel.id} initialMembers={members} />
    </div>
  );
}
