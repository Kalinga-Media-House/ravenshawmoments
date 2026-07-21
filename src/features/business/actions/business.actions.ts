'use server';

import { createClient } from '@/lib/supabase/server';
import { BusinessRepository } from '../repositories/business.repository';
import { BusinessService } from '../services/business.service';

async function getServices() {
  const supabase = await createClient();
  const repo = new BusinessRepository(supabase);
  const service = new BusinessService(repo);
  return { supabase, service };
}

export async function getBusinessCategoriesAction() {
  try {
    const { service } = await getServices();
    const categories = await service.getCategories();
    return { success: true, data: categories };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getBusinessListingsAction(options?: {
  categorySlug?: string;
  isFeatured?: boolean;
  limit?: number;
  searchQuery?: string;
}) {
  try {
    const { service } = await getServices();
    const listings = await service.getListings(options);
    return { success: true, data: listings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getBusinessProfileAction(slug: string) {
  try {
    const { service } = await getServices();
    const profile = await service.getBusinessProfile(slug);
    return { success: true, data: profile };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

import { canCreateBusiness } from '@/lib/utils/permissions';

export async function submitBusinessClaimAction(businessId: string, proofText?: string) {
  try {
    const { supabase, service } = await getServices();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Assuming we have profile record via user ID
    const { data: profileData } = await supabase
      .from('profiles')
      .select('id, profile_status, is_verified')
      .or(`auth_user_id.eq.${user.id},id.eq.${user.id}`)
      .single();
    const profile: any = profileData;
    if (!profile) throw new Error('Profile not found');

    if (!canCreateBusiness(profile)) {
      throw new Error(`Profile verification required (${profile?.profile_status ? profile.profile_status.toUpperCase() : 'UNVERIFIED'}). Only verified profiles can claim or list businesses.`);
    }

    const result = await service.submitClaim(businessId, (profile as any).id, proofText);
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function trackBusinessClickAction(businessId: string, type: 'phone' | 'whatsapp' | 'website' | 'direction') {
  try {
    const { service } = await getServices();
    await service.trackClick(businessId, type);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
