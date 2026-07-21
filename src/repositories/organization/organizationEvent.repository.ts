import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';
import { EventRepository } from '@/features/event/repositories/EventRepository';

export class OrganizationEventRepository {
  private supabase: SupabaseClient<Database>;
  private eventRepo: EventRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.supabase = supabase as any;
    this.eventRepo = new EventRepository(supabase as any);
  }

  async getEventsByOrgId(orgId: string) {
    const { events } = await this.eventRepo.getEvents({
      scopeType: 'ORGANIZATION',
      scopeId: orgId,
    });
    // Map back to expected structure
    return events.map((e: any) => ({
      ...e,
      org_id: e.scope_id,
      category: e.event_category,
      start_time: e.event_start_time,
      end_time: e.event_end_time,
    })) as Database['public']['Tables']['organization_events']['Row'][];
  }

  async createEvent(payload: Database['public']['Tables']['organization_events']['Insert']) {
    const eventPayload = {
      ...payload,
      scope_type: 'ORGANIZATION',
      scope_id: payload.org_id,
      event_category: payload.category || 'other',
      event_start_time: payload.start_time,
      event_end_time: payload.end_time,
    };
    
    delete (eventPayload as any).org_id;
    delete (eventPayload as any).category;
    delete (eventPayload as any).start_time;
    delete (eventPayload as any).end_time;
    
    const created = await this.eventRepo.createEvent(eventPayload as any);
    return {
      ...created,
      org_id: created.scope_id,
      category: created.event_category,
      start_time: created.event_start_time,
      end_time: created.event_end_time,
    } as any;
  }

  async updateEvent(id: string, payload: Database['public']['Tables']['organization_events']['Update']) {
    const eventPayload = {
      ...payload,
    };
    
    if (payload.org_id !== undefined) {
      (eventPayload as any).scope_id = payload.org_id;
      delete (eventPayload as any).org_id;
    }
    if (payload.category !== undefined) {
      (eventPayload as any).event_category = payload.category;
      delete (eventPayload as any).category;
    }
    if (payload.start_time !== undefined) {
      (eventPayload as any).event_start_time = payload.start_time;
      delete (eventPayload as any).start_time;
    }
    if (payload.end_time !== undefined) {
      (eventPayload as any).event_end_time = payload.end_time;
      delete (eventPayload as any).end_time;
    }
    
    const updated = await this.eventRepo.updateEvent(id, eventPayload as any);
    return {
      ...updated,
      org_id: updated.scope_id,
      category: updated.event_category,
      start_time: updated.event_start_time,
      end_time: updated.event_end_time,
    } as any;
  }
}
