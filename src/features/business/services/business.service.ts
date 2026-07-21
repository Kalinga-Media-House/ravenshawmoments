import { BusinessRepository } from '../repositories/business.repository';

export class BusinessService {
  constructor(private repo: BusinessRepository) {}

  async getCategories() {
    const { data, error } = await this.repo.getCategories();
    if (error) throw error;
    
    // Group parent and children if needed, or just return flat list
    return data;
  }

  async getListings(options?: {
    categorySlug?: string;
    isFeatured?: boolean;
    limit?: number;
    searchQuery?: string;
  }) {
    let categoryId: string | undefined;
    
    if (options?.categorySlug) {
      const categories = await this.getCategories();
      const cat = categories.find((c: any) => c.slug === options.categorySlug);
      if (cat) categoryId = cat.id;
    }

    const { data, error } = await this.repo.getListings({
      ...options,
      categoryId
    });
    
    if (error) throw error;
    return data;
  }

  async getBusinessProfile(slug: string) {
    const { data: business, error } = await this.repo.getListingBySlug(slug);
    if (error || !business) throw new Error('Business not found');

    const [galleryRes, hoursRes, reviewsRes] = await Promise.all([
      this.repo.getBusinessGallery(business.id),
      this.repo.getBusinessHours(business.id),
      this.repo.getBusinessReviews(business.id, 5)
    ]);

    return {
      business,
      gallery: galleryRes.data || [],
      hours: hoursRes.data || [],
      reviews: reviewsRes.data || []
    };
  }

  async submitClaim(businessId: string, profileId: string, proofText?: string) {
    const { data, error } = await this.repo.createClaim({ business_id: businessId, profile_id: profileId, proof_text: proofText });
    if (error) {
      if (error.code === '23505') throw new Error('You have already submitted a claim for this business.');
      throw error;
    }
    
    // TODO: Trigger Notification to Admin for review
    
    return data;
  }

  async trackClick(businessId: string, type: 'phone' | 'whatsapp' | 'website' | 'direction') {
    const metricMap = {
      phone: 'phone_clicks',
      whatsapp: 'whatsapp_clicks',
      website: 'website_clicks',
      direction: 'direction_requests'
    } as const;
    
    await this.repo.upsertAnalytics(businessId, metricMap[type]);
    return { success: true };
  }
}
