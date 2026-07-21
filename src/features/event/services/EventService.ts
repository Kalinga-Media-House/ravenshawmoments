import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { EventRepository, GetEventsOptions, EventInsert, EventUpdate } from '../repositories/EventRepository';
import { createClient } from '@/lib/supabase/server';

export class EventService {
  private repository: EventRepository;

  constructor(supabase?: SupabaseClient<Database>) {
    // If a client is provided (e.g. from a server action with cookies), use it.
    // Otherwise, we expect this service to be initialized where the client is available.
    // For convenience in edge cases, we might create an anon client, but it's better to always inject it.
    if (supabase) {
      this.repository = new EventRepository(supabase);
    } else {
      // Fallback for simple calls, but requires await which constructor doesn't support.
      // So supabase client MUST be injected.
      throw new Error("SupabaseClient must be provided to EventService");
    }
  }

  /**
   * Factory method to create an EventService with a server client.
   */
  static async create() {
    const supabase = await createClient();
    return new EventService(supabase as any);
  }

  async getEvents(options: GetEventsOptions = {}) {
    return this.repository.getEvents(options);
  }

  async getEventById(id: string) {
    return this.repository.getEventById(id);
  }

  async getEventBySlug(slug: string) {
    return this.repository.getEventBySlug(slug);
  }

  async createEvent(event: EventInsert) {
    // We could add business logic here (e.g. checking permissions, validating scope)
    return this.repository.createEvent(event);
  }

  async updateEvent(id: string, updates: EventUpdate) {
    return this.repository.updateEvent(id, updates);
  }

  async deleteEvent(id: string) {
    return this.repository.deleteEvent(id);
  }
}
