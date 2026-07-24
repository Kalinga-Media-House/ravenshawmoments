import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type EventRow = Database['public']['Tables']['events']['Row'];
export type EventInsert = Database['public']['Tables']['events']['Insert'];
export type EventUpdate = Database['public']['Tables']['events']['Update'];

export type EventScopeType = 'UNIVERSITY' | 'DEPARTMENT' | 'HOSTEL' | 'ORGANIZATION' | 'COMPETITION' | 'ALUMNI';

export interface GetEventsOptions {
  scopeType?: EventScopeType;
  scopeId?: string | null;
  isPublished?: boolean;
  isFeatured?: boolean;
  upcomingOnly?: boolean;
  limit?: number;
  offset?: number;
}

export class EventRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getEvents(options: GetEventsOptions = {}) {
    let query = this.supabase
      .from('events')
      .select('*, organizer:profiles!events_organizer_id_fkey(id, public_id, full_name), cover:media_files!events_cover_media_id_fkey(id, storage_bucket, storage_path, public_id, alt_text)', { count: 'exact' });

    if (options.scopeType) {
      query = query.eq('scope_type', options.scopeType);
    }
    
    if (options.scopeId !== undefined) {
      if (options.scopeId === null) {
        query = query.is('scope_id', null);
      } else {
        query = query.eq('scope_id', options.scopeId);
      }
    }

    if (options.isPublished !== undefined) {
      query = query.eq('is_published', options.isPublished);
    }

    if (options.isFeatured !== undefined) {
      query = query.eq('is_featured', options.isFeatured);
    }

    if (options.upcomingOnly) {
      query = query.gte('event_start_time', new Date().toISOString());
      query = query.order('event_start_time', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return { events: data, count };
  }

  async getEventById(id: string) {
    const { data, error } = await this.supabase
      .from('events')
      .select('*, organizer:profiles!events_organizer_id_fkey(id, public_id, full_name), cover:media_files!events_cover_media_id_fkey(id, storage_bucket, storage_path, public_id, alt_text)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getEventBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('events')
      .select('*, organizer:profiles!events_organizer_id_fkey(id, public_id, full_name), cover:media_files!events_cover_media_id_fkey(id, storage_bucket, storage_path, public_id, alt_text)')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  async createEvent(event: EventInsert) {
    const { data, error } = await this.supabase
      .from('events')
      .insert(event)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateEvent(id: string, updates: EventUpdate) {
    const { data, error } = await this.supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteEvent(id: string) {
    const { error } = await this.supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async incrementViewCount(id: string) {
    const { data: event } = await this.supabase
      .from('events')
      .select('view_count')
      .eq('id', id)
      .maybeSingle();
      
    if (event) {
      await this.supabase
        .from('events')
        .update({ view_count: ((event.view_count as number) || 0) + 1 })
        .eq('id', id);
    }
  }
}
