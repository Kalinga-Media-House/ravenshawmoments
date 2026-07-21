import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { HostelRoomService } from "@/services/hostel/hostelRoom.service";
import Link from "next/link";
import { ChevronRight, Bed, User } from "lucide-react";
import { RoomAllocationClient } from "./RoomAllocationClient";

export default async function HostelRoomsPage({ params }: { params: { id: string } }) {
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

  const roomService = new HostelRoomService({ supabase: supabase as any });
  const roomsWithBeds = await roomService.getRoomsWithBeds(hostel.id);
  
  // Fetch active allocations to enrich beds
  const { data: activeAllocations } = await (supabase as any)
    .from("hostel_room_allocations")
    .select("*, profile:profile_id(*)")
    .eq("hostel_id", hostel.id)
    .eq("status", "active");

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={`/dashboard/hostels/${hostel.id}`} className="hover:text-foreground">{hostel.name} Hub</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="font-medium text-foreground">Room Allocations</span>
      </nav>

      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Room Management</h1>
        <p className="text-sm text-muted-foreground">View and allocate beds to residents.</p>
      </div>

      <RoomAllocationClient 
        hostelId={hostel.id} 
        rooms={roomsWithBeds} 
        allocations={activeAllocations || []} 
      />
    </div>
  );
}
