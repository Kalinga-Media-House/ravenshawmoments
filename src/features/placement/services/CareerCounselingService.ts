import { CareerServicesRepository, MockInterviewInsert, CareerCounsellingSessionInsert } from '../repositories/CareerServicesRepository';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export class CareerCounselingService {
  private repository: CareerServicesRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new CareerServicesRepository(supabase);
  }

  async getMockInterviews(profileId: string, role: 'student' | 'interviewer' = 'student') {
    return this.repository.getMockInterviews(profileId, role);
  }

  async bookMockInterview(interview: MockInterviewInsert) {
    return this.repository.createMockInterview(interview);
  }

  async getCounsellingSessions(profileId: string, role: 'student' | 'counselor' = 'student') {
    return this.repository.getCounsellingSessions(profileId, role);
  }

  async bookCounsellingSession(session: CareerCounsellingSessionInsert) {
    return this.repository.createCounsellingSession(session);
  }
}
