"use server";

import { createClient } from "@/lib/supabase/server";
import { JobPostingRepository } from "@/repositories/alumni/jobPosting.repository";
import { revalidatePath } from "next/cache";

export async function createJobPosting(data: any) {
  const supabase = await createClient();
  const repo = new JobPostingRepository(supabase as any);
  await repo.createJob(data);
  revalidatePath("/dashboard/alumni/jobs");
  revalidatePath("/alumni/jobs");
}

export async function updateJobPosting(id: string, postedBy: string, data: any) {
  const supabase = await createClient();
  const repo = new JobPostingRepository(supabase as any);
  await repo.updateJob(id, postedBy, data);
  revalidatePath("/dashboard/alumni/jobs");
  revalidatePath("/alumni/jobs");
}

export async function deleteJobPosting(id: string, postedBy: string) {
  const supabase = await createClient();
  const repo = new JobPostingRepository(supabase as any);
  await repo.deleteJob(id, postedBy);
  revalidatePath("/dashboard/alumni/jobs");
  revalidatePath("/alumni/jobs");
}

export async function getActiveJobs(options?: { search?: string; type?: string; location?: string }) {
  const supabase = await createClient();
  const repo = new JobPostingRepository(supabase as any);
  return repo.getActiveJobs(options);
}
