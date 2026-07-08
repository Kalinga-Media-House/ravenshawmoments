import { SupabaseClient } from "@supabase/supabase-js";
import { SharedEventMetadata, SharedNoticeItem, SharedPublicationItem, SharedGalleryItem } from "@/types";

export class ContentRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  /**
   * Fetches latest events across all ecosystems
   */
  async getGlobalEvents(limit = 6): Promise<SharedEventMetadata[]> {
    // We run parallel queries to fetch events from departments, hostels, and orgs
    const [deptRes, hostelRes, orgRes] = await Promise.all([
      this.supabase.from("department_events").select("*").order("start_time", { ascending: true }).limit(limit),
      this.supabase.from("hostel_events").select("*").order("start_time", { ascending: true }).limit(limit),
      this.supabase.from("organization_events").select("*").order("start_time", { ascending: true }).limit(limit),
    ]);

    const allEvents = [
      ...(deptRes.data || []).map(e => ({ ...e, source: 'department' })),
      ...(hostelRes.data || []).map(e => ({ ...e, source: 'hostel' })),
      ...(orgRes.data || []).map(e => ({ ...e, source: 'organization' }))
    ] as SharedEventMetadata[];

    // Sort by date and slice
    return allEvents
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
      .slice(0, limit);
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
