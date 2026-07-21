"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { HostelComplaintRepository } from "@/repositories/hostel/hostelComplaint.repository";

export async function createComplaintAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized." };
    }

    const hostelId = formData.get("hostel_id") as string;
    const category = formData.get("category") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;

    const repo = new HostelComplaintRepository({ supabase: supabase as any });
    
    await repo.create({
      hostel_id: hostelId,
      profile_id: user.id,
      category,
      title,
      description,
      priority,
      status: "open"
    });

    revalidatePath(`/dashboard/student/hostel`);
    revalidatePath(`/dashboard/hostels/${hostelId}/complaints`);

    return { success: true, message: "Complaint raised successfully." };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to raise complaint." };
  }
}

export async function updateComplaintStatusAction(complaintId: string, status: string, hostelId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized." };
    }

    const repo = new HostelComplaintRepository({ supabase: supabase as any });
    await repo.update(complaintId, { 
      status,
      ...(status === 'resolved' ? { resolved_at: new Date().toISOString() } : {})
    });

    revalidatePath(`/dashboard/hostels/${hostelId}/complaints`);
    return { success: true, message: "Status updated." };
  } catch (error: any) {
    return { success: false, message: error.message || "Failed to update status." };
  }
}
