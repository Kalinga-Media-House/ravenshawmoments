"use server";

import { createClient } from "@/lib/supabase/server";
import { NetworkingRepository } from "@/repositories/alumni/networking.repository";
import { revalidatePath } from "next/cache";

export async function sendConnectionRequest(requesterId: string, recipientId: string) {
  const supabase = await createClient();
  const repo = new NetworkingRepository(supabase as any);
  await repo.sendRequest(requesterId, recipientId);
  revalidatePath("/alumni");
  revalidatePath("/dashboard/alumni/network");
}

export async function updateConnectionStatus(id: string, recipientId: string, status: "accepted" | "rejected") {
  const supabase = await createClient();
  const repo = new NetworkingRepository(supabase as any);
  await repo.updateRequestStatus(id, recipientId, status);
  revalidatePath("/dashboard/alumni/network");
}
