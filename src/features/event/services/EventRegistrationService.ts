import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { EventRegistrationRepository, EventRegistrationInsert, EventRegistrationUpdate } from '../repositories/EventRegistrationRepository';
import { createClient } from '@/lib/supabase/server';

export class EventRegistrationService {
  private repository: EventRegistrationRepository;

  constructor(supabase?: SupabaseClient<Database>) {
    if (supabase) {
      this.repository = new EventRegistrationRepository(supabase);
    } else {
      throw new Error("SupabaseClient must be provided to EventRegistrationService");
    }
  }

  static async create() {
    const supabase = await createClient();
    return new EventRegistrationService(supabase as any);
  }

  async getRegistrations(eventId: string) {
    return this.repository.getRegistrationsByEventId(eventId);
  }

  async registerForEvent(eventId: string, profileId: string, metadata?: any) {
    // Check if already registered
    const existing = await this.repository.getRegistration(eventId, profileId);
    if (existing) {
      throw new Error("Already registered for this event.");
    }

    return this.repository.createRegistration({
      event_id: eventId,
      profile_id: profileId,
      status: 'pending', // could depend on event settings (auto-approve vs pending)
      metadata: metadata || {}
    });
  }

  async updateStatus(registrationId: string, status: 'approved' | 'rejected' | 'waitlisted' | 'cancelled') {
    return this.repository.updateRegistration(registrationId, { status });
  }

  async cancelRegistration(eventId: string, profileId: string) {
    const existing = await this.repository.getRegistration(eventId, profileId);
    if (!existing) {
      throw new Error("Registration not found.");
    }
    return this.repository.updateRegistration(existing.id, { status: 'cancelled' });
  }
}
