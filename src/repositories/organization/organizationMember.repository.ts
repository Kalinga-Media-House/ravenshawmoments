import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export class OrganizationMemberRepository {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase as any;
  }

  async getMembersByOrgId(orgId: string) {
    const { data, error } = await this.supabase
      .from('organization_members')
      .select('*, profiles(full_name, email)')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }
  
  async getAdvisorsByOrgId(orgId: string) {
    const { data, error } = await this.supabase
      .from('organization_advisors')
      .select('*')
      .eq('org_id', orgId)
      .order('start_date', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getMemberByProfile(orgId: string, profileId: string) {
    const { data, error } = await this.supabase
      .from('organization_members')
      .select('*')
      .eq('org_id', orgId)
      .eq('profile_id', profileId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async addMember(payload: Database['public']['Tables']['organization_members']['Insert']) {
    const { data, error } = await this.supabase
      .from('organization_members')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateMember(id: string, payload: Database['public']['Tables']['organization_members']['Update']) {
    const { data, error } = await this.supabase
      .from('organization_members')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
