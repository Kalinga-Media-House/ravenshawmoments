"use server";

import { createClient } from "@/lib/supabase/server";
import { MentorshipRepository } from "@/repositories/alumni/mentorship.repository";
import { revalidatePath } from "next/cache";

export async function upsertMentorshipProfile(data: any) {
  const supabase = await createClient();
  const repo = new MentorshipRepository(supabase as any);
  await repo.upsertProfile(data);
  revalidatePath("/dashboard/alumni/mentorship");
  revalidatePath("/dashboard/profile/mentorship");
}

export async function getMentors(options?: { search?: string; expertise?: string }) {
  const supabase = await createClient();
  const repo = new MentorshipRepository(supabase as any);
  return repo.getMentors(options);
}

export async function createMentorshipRequest(data: any) {
  const supabase = await createClient();
  const repo = new MentorshipRepository(supabase as any);
  await repo.createRequest(data);
  revalidatePath("/dashboard/profile/mentorship");
}

export async function updateMentorshipRequestStatus(id: string, mentorId: string, status: "accepted" | "rejected" | "completed" | "cancelled") {
  const supabase = await createClient();
  const repo = new MentorshipRepository(supabase as any);
  await repo.updateRequestStatus(id, mentorId, status);
  revalidatePath("/dashboard/alumni/mentorship");
}

export async function createMentorshipSession(data: any) {
  const supabase = await createClient();
  const repo = new MentorshipRepository(supabase as any);
  await repo.createSession(data);
  revalidatePath("/dashboard/alumni/mentorship");
  revalidatePath("/dashboard/profile/mentorship");
}
