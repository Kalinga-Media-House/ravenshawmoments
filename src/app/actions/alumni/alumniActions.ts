"use server";

import { createClient } from "@/lib/supabase/server";
import { AlumniProfileRepository } from "@/repositories/alumni/alumniProfile.repository";
import { revalidatePath } from "next/cache";

export async function getVerifiedAlumni(options?: { search?: string; departmentId?: string; batchId?: string; industry?: string }) {
  const supabase = await createClient();
  const repo = new AlumniProfileRepository(supabase as any);
  return repo.getVerifiedProfiles(options);
}

export async function getPendingAlumni() {
  const supabase = await createClient();
  const repo = new AlumniProfileRepository(supabase as any);
  return repo.getPendingProfiles();
}

export async function verifyAlumni(profileId: string, status: "pending" | "verified" | "rejected") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const repo = new AlumniProfileRepository(supabase as any);
  await repo.updateVerificationStatus(profileId, status, user.id);
  revalidatePath("/dashboard/admin/alumni/verification");
}

export async function upsertAlumniProfile(data: any) {
  const supabase = await createClient();
  const repo = new AlumniProfileRepository(supabase as any);
  await repo.upsertProfile(data);
  revalidatePath("/dashboard/alumni/profile");
}

export async function addAlumniEmployment(data: any) {
  const supabase = await createClient();
  const repo = new AlumniProfileRepository(supabase as any);
  await repo.addEmployment(data);
  revalidatePath("/dashboard/alumni/profile");
}

export async function deleteAlumniEmployment(id: string, alumniId: string) {
  const supabase = await createClient();
  const repo = new AlumniProfileRepository(supabase as any);
  await repo.deleteEmployment(id, alumniId);
  revalidatePath("/dashboard/alumni/profile");
}

export async function addAlumniEducation(data: any) {
  const supabase = await createClient();
  const repo = new AlumniProfileRepository(supabase as any);
  await repo.addEducation(data);
  revalidatePath("/dashboard/alumni/profile");
}

export async function deleteAlumniEducation(id: string, alumniId: string) {
  const supabase = await createClient();
  const repo = new AlumniProfileRepository(supabase as any);
  await repo.deleteEducation(id, alumniId);
  revalidatePath("/dashboard/alumni/profile");
}
