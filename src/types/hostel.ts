// =============================================================================
// Ravenshaw Moments
// File      : src/types/hostel.ts
// Purpose   : TypeScript Domain Models for Universal Hostel Ecosystem & Housing Hub
// =============================================================================

import { BaseEntity } from "./index";
import {
  SharedNoticePriority,
  SharedNoticeAudience,
  SharedEventCategory,
} from "@/features/shared";

// =============================================================================
// 1. Core Hostels & Housing Hub Models
// =============================================================================

export type HostelTypeEnum = "university_boys" | "university_girls" | "private_sponsored";

export interface HostelRoomType {
  type: string; // e.g. "Single", "Double Sharing", "Dormitory"
  capacity: number;
  rentPerMonth?: string;
  isAvailable?: boolean;
}

export interface HostelFacility {
  name: string;
  category?: "basic" | "security" | "recreation" | "dining";
  iconName?: string;
}

export interface Hostel extends BaseEntity {
  name: string;
  slug: string;
  hostel_type: HostelTypeEnum;
  description?: string;
  history?: string;
  address: string;
  google_maps_url?: string;
  contact_number?: string;
  contact_email?: string;
  owner_name?: string; // Used for Housing Hub private hostels
  rent_info?: string;
  room_types?: HostelRoomType[];
  facilities?: HostelFacility[];
  cover_image_url?: string;
  logo_url?: string;
  is_verified: boolean;
  is_sponsored: boolean;
  is_active: boolean;
}

// =============================================================================
// 2. Hostel Warden Model (University Hostels)
// =============================================================================

export interface HostelWarden extends BaseEntity {
  hostel_id: string;
  profile_id?: string;
  name: string;
  designation: string;
  contact_number?: string;
  email?: string;
  office_location?: string;
  tenure_start?: string;
  tenure_end?: string;
  is_current: boolean;
}

// =============================================================================
// 3. Hostel BMC (Block Management Committee) Council Model
// =============================================================================

export type HostelBMCRole =
  | "general_secretary"
  | "mess_secretary"
  | "cultural_secretary"
  | "sports_secretary"
  | "member";

export interface HostelBMCPermissions {
  can_post_notices: boolean;
  can_manage_events: boolean;
  can_manage_gallery: boolean;
  can_verify_residents?: boolean;
}

export interface HostelBMC extends BaseEntity {
  hostel_id: string;
  profile_id: string;
  role_title: HostelBMCRole;
  permissions_grant: HostelBMCPermissions;
  term_year: string;
  is_active: boolean;
}

// =============================================================================
// 4. Hostel Resident & Alumni Model
// =============================================================================

export interface HostelResident extends BaseEntity {
  hostel_id: string;
  profile_id: string;
  room_number?: string;
  batch_year: string;
  department_name?: string;
  is_alumni: boolean;
  is_verified_by_bmc: boolean;
  joined_date?: string;
  left_date?: string;
}

// =============================================================================
// 5. Hostel Notice Model (Consumes Shared Platform semantics)
// =============================================================================

export interface HostelNotice extends BaseEntity {
  hostel_id: string;
  title: string;
  slug: string;
  content: string;
  priority: SharedNoticePriority;
  target_audience: SharedNoticeAudience;
  is_published: boolean;
  is_pinned: boolean;
  published_by_id?: string;
  published_at?: string;
  expires_at?: string;
}

// =============================================================================
// 6. Hostel Event Model (Consumes Shared Platform semantics)
// =============================================================================

export interface HostelEvent extends BaseEntity {
  hostel_id: string;
  title: string;
  slug: string;
  category: SharedEventCategory;
  description?: string;
  venue: string;
  start_time: string;
  end_time: string;
  is_published: boolean;
  is_registration_required: boolean;
  registration_url?: string;
  organizer_id?: string;
}

// =============================================================================
// 7. Hostel Gallery Item Model (Consumes Shared Platform semantics)
// =============================================================================

export type HostelGalleryCategory = "event" | "historic" | "daily_life" | "celebration";

export interface HostelGalleryItem extends BaseEntity {
  hostel_id: string;
  media_id: string;
  media_url: string;
  title?: string;
  caption?: string;
  category: HostelGalleryCategory;
  display_order: number;
  is_public: boolean;
  uploaded_by_id?: string;
}

// =============================================================================
// 8. Hostel Achievement Model (Consumes Shared Platform semantics)
// =============================================================================

export type HostelAchievementCategory = "academic" | "sports" | "cultural" | "leadership" | "inter_hostel";

export interface HostelAchievement extends BaseEntity {
  hostel_id: string;
  resident_profile_id?: string;
  title: string;
  description?: string;
  category: HostelAchievementCategory;
  awarded_date: string;
  issuer?: string;
  certificate_media_id?: string;
  certificate_url?: string;
  is_verified: boolean;
}

// =============================================================================
// 9. SQL Views & Aggregation Models
// =============================================================================

export interface HostelPublicDirectoryView {
  id: string;
  name: string;
  slug: string;
  hostel_type: HostelTypeEnum;
  description?: string;
  address: string;
  cover_image_url?: string;
  logo_url?: string;
  is_verified: boolean;
  is_sponsored: boolean;
  rent_info?: string;
  contact_number?: string;
  current_warden_name?: string;
}
