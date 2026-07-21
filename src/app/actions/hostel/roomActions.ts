"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { HostelRoomService } from "@/services/hostel/hostelRoom.service";

export async function allocateBedAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized." };
    }

    const hostelId = formData.get("hostel_id") as string;
    const roomId = formData.get("room_id") as string;
    const bedId = formData.get("bed_id") as string;
    const profileId = formData.get("profile_id") as string;

    if (!hostelId || !roomId || !bedId || !profileId) {
      return { success: false, message: "Missing required fields." };
    }

    // Initialize Service (dependency injected with context)
    const roomService = new HostelRoomService({ supabase: supabase as any });

    await roomService.allocateBed(hostelId, roomId, bedId, profileId);

    revalidatePath(`/dashboard/hostels/${hostelId}`);
    revalidatePath(`/dashboard/hostels/${hostelId}/rooms`);

    return { success: true, message: "Bed allocated successfully." };
  } catch (error: any) {
    console.error("allocateBedAction Error:", error);
    return { success: false, message: error.message || "Failed to allocate bed." };
  }
}

export async function deallocateBedAction(allocationId: string, hostelId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized." };
    }

    const roomService = new HostelRoomService({ supabase: supabase as any });
    await roomService.deallocateBed(allocationId);

    revalidatePath(`/dashboard/hostels/${hostelId}`);
    revalidatePath(`/dashboard/hostels/${hostelId}/rooms`);

    return { success: true, message: "Bed deallocated successfully." };
  } catch (error: any) {
    console.error("deallocateBedAction Error:", error);
    return { success: false, message: error.message || "Failed to deallocate bed." };
  }
}
