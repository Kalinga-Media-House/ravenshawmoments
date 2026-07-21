'use server';

import { createClient } from '@/lib/supabase/server';
import { PlacementDriveService } from '../services/PlacementDriveService';
import { PlacementRegistrationService } from '../services/PlacementRegistrationService';
import { StudentCareerService } from '../services/StudentCareerService';
import { revalidatePath } from 'next/cache';

export async function getSessionProfile() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, profile_type, full_name, avatar_url')
    .eq('auth_user_id', session.user.id)
    .single();

  return profile as any;
}

export async function applyForPlacementDriveAction(driveId: string, resumeId?: string) {
  try {
    const supabase = await createClient();
    const profile = await getSessionProfile();
    if (!profile) throw new Error('Not authenticated');

    const service = new PlacementRegistrationService(supabase as any);
    await service.applyForDrive({
      drive_id: driveId,
      profile_id: profile.id,
      resume_id: resumeId || null,
      status: 'applied'
    });

    revalidatePath('/dashboard/student/placements');
    revalidatePath(`/placements/drives/${driveId}`);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addStudentSkillAction(skillName: string, proficiency: string) {
  try {
    const supabase = await createClient();
    const profile = await getSessionProfile();
    if (!profile) throw new Error('Not authenticated');

    const service = new StudentCareerService(supabase as any);
    await service.addSkill({
      profile_id: profile.id,
      skill_name: skillName,
      proficiency: proficiency
    });

    revalidatePath('/dashboard/student/profile');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function addStudentExperienceAction(experience: any) {
    try {
      const supabase = await createClient();
      const profile = await getSessionProfile();
      if (!profile) throw new Error('Not authenticated');
  
      const service = new StudentCareerService(supabase as any);
      await service.addExperience({
        ...experience,
        profile_id: profile.id
      });
  
      revalidatePath('/dashboard/student/profile');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
}
  
export async function addStudentProjectAction(project: any) {
    try {
      const supabase = await createClient();
      const profile = await getSessionProfile();
      if (!profile) throw new Error('Not authenticated');
  
      const service = new StudentCareerService(supabase as any);
      await service.addProject({
        ...project,
        profile_id: profile.id
      });
  
      revalidatePath('/dashboard/student/profile');
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
}

export async function createDriveAction(drive: any, departmentIds: string[] = []) {
  try {
    const supabase = await createClient();
    const service = new PlacementDriveService(supabase as any);
    await service.createDrive(drive, departmentIds);
    revalidatePath('/dashboard/admin/placements');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateDriveAction(id: string, updates: any, departmentIds?: string[]) {
  try {
    const supabase = await createClient();
    const service = new PlacementDriveService(supabase as any);
    await service.updateDrive(id, updates, departmentIds);
    revalidatePath('/dashboard/admin/placements');
    revalidatePath(`/dashboard/admin/placements/drives/${id}`);
    revalidatePath('/dashboard/recruiter');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getRegistrationsAction(options?: any) {
  try {
    const supabase = await createClient();
    const service = new PlacementRegistrationService(supabase as any);
    const data = await service.getRegistrations(options);
    return { success: true, data };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateRegistrationStatusAction(id: string, status: any) {
  try {
    const supabase = await createClient();
    const service = new PlacementRegistrationService(supabase as any);
    await service.updateRegistrationStatus(id, status);
    revalidatePath('/dashboard/recruiter');
    revalidatePath('/dashboard/student/placements');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
