import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type MockInterviewRow = Database['public']['Tables']['mock_interviews']['Row'];
export type MockInterviewInsert = Database['public']['Tables']['mock_interviews']['Insert'];

export type CareerCounsellingSessionRow = Database['public']['Tables']['career_counselling_sessions']['Row'];
export type CareerCounsellingSessionInsert = Database['public']['Tables']['career_counselling_sessions']['Insert'];

export class CareerServicesRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getMockInterviews(profileId: string, role: 'student' | 'interviewer' = 'student') {
    const filterColumn = role === 'student' ? 'student_profile_id' : 'interviewer_profile_id';
    const { data, error } = await this.supabase
      .from('mock_interviews')
      .select('*, student:profiles!mock_interviews_student_profile_id_fkey(id, full_name, avatar_url), interviewer:profiles!mock_interviews_interviewer_profile_id_fkey(id, full_name, avatar_url)')
      .eq(filterColumn, profileId)
      .order('scheduled_at', { ascending: true });
    
    if (error) throw error;
    return data;
  }

  async createMockInterview(interview: MockInterviewInsert) {
    const { data, error } = await this.supabase
      .from('mock_interviews')
      .insert(interview)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getCounsellingSessions(profileId: string, role: 'student' | 'counselor' = 'student') {
    const filterColumn = role === 'student' ? 'student_profile_id' : 'counselor_profile_id';
    const { data, error } = await this.supabase
      .from('career_counselling_sessions')
      .select('*, student:profiles!career_counselling_sessions_student_profile_id_fkey(id, full_name, avatar_url), counselor:profiles!career_counselling_sessions_counselor_profile_id_fkey(id, full_name, avatar_url)')
      .eq(filterColumn, profileId)
      .order('scheduled_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  async createCounsellingSession(session: CareerCounsellingSessionInsert) {
    const { data, error } = await this.supabase
      .from('career_counselling_sessions')
      .insert(session)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
