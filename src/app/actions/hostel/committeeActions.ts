"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { HostelBmcRepository } from "@/repositories/hostel/hostelBmc.repository";

export async function createCommitteeMemberAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Unauthorized." };

    const repo = new HostelBmcRepository({ supabase: supabase as any });
    const hostelId = formData.get("hostel_id") as string;
    
    await repo.create({
      hostel_id: hostelId,
      profile_id: formData.get("profile_id") as string,
      role_title: formData.get("role") as string,
      is_active: true
    });

    revalidatePath(`/dashboard/hostels/${hostelId}/committee`);
    return { success: true, message: "Committee member added." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function removeCommitteeMemberAction(memberId: string, hostelId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Unauthorized." };

    const repo = new HostelBmcRepository({ supabase: supabase as any });
    await repo.update(memberId, { is_active: false });

    revalidatePath(`/dashboard/hostels/${hostelId}/committee`);
    return { success: true, message: "Member removed." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
