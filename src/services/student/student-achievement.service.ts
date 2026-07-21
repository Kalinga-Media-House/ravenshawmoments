import { SupabaseClient } from '@supabase/supabase-js';
import { StudentAchievementRepository, Achievement } from '../../repositories/student/student-achievement.repository';
import { NotFoundError } from '../../lib/errors';

export class StudentAchievementService {
  private repository: StudentAchievementRepository;

  constructor(supabase: SupabaseClient) {
    this.repository = new StudentAchievementRepository({ supabase });
  }

  async getAchievements(profileId: string): Promise<Achievement[]> {
    return this.repository.findByProfileId(profileId);
  }

  async getByCategory(profileId: string, category: string): Promise<Achievement[]> {
    return this.repository.findByCategory(profileId, category);
  }

  async addAchievement(profileId: string, data: any): Promise<Achievement> {
    return this.repository.create({
      ...data,
      profileId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async updateAchievement(id: string, data: any): Promise<Achievement> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('Achievement not found');
    return this.repository.update(id, { ...data, updatedAt: new Date().toISOString() });
  }

  async deleteAchievement(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('Achievement not found');
    await this.repository.delete(id);
  }
}
