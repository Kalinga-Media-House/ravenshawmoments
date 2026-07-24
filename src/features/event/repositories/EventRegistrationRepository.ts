import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type EventRegistrationInsert = Database['public']['Tables']['event_registrations']['Insert'];
export type EventRegistrationUpdate = Database['public']['Tables']['event_registrations']['Update'];
export type EventRegistrationRow = Database['public']['Tables']['event_registrations']['Row'];

export class EventRegistrationRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getRegistrationsByEventId(eventId: string) {
    const { data, error } = await this.supabase
      .from('event_registrations')
      .select('*, profile:profiles!event_registrations_profile_id_fkey(id, first_name, last_name, public_id)')
      .eq('event_id', eventId)
      .order('registration_date', { ascending: false });

    if (error) throw error;
    return data;
  }

  async getRegistration(eventId: string, profileId: string) {
    const { data, error } = await this.supabase
      .from('event_registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('profile_id', profileId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  async createRegistration(registration: EventRegistrationInsert) {
    const { data, error } = await this.supabase
      .from('event_registrations')
      .insert(registration)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateRegistration(id: string, updates: EventRegistrationUpdate) {
    const { data, error } = await this.supabase
      .from('event_registrations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
