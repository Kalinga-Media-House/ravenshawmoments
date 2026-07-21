import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type DonationCampaign = Database['public']['Tables']['donation_campaigns']['Row'];
export type Donation = Database['public']['Tables']['donations']['Row'];
export type EndowmentFund = Database['public']['Tables']['endowment_funds']['Row'];
export type FundAllocation = Database['public']['Tables']['fund_allocations']['Row'];

export class DonationRepository {
  constructor(private supabase: any) {}

  // Campaigns
  async getCampaigns(options?: { activeOnly?: boolean; limit?: number }) {
    let query = this.supabase.from('donation_campaigns').select('*').order('created_at', { ascending: false });
    
    if (options?.activeOnly) {
      query = query.eq('status', 'active');
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async getCampaignById(id: string) {
    const { data, error } = await this.supabase
      .from('donation_campaigns')
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  // Funds
  async getEndowmentFunds(options?: { activeOnly?: boolean }) {
    let query = this.supabase.from('endowment_funds').select('*').order('created_at', { ascending: false });
    if (options?.activeOnly) {
      query = query.eq('is_active', true);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  // Donations
  async createDonation(donation: Database['public']['Tables']['donations']['Insert']) {
    const { data, error } = await this.supabase
      .from('donations')
      .insert(donation)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async updateDonationStatus(id: string, status: Database['public']['Enums']['donation_status'], paymentRef?: string) {
    const updates: any = { status };
    if (paymentRef) updates.payment_gateway_ref = paymentRef;
    
    const { data, error } = await this.supabase
      .from('donations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  // Generate Receipt Number
  async generateReceiptNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const countResult = await this.supabase
      .from('donations')
      .select('id', { count: 'exact' });
    
    const count = (countResult.count || 0) + 1;
    const formattedCount = count.toString().padStart(6, '0');
    return `RM-${year}-DON-${formattedCount}`;
  }

  // Auditing
  async logAudit(
    entityType: string,
    entityId: string,
    action: string,
    previousState: any,
    newState: any,
    actorId?: string
  ) {
    const { error } = await this.supabase.from('donation_audit_logs').insert({
      entity_type: entityType,
      entity_id: entityId,
      action,
      previous_state: previousState,
      new_state: newState,
      actor_id: actorId
    });
    if (error) {
      console.error('Failed to write audit log', error);
    }
  }

  // Totals update (this would ideally be an RPC, but we can do it via a transaction or direct update for now)
  async incrementCampaignTotals(campaignId: string, amount: number) {
    const campaign = await this.getCampaignById(campaignId);
    if (!campaign) return;

    const { error } = await this.supabase
      .from('donation_campaigns')
      .update({
        raised_amount: (campaign.raised_amount || 0) + amount,
        donor_count: (campaign.donor_count || 0) + 1,
      })
      .eq('id', campaignId);
    
    if (error) throw error;
  }
}
