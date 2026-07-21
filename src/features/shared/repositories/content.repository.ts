import { SupabaseClient } from "@supabase/supabase-js";
import { SharedEventMetadata, SharedNoticeItem, SharedPublicationItem, SharedGalleryItem } from "@/types";

export class ContentRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Fetches latest events across all ecosystems using the Unified Event Engine
   */
  async getGlobalEvents(limit = 6): Promise<SharedEventMetadata[]> {
    const { data, error } = await this.supabase
      .from("events")
      .select("*")
      .gte('event_start_time', new Date().toISOString()) // Assuming we want upcoming events
      .order("event_start_time", { ascending: true })
      .limit(limit);

    if (error) {
      console.error("Error fetching global events:", error);
      return [];
    }

    // Map unified events back to SharedEventMetadata (or just return as is if types overlap)
    return (data || []).map((e: any) => ({
      ...e,
      source: e.scope_type.toLowerCase(),
      start_time: e.event_start_time,
      end_time: e.event_end_time,
      type: e.event_category,
    })) as SharedEventMetadata[];
  }

  /**
   * Fetches latest news (notices) across all ecosystems
   */
  async getGlobalNews(limit = 6): Promise<SharedNoticeItem[]> {
    const [deptRes, hostelRes, orgRes] = await Promise.all([
      this.supabase.from("department_notices").select("*").order("published_at", { ascending: false }).limit(limit),
      this.supabase.from("hostel_notices").select("*").order("published_at", { ascending: false }).limit(limit),
      this.supabase.from("organization_notices").select("*").order("published_at", { ascending: false }).limit(limit),
    ]);

    const allNotices = [
      ...(deptRes.data || []).map(n => ({ ...n, source: 'department' })),
      ...(hostelRes.data || []).map(n => ({ ...n, source: 'hostel' })),
      ...(orgRes.data || []).map(n => ({ ...n, source: 'organization' }))
    ] as SharedNoticeItem[];

    return allNotices
      .sort((a, b) => new Date(b.published_at || 0).getTime() - new Date(a.published_at || 0).getTime())
      .slice(0, limit);
  }

  /**
   * Fetches latest gallery items across all ecosystems
   */
  async getGlobalGallery(limit = 12): Promise<SharedGalleryItem[]> {
    const [hostelRes, orgRes] = await Promise.all([
      this.supabase.from("hostel_gallery").select("*").order("created_at", { ascending: false }).limit(limit),
      this.supabase.from("organization_gallery").select("*").order("created_at", { ascending: false }).limit(limit),
    ]);

    const allGallery = [
      ...(hostelRes.data || []).map(g => ({ ...g, source: 'hostel' })),
      ...(orgRes.data || []).map(g => ({ ...g, source: 'organization' }))
    ] as SharedGalleryItem[];

    return allGallery
      .sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime())
      .slice(0, limit);
  }

  /**
   * Fetches global publications (primarily from departments and orgs)
   */
  async getGlobalPublications(limit = 6): Promise<SharedPublicationItem[]> {
    const [deptRes, orgRes] = await Promise.all([
      this.supabase.from("department_publications").select("*").order("publish_date", { ascending: false }).limit(limit),
      this.supabase.from("organization_publications").select("*").order("publish_date", { ascending: false }).limit(limit), // Assuming orgs have publications
    ]);

    const allPubs = [
      ...(deptRes.data || []).map(p => ({ ...p, source: 'department' })),
      ...(orgRes.data || []).map(p => ({ ...p, source: 'organization' }))
    ] as SharedPublicationItem[];

    return allPubs
      .sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())
      .slice(0, limit);
  }
}
