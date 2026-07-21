"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { HostelInventoryRepository } from "@/repositories/hostel/hostelInventory.repository";

export async function createInventoryAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Unauthorized." };

    const repo = new HostelInventoryRepository({ supabase: supabase as any });
    const hostelId = formData.get("hostel_id") as string;
    
    await repo.create({
      hostel_id: hostelId,
      item_name: formData.get("item_name") as string,
      quantity: parseInt(formData.get("quantity") as string, 10),
      condition: formData.get("condition") as string || "good",
      location: formData.get("location") as string
    });

    revalidatePath(`/dashboard/hostels/${hostelId}/inventory`);
    return { success: true, message: "Inventory item added." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateInventoryAction(itemId: string, formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Unauthorized." };

    const repo = new HostelInventoryRepository({ supabase: supabase as any });
    const hostelId = formData.get("hostel_id") as string;
    
    await repo.update(itemId, {
      item_name: formData.get("item_name") as string,
      quantity: parseInt(formData.get("quantity") as string, 10),
      condition: formData.get("condition") as string || "good",
      location: formData.get("location") as string
    });

    revalidatePath(`/dashboard/hostels/${hostelId}/inventory`);
    return { success: true, message: "Inventory item updated." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
