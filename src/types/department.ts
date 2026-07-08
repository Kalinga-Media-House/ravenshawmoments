// =============================================================================
// Ravenshaw Moments
// File      : src/types/department.ts
// Purpose   : Universal Department Ecosystem Domain Interfaces & Type Definitions
// =============================================================================

import { BaseEntity } from "./index";

// ============================================================================
// 1. Shared Enums & Union Types
// ============================================================================

/**
 * Priority tiers for departmental circulars and notices.
 */
export type DepartmentNoticePriority = "low" | "normal" | "high" | "critical";

/**
 * Target audience scopes for notices and bulletins.
 */
export type DepartmentNoticeAudience = "all" | "students" | "faculty" | "alumni";

/**
 * Categorization of academic and cultural events hosted by departments.
 */
export type DepartmentEventType =
  | "seminar"
  | "workshop"
  | "conference"
  | "guest_lecture"
  | "festival"
  | "farewell"
  | "freshers"
  | "competition"
  | "other";

/**
 * Publication classifications for department archives.
 */
export type DepartmentPublicationType =
  | "annual_magazine"
  | "newsletter"
  | "research_journal"
  | "souvenir"
  | "proceedings"
  | "other";

/**
 * Granular capabilities granted to a Department Class Representative (CR).
 */
export interface DepartmentCRPermissionGrant {
  can_post_notices: boolean;
  can_manage_gallery: boolean;
  can_manage_events: boolean;
  can_verify_students?: boolean;
  can_upload_publications?: boolean;
  [key: string]: boolean | undefined;
}

// ============================================================================
// 2. Core Domain Interfaces
// ============================================================================

/**
 * Master Department entity representing an academic department homepage.
 */
export interface Department extends BaseEntity {
  name: string;
  short_name?: string;
  slug: string;
  description?: string;
  established_year?: number;
  logo_media_id?: string;
  cover_media_id?: string;
  logo_url?: string;
  cover_url?: string;
  vision?: string;
  mission?: string;
  contact_email?: string;
  contact_phone?: string;
  office_location?: string;
  hod_profile_id?: string;
  hod_message?: string;
  is_active: boolean;
  is_verified: boolean;
  verified_at?: string;
  verified_by?: string;
}

/**
 * Class Representative (CR) appointment record for a department session.
 */
export interface DepartmentCR extends BaseEntity {
  department_id: string;
  profile_id: string;
  academic_session_id?: string;
  role_title: string;
  term_start_date: string;
  term_end_date?: string;
  is_active: boolean;
  permissions_grant: DepartmentCRPermissionGrant;
  assigned_by?: string;
  remarks?: string;
  profile?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
    email?: string;
  };
  department?: {
    name: string;
    slug: string;
  };
}

/**
 * Departmental teacher and faculty roster record.
 */
