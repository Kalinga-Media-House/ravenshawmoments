'use server';

import { createClient } from '@/lib/supabase/server';
import { OrganizationAttendanceRepository } from '@/repositories/organization/organizationAttendance.repository';
import { revalidatePath } from 'next/cache';

export async function getSessions(orgId: string) {
  const supabase = await createClient();
  const repo = new OrganizationAttendanceRepository(supabase as any);
  return await repo.getSessions(orgId);
}

export async function createSession(orgId: string, formData: FormData) {
  const supabase = await createClient();
  const repo = new OrganizationAttendanceRepository(supabase as any);
  
  const payload = {
    org_id: orgId,
    title: formData.get('title') as string,
    session_date: formData.get('session_date') as string,
    hours_awarded: Number(formData.get('hours_awarded') || 1),
  };
  
  await repo.createSession(payload);
  revalidatePath(`/dashboard/organizations/${orgId}`);
  return { success: true };
}
