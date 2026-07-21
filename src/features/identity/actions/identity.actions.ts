'use server';

import { createClient } from '@/lib/supabase/server';
import { IdentityVerificationService } from '../services/IdentityVerificationService';
import { IdentityRepository } from '../repositories/IdentityRepository';
import { IdentityCardService } from '../services/IdentityCardService';
import { DeviceRepository } from '../repositories/DeviceRepository';
import { revalidatePath } from 'next/cache';

export async function requestVerification(identityType: string, documents: any[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await IdentityVerificationService.submitRequest(user.id, identityType, documents);
  revalidatePath('/identity');
  return { success: true };
}

export async function approveIdentity(requestId: string, profileId: string, identityType: string, identityNumber: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await IdentityVerificationService.approveRequest(requestId, user.id, profileId, identityType, identityNumber);
  revalidatePath('/dashboard/identity/verifications');
  return { success: true };
}

export async function rejectIdentity(requestId: string, notes: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await IdentityVerificationService.rejectRequest(requestId, user.id, notes);
  revalidatePath('/dashboard/identity/verifications');
  return { success: true };
}

export async function getMyIdentity() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    return await IdentityRepository.getIdentityByProfileId(user.id);
  } catch (err) {
    return null;
  }
}

export async function getMyCard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  try {
    return await IdentityCardService.getUserCard(user.id);
  } catch (err) {
    return null;
  }
}

export async function getMyDevices() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  try {
    return await DeviceRepository.getUserDevices(user.id);
  } catch (err) {
    return [];
  }
}

export async function removeMyDevice(deviceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await DeviceRepository.removeDevice(deviceId, user.id);
  revalidatePath('/identity/devices');
  return { success: true };
}

export async function getVerificationQueue() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  
  try {
    return await IdentityRepository.getVerificationRequests('pending');
  } catch (err) {
    return [];
  }
}
