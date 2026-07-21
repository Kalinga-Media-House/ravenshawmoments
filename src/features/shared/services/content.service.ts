import { createClient } from "@/lib/supabase/server";
import { ContentRepository } from "../repositories/content.repository";
import { SharedEventMetadata, SharedNoticeItem, SharedPublicationItem, SharedGalleryItem } from "@/types";
import { logger } from "@/lib/logger";

export class ContentService {
  static async getUpcomingEvents(limit = 6): Promise<SharedEventMetadata[]> {
    try {
      const supabase = await createClient();
      // @ts-ignore
      const repo = new ContentRepository(supabase);
      return await repo.getGlobalEvents(limit);
    } catch (error) {
      logger.error("ContentService: Error fetching global events", { error });
      return [];
    }
  }

  static async getLatestNews(limit = 6): Promise<SharedNoticeItem[]> {
    try {
      const supabase = await createClient();
      // @ts-ignore
      const repo = new ContentRepository(supabase);
      return await repo.getGlobalNews(limit);
    } catch (error) {
      logger.error("ContentService: Error fetching global news", { error });
      return [];
    }
  }

  static async getFeaturedGallery(limit = 12): Promise<SharedGalleryItem[]> {
    try {
      const supabase = await createClient();
      // @ts-ignore
      const repo = new ContentRepository(supabase);
      return await repo.getGlobalGallery(limit);
    } catch (error) {
      logger.error("ContentService: Error fetching featured gallery", { error });
      return [];
    }
  }

  static async getLatestPublications(limit = 6): Promise<SharedPublicationItem[]> {
    try {
      const supabase = await createClient();
      // @ts-ignore
      const repo = new ContentRepository(supabase);
      return await repo.getGlobalPublications(limit);
    } catch (error) {
      logger.error("ContentService: Error fetching latest publications", { error });
      return [];
    }
  }

  static async getHomepageFeed() {
    try {
      const [events, news, gallery, publications] = await Promise.all([
        this.getUpcomingEvents(3),
        this.getLatestNews(3),
        this.getFeaturedGallery(6),
        this.getLatestPublications(3)
      ]);

      return {
        events,
        news,
        gallery,
        publications
      };
    } catch (error) {
      logger.error("ContentService: Error fetching homepage feed", { error });
      return { events: [], news: [], gallery: [], publications: [] };
    }
  }
}
