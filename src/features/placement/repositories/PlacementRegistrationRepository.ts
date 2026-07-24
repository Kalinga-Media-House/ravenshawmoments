import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type PlacementRegistrationRow = Database['public']['Tables']['placement_registrations']['Row'];
export type PlacementRegistrationInsert = Database['public']['Tables']['placement_registrations']['Insert'];
export type PlacementRegistrationUpdate = Database['public']['Tables']['placement_registrations']['Update'];

export interface GetPlacementRegistrationsOptions {
  driveId?: string;
  profileId?: string;
  status?: PlacementRegistrationRow['status'];
  limit?: number;
  offset?: number;
}

export class PlacementRegistrationRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getRegistrations(options: GetPlacementRegistrationsOptions = {}) {
    let query = this.supabase
      .from('placement_registrations')
      .select(`
        *,
        drive:placement_drives(*, company:companies(*)),
        profile:profiles(id, public_id, first_name, last_name, username),
        resume:student_resumes(id, media_id, title, media_files(*))
      `, { count: 'exact' });

    if (options.driveId) {
      query = query.eq('drive_id', options.driveId);
    }
    if (options.profileId) {
      query = query.eq('profile_id', options.profileId);
    }
    if (options.status) {
      query = query.eq('status', options.status);
    }

    query = query.order('applied_at', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { registrations: data, count };
  }

  async getRegistrationById(id: string) {
    const { data, error } = await this.supabase
      .from('placement_registrations')
      .select(`
        *,
        drive:placement_drives(*, company:companies(*)),
        profile:profiles(id, public_id, first_name, last_name, username),
        resume:student_resumes(id, media_id, title, media_files(*))
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getRegistrationByUserAndDrive(profileId: string, driveId: string) {
    const { data, error } = await this.supabase
      .from('placement_registrations')
      .select('*')
      .eq('profile_id', profileId)
      .eq('drive_id', driveId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createRegistration(registration: PlacementRegistrationInsert) {
    const { data, error } = await this.supabase
      .from('placement_registrations')
      .insert(registration)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateRegistration(id: string, updates: PlacementRegistrationUpdate) {
    const { data, error } = await this.supabase
      .from('placement_registrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
