import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export class OrganizationAttendanceRepository {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase as any;
  }

  async getSessions(orgId: string) {
    const { data, error } = await this.supabase
      .from('organization_attendance_sessions')
      .select('*')
      .eq('org_id', orgId)
      .order('session_date', { ascending: false });
    if (error) throw error;
    return data;
  }

  async createSession(payload: Database['public']['Tables']['organization_attendance_sessions']['Insert']) {
    const { data, error } = await this.supabase
      .from('organization_attendance_sessions')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getRecords(sessionId: string) {
    const { data, error } = await this.supabase
      .from('organization_attendance_records')
      .select('*, profiles(full_name, email)')
      .eq('session_id', sessionId);
    if (error) throw error;
    return data;
  }

  async markAttendance(payload: Database['public']['Tables']['organization_attendance_records']['Insert'][]) {
    const { data, error } = await this.supabase
      .from('organization_attendance_records')
      .upsert(payload, { onConflict: 'session_id,profile_id' })
      .select();
    if (error) throw error;
    return data;
  }
}
