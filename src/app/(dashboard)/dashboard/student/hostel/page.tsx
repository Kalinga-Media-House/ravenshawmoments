import React from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { HostelComplaintRepository } from "@/repositories/hostel/hostelComplaint.repository";
import { HostelVisitorRepository } from "@/repositories/hostel/hostelVisitor.repository";
import { StudentHostelClient } from "./StudentHostelClient";

export default async function StudentHostelPage() {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) redirect("/auth/login");

  // Get active allocation to find their hostel
  const { data: allocations } = await (supabase as any)
    .from("hostel_room_allocations")
    .select("*, hostel:hostel_id(*)")
    .eq("profile_id", user.user.id)
    .eq("status", "active");

  const allocation = allocations?.[0];

  if (!allocation) {
    return (
      <div className="p-8 text-center text-gray-500">
        You are not currently allocated to any hostel room.
      </div>
    );
  }

  const hostel = allocation.hostel;

  const complaintRepo = new HostelComplaintRepository({ supabase: supabase as any });
  const myComplaints = await complaintRepo.getComplaintsByProfileId(user.user.id);

  const visitorRepo = new HostelVisitorRepository({ supabase: supabase as any });
  const myVisitors = await visitorRepo.getVisitorsByProfileId(user.user.id);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Hostel Portal ({hostel.name})</h1>
      <p className="text-sm text-gray-500">Manage your complaints and visitors.</p>

      <StudentHostelClient 
        hostelId={hostel.id} 
        initialComplaints={myComplaints} 
        initialVisitors={myVisitors} 
      />
    </div>
  );
}
