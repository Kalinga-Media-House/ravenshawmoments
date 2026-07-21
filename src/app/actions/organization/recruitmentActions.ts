'use server';

import { createClient } from '@/lib/supabase/server';
import { OrganizationRecruitmentRepository } from '@/repositories/organization/organizationRecruitment.repository';
import { revalidatePath } from 'next/cache';

export async function getCampaigns(orgId: string) {
  const supabase = await createClient();
  const repo = new OrganizationRecruitmentRepository(supabase as any);
  return await repo.getCampaigns(orgId);
}

export async function createCampaign(orgId: string, formData: FormData) {
  const supabase = await createClient();
  const repo = new OrganizationRecruitmentRepository(supabase as any);
  
  const payload = {
    org_id: orgId,
    title: formData.get('title') as string,
    description: formData.get('description') as string,
    open_date: formData.get('open_date') as string,
    close_date: formData.get('close_date') as string,
    status: formData.get('status') as 'draft' | 'open' | 'closed',
    eligibility_criteria: formData.get('eligibility_criteria') as string,
  };
  
  await repo.createCampaign(payload);
  revalidatePath(`/dashboard/organizations/${orgId}`);
  return { success: true };
}

export async function submitApplication(campaignId: string, profileId: string, applicationData: any) {
  const supabase = await createClient();
  const repo = new OrganizationRecruitmentRepository(supabase as any);
  
  await repo.submitApplication({
    campaign_id: campaignId,
    profile_id: profileId,
    application_data: applicationData,
    status: 'applied'
  });
  revalidatePath(`/dashboard/profile/organizations`);
  return { success: true };
}
