import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export class OrganizationRecruitmentRepository {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase as any;
  }

  async getCampaigns(orgId: string) {
    const { data, error } = await this.supabase
      .from('organization_recruitment_campaigns')
      .select('*')
      .eq('org_id', orgId)
      .order('open_date', { ascending: false });
    if (error) throw error;
    return data;
  }

  async createCampaign(payload: Database['public']['Tables']['organization_recruitment_campaigns']['Insert']) {
    const { data, error } = await this.supabase
      .from('organization_recruitment_campaigns')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateCampaign(id: string, payload: Database['public']['Tables']['organization_recruitment_campaigns']['Update']) {
    const { data, error } = await this.supabase
      .from('organization_recruitment_campaigns')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async getApplications(campaignId: string) {
    const { data, error } = await this.supabase
      .from('organization_recruitment_applications')
      .select('*, profiles(full_name, email)')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getApplicationByProfile(campaignId: string, profileId: string) {
    const { data, error } = await this.supabase
      .from('organization_recruitment_applications')
      .select('*')
      .eq('campaign_id', campaignId)
      .eq('profile_id', profileId)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async submitApplication(payload: Database['public']['Tables']['organization_recruitment_applications']['Insert']) {
    const { data, error } = await this.supabase
      .from('organization_recruitment_applications')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateApplication(id: string, payload: Database['public']['Tables']['organization_recruitment_applications']['Update']) {
    const { data, error } = await this.supabase
      .from('organization_recruitment_applications')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
