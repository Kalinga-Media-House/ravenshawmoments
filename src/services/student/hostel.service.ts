import { SupabaseClient } from '@supabase/supabase-js';
import { HostelRepository, HostelAssignment } from '../../repositories/student/hostel.repository';

export class HostelService {
  private repository: HostelRepository;

  constructor(supabase: SupabaseClient) {
    this.repository = new HostelRepository({ supabase });
  }

  async getCurrentHostel(profileId: string): Promise<HostelAssignment | null> {
    return this.repository.getCurrentAssignment(profileId);
  }

  async getHostelHistory(profileId: string): Promise<HostelAssignment[]> {
    return this.repository.getHistory(profileId);
  }
}
