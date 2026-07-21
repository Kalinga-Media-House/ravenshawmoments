'use server';

import { createClient } from '@/lib/supabase/server';
import { OrganizationRepository } from '@/repositories/organization/organization.repository';
import { OrganizationMemberRepository } from '@/repositories/organization/organizationMember.repository';
import { revalidatePath } from 'next/cache';

export async function getPublicOrganizations() {
  const supabase = await createClient();
  const repo = new OrganizationRepository(supabase as any);
  return await repo.getAllOrganizations({ isActive: true, isVerified: true });
}

export async function getOrganizationDetails(slug: string) {
  const supabase = await createClient();
  const repo = new OrganizationRepository(supabase as any);
  return await repo.getOrganizationBySlug(slug);
}

export async function getOrganizationMembers(orgId: string) {
  const supabase = await createClient();
  const repo = new OrganizationMemberRepository(supabase as any);
  return await repo.getMembersByOrgId(orgId);
}

export async function updateOrganization(orgId: string, formData: FormData) {
  const supabase = await createClient();
  const repo = new OrganizationRepository(supabase as any);
  
  const payload = {
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    mission: formData.get('mission') as string,
    vision: formData.get('vision') as string,
    contact_email: formData.get('contact_email') as string,
    contact_phone: formData.get('contact_phone') as string,
  };
  
  await repo.updateOrganization(orgId, payload);
  revalidatePath(`/dashboard/organizations/${orgId}`);
  revalidatePath(`/organizations`);
  return { success: true };
}
