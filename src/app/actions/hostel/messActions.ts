"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { HostelMessService } from "@/services/hostel/hostelMess.service";

export async function updateMessMenuAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, message: "Unauthorized." };
    }

    const hostelId = formData.get("hostel_id") as string;
    const dayOfWeek = parseInt(formData.get("day_of_week") as string, 10);
    const mealType = formData.get("meal_type") as string;
    const items = formData.get("items") as string;

    if (!hostelId || isNaN(dayOfWeek) || !mealType || !items) {
      return { success: false, message: "Missing required fields." };
    }

    const messService = new HostelMessService({ supabase: supabase as any });
    await messService.updateMenu(hostelId, dayOfWeek, mealType, items);

    revalidatePath(`/dashboard/hostels/${hostelId}/mess`);

    return { success: true, message: "Menu updated successfully." };
  } catch (error: any) {
    console.error("updateMessMenuAction Error:", error);
    return { success: false, message: error.message || "Failed to update menu." };
  }
}
