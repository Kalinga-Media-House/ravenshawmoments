import { Database } from '@/types/database.types';

export type BusinessListing = Database['public']['Tables']['business_listings']['Row'];
export type BusinessCategory = Database['public']['Tables']['business_categories']['Row'];
export type BusinessGallery = Database['public']['Tables']['business_gallery']['Row'];
export type BusinessHour = Database['public']['Tables']['business_hours']['Row'];
export type BusinessReview = Database['public']['Tables']['business_reviews']['Row'];

export class BusinessRepository {
  constructor(private supabase: any) {}

  async getCategories() {
    return this.supabase
      .from('business_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
  }

  async getListings(options?: {
    categoryId?: string;
    categorySlug?: string;
    isFeatured?: boolean;
    verificationStatus?: string;
    limit?: number;
    searchQuery?: string;
  }) {
    let query = this.supabase
      .from('business_listings')
      .select(`
        *,
        category:business_categories(name, slug, icon_name)
      `)
      .eq('status', 'published');

    if (options?.categoryId) query = query.eq('category_id', options.categoryId);
    
    // Quick nested filter if provided via categorySlug (needs rpc or post-filter in some cases if complex, but here we can just join or rely on service layer)
    // For simplicity, if we have categorySlug we can fetch category id first in service.

    if (options?.isFeatured !== undefined) {
      query = query.eq('is_featured', options.isFeatured);
    }
    
    if (options?.verificationStatus) {
      query = query.eq('verification_status', options.verificationStatus);
    }
    
    if (options?.searchQuery) {
      query = query.ilike('name', `%${options.searchQuery}%`);
    }

    if (options?.limit) query = query.limit(options.limit);
    
    // Order by featured and premium first, then by name
    return query.order('is_featured', { ascending: false }).order('is_premium', { ascending: false }).order('name', { ascending: true });
  }

  async getListingBySlug(slug: string) {
    return this.supabase
      .from('business_listings')
      .select(`
        *,
        category:business_categories(*)
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();
  }

  async getBusinessGallery(businessId: string) {
    return this.supabase
      .from('business_gallery')
      .select('*, media:media_files(*)')
      .eq('business_id', businessId)
      .order('display_order', { ascending: true });
  }

  async getBusinessHours(businessId: string) {
    return this.supabase
      .from('business_hours')
      .select('*')
      .eq('business_id', businessId)
      .order('day_of_week', { ascending: true });
  }

  async getBusinessReviews(businessId: string, limit: number = 10) {
    return this.supabase
      .from('business_reviews')
      .select(`
        *,
        reviewer:profiles(first_name, last_name, avatar_url)
      `)
      .eq('business_id', businessId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(limit);
  }

  async createClaim(data: { business_id: string; profile_id: string; proof_text?: string }) {
    return this.supabase
      .from('business_claims')
      .insert({
        business_id: data.business_id,
        profile_id: data.profile_id,
        proof_text: data.proof_text,
        status: 'pending'
      })
      .select()
      .single();
  }

  async trackView(businessId: string) {
    return this.supabase.rpc('track_business_view', { p_business_id: businessId });
    // If RPC doesn't exist, we can gracefully fail or do upsert via service
  }
  
  async upsertAnalytics(businessId: string, metric: 'views_count' | 'phone_clicks' | 'whatsapp_clicks' | 'website_clicks' | 'direction_requests') {
    // In a real app we might use an RPC to atomically increment.
    // For now we will rely on AnalyticsService tracking or basic increment.
    return { success: true };
  }
}
