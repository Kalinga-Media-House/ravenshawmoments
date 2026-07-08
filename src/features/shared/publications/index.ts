// =============================================================================
// Ravenshaw Moments
// File      : src/features/shared/publications/index.ts
// Purpose   : Shared Platform Layer — Universal Publications, Magazines & Documents
// =============================================================================

export type SharedPublicationType =
  | "annual_magazine"
  | "newsletter"
  | "research_journal"
  | "souvenir"
  | "proceedings"
  | "other";

export interface SharedPublicationItem {
  id: string;
  tenant_id: string;
  title: string;
  slug: string;
  publication_type: SharedPublicationType;
  description?: string;
  publish_date: string;
  volume_number?: string;
  document_media_id: string;
  document_url?: string;
  is_public: boolean;
  download_count: number;
}

/**
 * Normalizes publication download counts ensuring non-negative integers.
 */
export function normalizeDownloadCount(count?: number): number {
  if (typeof count !== "number" || count < 0) return 0;
  return Math.floor(count);
}
