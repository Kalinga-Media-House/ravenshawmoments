// =============================================================================
// Ravenshaw Moments
// File      : src/features/shared/notices/index.ts
// Purpose   : Shared Platform Layer — Universal Notices, Circulars & Announcements
// =============================================================================

export type SharedNoticePriority = "low" | "normal" | "high" | "critical";
export type SharedNoticeAudience = "all" | "students" | "faculty" | "alumni";

export interface SharedNoticeItem {
  id: string;
  tenant_id: string;
  title: string;
  slug: string;
  content: string;
  priority: SharedNoticePriority;
  target_audience: SharedNoticeAudience;
  is_published: boolean;
  is_pinned: boolean;
  published_at?: string;
  expires_at?: string;
}

/**
 * Checks if a notice has expired based on current time.
 */
export function isNoticeExpired(expiresAt?: string, nowIso = new Date().toISOString()): boolean {
  if (!expiresAt) return false;
  const expiry = new Date(expiresAt).getTime();
  const now = new Date(nowIso).getTime();
  return !Number.isNaN(expiry) && now > expiry;
}

/**
 * Sorts notices: pinned first, then by published_at descending.
 */
export function sortNotices<T extends { is_pinned?: boolean; published_at?: string }>(notices: T[]): T[] {
  return [...notices].sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    const timeA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const timeB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return timeB - timeA;
  });
}
