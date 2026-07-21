import { SupabaseClient } from '@supabase/supabase-js';
import { EducationRepository, Education } from '../../repositories/student/education.repository';
import { NotFoundError } from '../../lib/errors';

export class EducationService {
  private repository: EducationRepository;

  constructor(supabase: SupabaseClient) {
    this.repository = new EducationRepository({ supabase });
  }

  async getEducationHistory(profileId: string): Promise<Education[]> {
    return this.repository.findByProfileId(profileId);
  }

  async addEducation(profileId: string, data: any): Promise<Education> {
    return this.repository.addEducation(profileId, data);
  }

  async updateEducation(id: string, data: any): Promise<Education> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('Education record not found');
    return this.repository.updateEducation(id, data);
  }

  async deleteEducation(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('Education record not found');
    await this.repository.deleteEducation(id);
  }
}
