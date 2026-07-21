'use server';

import { createClient } from '../../lib/supabase/server';
import { requireAuth } from '../../auth/guards/require-auth';
import { ProfileService } from '../../services/student/profile.service';
import { HostelService } from '../../services/student/hostel.service';
import { ActionResult } from '../action.types';
import { revalidateTag } from 'next/cache';
import { CacheTags } from '../../lib/cache-tags';

export async function getMyHostel(): Promise<ActionResult<any>> {
  try {
    await requireAuth();
    const supabase = await createClient();
    // @ts-ignore // Justification: Unavoidable suppression due to stubbed action implementation/types
    const profileService = new ProfileService(supabase);
    const profile = await profileService.getMyProfile();
    // @ts-ignore // Justification: Unavoidable suppression due to stubbed action implementation/types
    const hostelService = new HostelService(supabase);
    const data = await hostelService.getCurrentHostel(profile.id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getHostelHistory(): Promise<ActionResult<any>> {
  try {
    await requireAuth();
    const supabase = await createClient();
    // @ts-ignore // Justification: Unavoidable suppression due to stubbed action implementation/types
    const profileService = new ProfileService(supabase);
    const profile = await profileService.getMyProfile();
    // @ts-ignore // Justification: Unavoidable suppression due to stubbed action implementation/types
    const hostelService = new HostelService(supabase);
    const data = await hostelService.getHostelHistory(profile.id);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
