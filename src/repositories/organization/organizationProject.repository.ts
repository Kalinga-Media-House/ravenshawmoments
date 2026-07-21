import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export class OrganizationProjectRepository {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase as any;
  }

  async getProjectsByOrgId(orgId: string) {
    const { data, error } = await this.supabase
      .from('organization_projects')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async getProjectById(id: string) {
    const { data, error } = await this.supabase
      .from('organization_projects')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async createProject(payload: Database['public']['Tables']['organization_projects']['Insert']) {
    const { data, error } = await this.supabase
      .from('organization_projects')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateProject(id: string, payload: Database['public']['Tables']['organization_projects']['Update']) {
    const { data, error } = await this.supabase
      .from('organization_projects')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
