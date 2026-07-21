import { SupabaseClient } from '@supabase/supabase-js';
import { OrganizationRepository, OrganizationMembership } from '../../repositories/student/organization.repository';
import { NotFoundError } from '../../lib/errors';

export class OrganizationService {
  private repository: OrganizationRepository;

  constructor(supabase: SupabaseClient) {
    this.repository = new OrganizationRepository({ supabase });
  }

  async getMemberships(profileId: string): Promise<OrganizationMembership[]> {
    return this.repository.findByProfileId(profileId);
  }

  async addMembership(profileId: string, data: any): Promise<OrganizationMembership> {
    return this.repository.addMembership({
      ...data,
      profileId
    });
  }

  async removeMembership(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('Membership not found');
    await this.repository.removeMembership(id);
  }
}