export interface DepartmentTeacher extends BaseEntity {
  department_id: string;
  profile_id: string;
  designation_id?: string;
  designation_title: string;
  qualification?: string;
  research_interests?: string[];
  office_location?: string;
  contact_email?: string;
  contact_phone?: string;
  is_hod: boolean;
  is_visiting: boolean;
  is_active: boolean;
  display_order: number;
  bio_override?: string;
  profile?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

/**
 * Departmental student directory affiliation and leadership record.
 */
export interface DepartmentStudent extends BaseEntity {
  department_id: string;
  profile_id: string;
  batch_id?: string;
  academic_session_id?: string;
  department_program_id?: string;
  leadership_role?: string;
  is_featured: boolean;
  is_verified_by_cr: boolean;
  verified_at?: string;
  verified_by?: string;
  is_active: boolean;
  profile?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
  batch?: {
    name: string;
    graduation_year?: number;
  };
  program?: {
    program_name: string;
    duration_years: number;
  };
}

/**
 * Official departmental circular or notice announcement.
 */
export interface DepartmentNotice extends BaseEntity {
  public_id: string;
  department_id: string;
  title: string;
  slug: string;
  content: string;
  priority: DepartmentNoticePriority;
  target_audience: DepartmentNoticeAudience;
  attachment_media_id?: string;
  attachment_url?: string;
  published_by?: string;
  published_at: string;
  expires_at?: string;
  is_published: boolean;
  is_pinned: boolean;
  view_count: number;
  publisher?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

/**
 * Departmental academic seminar, celebration, or cultural event.
 */
export interface DepartmentEvent extends BaseEntity {
  public_id: string;
  department_id: string;
  title: string;
  slug: string;
  description: string;
  event_type: DepartmentEventType;
  venue: string;
  event_start_time: string;
  event_end_time: string;
  cover_media_id?: string;
  cover_url?: string;
  registration_url?: string;
  is_registration_required: boolean;
  coordinator_profile_id?: string;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  coordinator?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

/**
 * Departmental annual magazine, research journal, or publication archive.
 */
export interface DepartmentPublication extends BaseEntity {
  public_id: string;
  department_id: string;
  academic_session_id?: string;
  title: string;
  slug: string;
  publication_type: DepartmentPublicationType;
  description?: string;
  publish_date: string;
  volume_number?: string;
  editor_in_chief?: string;
  cover_media_id?: string;
  cover_url?: string;
  document_media_id: string;
  document_url?: string;
  uploaded_by?: string;
  is_public: boolean;
  download_count: number;
}

// ============================================================================
// 3. Unified SQL View Models
// ============================================================================

/**
 * Aggregated statistics dashboard metrics for a department (`v_department_statistics`).
 */
export interface DepartmentStatistics {
  department_id: string;
  department_name: string;
  department_slug: string;
  is_active: boolean;
  is_verified: boolean;
  total_students: number;
  total_teachers: number;
  total_crs: number;
  total_events: number;
  total_notices: number;
  total_publications: number;
  total_gallery_albums: number;
  total_achievements: number;
}

/**
 * Showcase view model for department gallery albums (`v_department_galleries`).
 */
export interface DepartmentGallery extends BaseEntity {
  album_id: string;
  public_id: string;
  department_id: string;
  department_name?: string;
  department_slug?: string;
  title: string;
  album_slug: string;
  description?: string;
  cover_media_id?: string;
  cover_url?: string;
  is_featured: boolean;
  item_count: number;
}

/**
 * Showcase view model for department honors and awards (`v_department_achievements`).
 */
export interface DepartmentAchievement extends BaseEntity {
  achievement_id: string;
  public_id: string;
  department_id: string;
  department_name?: string;
  department_slug?: string;
  category_name?: string;
  title: string;
  achievement_slug: string;
  description?: string;
  achievement_date?: string;
  issuing_organization?: string;
  featured_image_url?: string;
  is_featured: boolean;
}

/**
 * Showcase view model for department news broadcasts (`v_department_news`).
 */
export interface DepartmentNews extends BaseEntity {
  content_id: string;
  public_id: string;
  department_id: string;
  department_name?: string;
  department_slug?: string;
  title: string;
  news_slug: string;
  summary?: string;
  body: string;
  featured_image_url?: string;
  published_at?: string;
  view_count: number;
  is_featured: boolean;
}

// ============================================================================
// 4. Derived & Composite Types
// ============================================================================

/**
 * Lightweight summary of a department for navigation dropdowns and lists.
 */
export type DepartmentSummaryView = Pick<
  Department,
  "id" | "name" | "short_name" | "slug" | "logo_url" | "is_verified"
>;

/**
 * Rich department aggregate containing related rosters, announcements, and statistics.
 */
export interface DepartmentWithDetails extends Department {
  hod_profile?: {
    full_name?: string;
    avatar_url?: string;
    username?: string;
  };
  statistics?: DepartmentStatistics;
  teachers?: DepartmentTeacher[];
  active_crs?: DepartmentCR[];
  recent_notices?: DepartmentNotice[];
  upcoming_events?: DepartmentEvent[];
  latest_publications?: DepartmentPublication[];
  featured_gallery?: DepartmentGallery[];
  featured_achievements?: DepartmentAchievement[];
}

// ============================================================================
// 5. Input Mutation Types (Data Transfer Objects)
// ============================================================================

export type CreateDepartmentInput = Omit<
  Department,
  "id" | "created_at" | "updated_at" | "is_verified" | "verified_at" | "verified_by"
>;

export type UpdateDepartmentInput = Partial<CreateDepartmentInput>;

export type CreateDepartmentNoticeInput = Omit<
  DepartmentNotice,
  "id" | "created_at" | "updated_at" | "public_id" | "view_count" | "publisher" | "attachment_url"
>;

export type UpdateDepartmentNoticeInput = Partial<CreateDepartmentNoticeInput>;

export type CreateDepartmentEventInput = Omit<
  DepartmentEvent,
  "id" | "created_at" | "updated_at" | "public_id" | "view_count" | "coordinator" | "cover_url"
>;

export type UpdateDepartmentEventInput = Partial<CreateDepartmentEventInput>;

export type CreateDepartmentPublicationInput = Omit<
  DepartmentPublication,
  "id" | "created_at" | "updated_at" | "public_id" | "download_count" | "cover_url" | "document_url"
>;

export type UpdateDepartmentPublicationInput = Partial<CreateDepartmentPublicationInput>;

export type AssignDepartmentCRInput = Omit<
  DepartmentCR,
  "id" | "created_at" | "updated_at" | "assigned_by" | "profile" | "department"
>;

export type UpdateDepartmentTeacherInput = Partial<
  Omit<DepartmentTeacher, "id" | "created_at" | "updated_at" | "department_id" | "profile_id" | "profile">
>;

export type UpdateDepartmentStudentInput = Partial<
  Omit<DepartmentStudent, "id" | "created_at" | "updated_at" | "department_id" | "profile_id" | "profile" | "batch" | "program">
>;
