// =============================================================================
// Ravenshaw Moments
// File      : src/features/shared/gallery/index.ts
// Purpose   : Shared Platform Layer — Universal Gallery & Media Album Models
// =============================================================================

export interface SharedGalleryItem {
  id: string;
  tenant_id: string; // Profile ID or Department ID
  media_id: string;
  media_url: string;
  title?: string;
  caption?: string;
  category?: string;
  display_order: number;
  is_public: boolean;
  created_at: string;
}

export interface SharedAlbum {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  cover_media_id?: string;
  cover_url?: string;
  item_count: number;
  created_at: string;
}

/**
 * Sorts gallery items by display_order ascending, then created_at descending.
 */
export function sortGalleryItems<T extends { display_order?: number; created_at?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const orderA = a.display_order ?? 0;
    const orderB = b.display_order ?? 0;
    if (orderA !== orderB) return orderA - orderB;
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return timeB - timeA;
  });
}
