import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export class OrganizationNoticeRepository {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase as any;
  }

  async getNoticesByOrgId(orgId: string) {
    const { data, error } = await this.supabase
      .from('organization_notices')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async createNotice(payload: Database['public']['Tables']['organization_notices']['Insert']) {
    const { data, error } = await this.supabase
      .from('organization_notices')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateNotice(id: string, payload: Database['public']['Tables']['organization_notices']['Update']) {
    const { data, error } = await this.supabase
      .from('organization_notices')
      .update(payload)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export class OrganizationAchievementRepository {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase as any;
  }

  async getAchievementsByOrgId(orgId: string) {
    const { data, error } = await this.supabase
      .from('organization_achievements')
      .select('*')
      .eq('org_id', orgId)
      .order('date', { ascending: false });
    if (error) throw error;
    return data;
  }

  async createAchievement(payload: Database['public']['Tables']['organization_achievements']['Insert']) {
    const { data, error } = await this.supabase
      .from('organization_achievements')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}

export class OrganizationGalleryRepository {
  private supabase: SupabaseClient<Database>;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase as any;
  }

  async getGalleryByOrgId(orgId: string) {
    const { data, error } = await this.supabase
      .from('organization_gallery')
      .select('*')
      .eq('org_id', orgId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  async createGalleryItem(payload: Database['public']['Tables']['organization_gallery']['Insert']) {
    const { data, error } = await this.supabase
      .from('organization_gallery')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
