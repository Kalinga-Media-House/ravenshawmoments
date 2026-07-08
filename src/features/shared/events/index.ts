// =============================================================================
// Ravenshaw Moments
// File      : src/features/shared/events/index.ts
// Purpose   : Shared Platform Layer — Universal Event Lifecycle & Scheduling
// =============================================================================

export type SharedEventCategory =
  | "seminar"
  | "workshop"
  | "conference"
  | "guest_lecture"
  | "festival"
  | "farewell"
  | "freshers"
  | "competition"
  | "other";

export type SharedEventStatus = "draft" | "published" | "cancelled" | "completed";

export interface SharedEventMetadata {
  id: string;
  tenant_id: string; // Department ID or Group ID
  title: string;
  slug: string;
  category: SharedEventCategory;
  venue: string;
  start_time: string;
  end_time: string;
  is_published: boolean;
  is_registration_required: boolean;
  registration_url?: string;
}

/**
 * Validates whether an event time window is chronological (start < end).
 */
export function isValidEventTimeRange(startIso: string, endIso: string): boolean {
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();
  return !Number.isNaN(start) && !Number.isNaN(end) && end > start;
}

/**
 * Computes whether an event is upcoming, ongoing, or past based on current UTC time.
 */
export function getEventTimeStatus(startIso: string, endIso: string, nowIso = new Date().toISOString()): "upcoming" | "ongoing" | "past" {
  const now = new Date(nowIso).getTime();
  const start = new Date(startIso).getTime();
  const end = new Date(endIso).getTime();

  if (now < start) return "upcoming";
  if (now > end) return "past";
  return "ongoing";
}
