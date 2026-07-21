import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type Sponsor = Database['public']['Tables']['sponsors']['Row'];
export type Sponsorship = Database['public']['Tables']['sponsorships']['Row'];

export class SponsorRepository {
  constructor(private supabase: any) {}

  async getSponsors(options?: { activeOnly?: boolean; limit?: number }) {
    let query = this.supabase.from('sponsors').select('*').order('priority_order', { ascending: false });
    
    if (options?.activeOnly) {
      query = query.eq('is_active', true);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getSponsorshipsForEntity(entityType: Database['public']['Enums']['entity_type'], entityId: string) {
    const { data, error } = await this.supabase
      .from('sponsorships')
      .select('*, sponsor:sponsor_id(*)')
      .eq('sponsored_entity_type', entityType)
      .eq('sponsored_entity_id', entityId)
      .eq('is_active', true);
      
    if (error) throw error;
    return data;
  }

  async createSponsor(sponsor: Database['public']['Tables']['sponsors']['Insert']) {
    const { data, error } = await this.supabase
      .from('sponsors')
      .insert(sponsor)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async createSponsorship(sponsorship: Database['public']['Tables']['sponsorships']['Insert']) {
    const { data, error } = await this.supabase
      .from('sponsorships')
      .insert(sponsorship)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
