import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HostelInventoryRepository } from "@/repositories/hostel/hostelInventory.repository";
import { InventoryClient } from "./InventoryClient";
import Link from "next/link";
import { ChevronRight, Archive } from "lucide-react";

export default async function InventoryPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) redirect("/auth/login");

  const { data: hostel } = await (supabase as any).from("hostels").select("*").eq("id", params.id).single();
  if (!hostel) return <div>Hostel not found.</div>;

  const repo = new HostelInventoryRepository({ supabase: supabase as any });
  const items = await repo.getInventoryByHostelId(hostel.id);

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/dashboard/hostels/${hostel.id}`} className="hover:text-foreground">{hostel.name} Hub</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Inventory</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center">
          <Archive className="w-6 h-6 mr-3 text-cyan-500" /> Inventory Management
        </h1>
      </div>

      <InventoryClient hostelId={hostel.id} initialItems={items} />
    </div>
  );
}
