"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { HostelNoticeRepository } from "@/repositories/hostel/hostelNotice.repository";

export async function createNoticeAction(formData: FormData) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Unauthorized." };

    const repo = new HostelNoticeRepository({ supabase: supabase as any });
    const hostelId = formData.get("hostel_id") as string;
    
    await repo.create({
      hostel_id: hostelId,
      
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      is_pinned: formData.get("is_pinned") === "true",
      priority: formData.get("priority") as string || "normal",
      is_published: formData.get("status") === "published"
    });

    revalidatePath(`/dashboard/hostels/${hostelId}/notices`);
    return { success: true, message: "Notice created successfully." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deleteNoticeAction(noticeId: string, hostelId: string) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { success: false, message: "Unauthorized." };

    const repo = new HostelNoticeRepository({ supabase: supabase as any });
    await repo.delete(noticeId);

    revalidatePath(`/dashboard/hostels/${hostelId}/notices`);
    return { success: true, message: "Notice deleted." };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
