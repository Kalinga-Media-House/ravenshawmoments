import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export class OrganizationRepository {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase as any;
  }

  async getAllOrganizations(filters?: { isActive?: boolean, isVerified?: boolean }) {
    let query = this.supabase.from('organizations').select('*');
    
    if (filters?.isActive !== undefined) query = query.eq('is_active', filters.isActive);
    if (filters?.isVerified !== undefined) query = query.eq('is_verified', filters.isVerified);
    
    const { data, error } = await query.order('name');
    if (error) throw error;
    return data;
  }

  async getOrganizationById(id: string) {
    const { data, error } = await this.supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async getOrganizationBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('organizations')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) throw error;
    return data;
  }

  async createOrganization(payload: Database['public']['Tables']['organizations']['Insert']) {
    const { data, error } = await this.supabase
      .from('organizations')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateOrganization(id: string, payload: Database['public']['Tables']['organizations']['Update']) {
    const { data, error } = await this.supabase
      .from('organizations')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
