// =============================================================================
// Ravenshaw Moments
// File      : src/features/alumni/types/alumni.ts
// Purpose   : Public Alumni Directory Projection & Filter Domain Interfaces
// =============================================================================

import {
  AchievementSummary,
  ProfileCertificate,
  ProfileGalleryItem,
} from "@/types/profile";
import { AlumniMemorySummary } from "../components/profile/AlumniMemories";
import { AlumniEventSummary } from "../components/profile/AlumniEvents";
import { AlumniCompetitionSummary } from "../components/profile/AlumniCompetitions";

export interface PublicAlumniAchievement {
  id: string;
  title: string;
  slug: string;
  date?: string;
}

export interface PublicAlumniContributions {
  memoriesShared?: number;
  eventsContributed?: number;
  mentorship?: boolean;
  communityContribution?: boolean;
}

export interface PublicAlumniSocialLinks {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  facebook?: string;
  website?: string;
}

/**
 * Public Alumni Profile: strictly public projection derived from canonical profile data.
 * Does NOT expose email, phone number, date of birth, roll number, registration number,
 * private address, internal user ID, or moderation notes.
 */
export interface PublicAlumniProfile {
  id: string;
  slug: string;
  fullName: string;
  publicDisplayName?: string;
  profilePhoto?: string;
  profilePhotoAlt?: string;
  profilePhotoPublic?: boolean;
  profileVerificationStatus?: "pending" | "approved" | "rejected";
  profileType?: "alumni";
  academicLevel?: string;
  programme?: string;
  departmentName?: string;
  departmentSlug?: string;
  batch?: string;
  admissionYear?: string;
  graduationYear?: string;
  hostelName?: string;
  hostelSlug?: string;
  organizationNames?: string[];
  organizationSlugs?: string[];
  organizations?: string[];
  communities?: string[];
  currentProfession?: string;
  currentRole?: string;
  currentOrganization?: string;
  industry?: string;
  city?: string;
  state?: string;
  country?: string;
  shortBio?: string;
  bio?: string;
  ravenshawStory?: string;
  careerMilestones?: string[];
  crHistory?: string[];
  bmcHistory?: string[];
  roleHistory?: string[];
  achievements?: AchievementSummary[];
  memories?: AlumniMemorySummary[];
  galleryItems?: ProfileGalleryItem[];
  events?: AlumniEventSummary[];
  competitions?: AlumniCompetitionSummary[];
  certificates?: ProfileCertificate[];
  socialLinks?: PublicAlumniSocialLinks;
  isClaimable?: boolean;
  publicAchievements?: PublicAlumniAchievement[];
  publicContributions?: PublicAlumniContributions;
  featured?: boolean;
  publicProfileEnabled?: boolean;
  publicSearchEnabled?: boolean;
  publicSocialLinks?: PublicAlumniSocialLinks;
  profileHref?: string;
  searchKeywords?: string[];
}

export type AlumniSortOption =
  | "featured"
  | "recently_added"
  | "graduation_desc"
  | "graduation_asc"
  | "name_asc"
  | "name_desc";

export interface AlumniDirectoryFilterState {
  query: string;
  departmentSlug: string;
  batch: string;
  graduationYear: string;
  profession: string;
  country: string;
  sortBy: AlumniSortOption;
  page: number;
}
