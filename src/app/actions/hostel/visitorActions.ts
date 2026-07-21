"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { HostelVisitorRepository } from "@/repositories/hostel/hostelVisitor.repository";

export async function createVisitorAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Unauthorized." };

    const repo = new HostelVisitorRepository({ supabase: supabase as any });
    await repo.create({
      hostel_id: formData.get("hostel_id") as string,
      host_profile_id: user.id,
      visitor_name: formData.get("visitor_name") as string,
      visitor_contact: formData.get("visitor_contact") as string,
      purpose: formData.get("purpose") as string,
      expected_arrival: formData.get("expected_arrival") ? new Date(formData.get("expected_arrival") as string).toISOString() : null,
      status: "pending"
    });

    revalidatePath(`/dashboard/student/hostel`);
    return { success: true, message: "Visitor request submitted." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateVisitorStatusAction(visitorId: string, status: string, hostelId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Unauthorized." };

    const repo = new HostelVisitorRepository({ supabase: supabase as any });
    const payload: any = { status };
    if (status === 'approved') payload.approved_by = user.id;
    if (status === 'checked_in') payload.check_in_time = new Date().toISOString();
    if (status === 'checked_out') payload.check_out_time = new Date().toISOString();

    await repo.update(visitorId, payload);
    revalidatePath(`/dashboard/hostels/${hostelId}/visitors`);
    return { success: true, message: "Status updated." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
