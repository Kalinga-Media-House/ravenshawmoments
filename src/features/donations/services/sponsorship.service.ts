import { SponsorRepository } from '../repositories/sponsor.repository';
import { Database } from '@/types/database.types';

export class SponsorshipService {
  constructor(private repository: SponsorRepository) {}

  async onboardSponsor(params: {
    name: string;
    description?: string;
    sponsorType: Database['public']['Enums']['sponsor_type'];
    websiteUrl?: string;
    contactEmail?: string;
    logoMediaId?: string;
  }) {
    return await this.repository.createSponsor({
      name: params.name,
      description: params.description,
      sponsor_type: params.sponsorType,
      website_url: params.websiteUrl,
      contact_email: params.contactEmail,
      logo_media_id: params.logoMediaId,
      is_active: true,
      priority_order: 0
    });
  }

  async attachSponsorshipToEntity(params: {
    sponsorId: string;
    entityType: Database['public']['Enums']['entity_type'];
    entityId: string;
    tier: Database['public']['Enums']['sponsorship_tier'];
    amount?: number;
    benefits?: string[];
    startDate?: string;
    endDate?: string;
  }) {
    return await this.repository.createSponsorship({
      sponsor_id: params.sponsorId,
      sponsored_entity_type: params.entityType,
      sponsored_entity_id: params.entityId,
      tier: params.tier,
      amount: params.amount,
      benefits: params.benefits,
      start_date: params.startDate,
      end_date: params.endDate,
      is_active: true
    });
  }
}
