// =============================================================================
// Ravenshaw Moments
// File      : src/types/organization.ts
// Purpose   : TypeScript Domain Models for Organization Ecosystem
// =============================================================================

import { BaseEntity } from "./index";
import {
  SharedNoticePriority,
  SharedNoticeAudience,
  SharedEventCategory,
} from "@/features/shared";

// =============================================================================
// 1. Core Organization Models
// =============================================================================

export type OrganizationTypeEnum = 
  | "ncc" 
  | "nss" 
  | "yrc" 
  | "rotaract" 
  | "cell" 
  | "society" 
  | "club" 
  | "council" 
  | "other";

export interface Organization extends BaseEntity {
  name: string;
  slug: string;
  org_type: OrganizationTypeEnum;
  description?: string;
  vision?: string;
  mission?: string;
  established_year?: number;
  contact_email?: string;
  contact_phone?: string;
  social_links?: Record<string, string>;
  logo_url?: string;
  cover_image_url?: string;
  is_verified: boolean;
  is_active: boolean;
}

// =============================================================================
// 2. Organization Members & Advisors
// =============================================================================

export type OrganizationMemberRole = "member" | "executive" | "office_bearer" | "alumni" | "honorary";
export type OrganizationMemberStatus = "active" | "alumni" | "past";

export interface OrganizationMember extends BaseEntity {
  org_id: string;
  profile_id: string;
  role: OrganizationMemberRole;
  designation?: string;
  start_date: string;
  end_date?: string;
  status: OrganizationMemberStatus;
  can_manage_org: boolean;
}

export interface OrganizationAdvisor extends BaseEntity {
  org_id: string;
  profile_id?: string;
  name: string;
  designation: string;
  department?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
}

// =============================================================================
// 3. Organization Features
// =============================================================================

export interface OrganizationEvent extends BaseEntity {
  org_id: string;
  title: string;
  slug: string;
  category: SharedEventCategory | string;
  description?: string;
  venue: string;
  start_time: string;
  end_time: string;
  is_published: boolean;
  is_registration_required: boolean;
  registration_url?: string;
}

export interface OrganizationGalleryItem extends BaseEntity {
  org_id: string;
  title: string;
  description?: string;
  media_type: "image" | "video";
  media_url: string;
  thumbnail_url?: string;
  event_id?: string;
  is_featured: boolean;
}

export interface OrganizationNotice extends BaseEntity {
  org_id: string;
  title: string;
  content: string;
  priority: SharedNoticePriority;
  audience: SharedNoticeAudience | "executives";
  attachment_url?: string;
  expires_at?: string;
}

export interface OrganizationAchievement extends BaseEntity {
  org_id: string;
  title: string;
  description: string;
  date: string;
  category: "award" | "recognition" | "competition" | "impact";
  image_url?: string;
}

export interface OrganizationPublication extends BaseEntity {
  org_id: string;
  title: string;
  type: "annual_report" | "magazine" | "newsletter" | "research";
  description?: string;
  publication_date: string;
  file_url: string;
  cover_image_url?: string;
}
