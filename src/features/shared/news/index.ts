// =============================================================================
// Ravenshaw Moments
// File      : src/features/shared/news/index.ts
// Purpose   : Shared Platform Layer — Universal News & Press Announcements
// =============================================================================

export type SharedNewsCategory = "academic" | "campus" | "research" | "achievement" | "alumni" | "general";

export interface SharedNewsItem {
  id: string;
  tenant_id: string;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  category: SharedNewsCategory;
  cover_image_url?: string;
  author_id?: string;
  is_published: boolean;
  published_at?: string;
  created_at: string;
}

/**
 * Sorts news articles by published_at descending.
 */
export function sortNewsItems<T extends { published_at?: string; created_at?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const timeA = a.published_at ? new Date(a.published_at).getTime() : (a.created_at ? new Date(a.created_at).getTime() : 0);
    const timeB = b.published_at ? new Date(b.published_at).getTime() : (b.created_at ? new Date(b.created_at).getTime() : 0);
    return timeB - timeA;
  });
}
