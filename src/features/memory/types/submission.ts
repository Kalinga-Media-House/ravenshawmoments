import { MemoryCategory } from "./memory";

export interface MemoryPersonEntry {
  id: string;
  name: string;
  department?: string;
  batch?: string;
  role?: string;
}

export interface MemoryUploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  caption?: string;
  isCover?: boolean;
}

export type MemoryVisibilityOption = "Public" | "Ravenshaw Community" | "Private Archive";

export interface MemorySubmissionFormData {
  // Step 1: About the Memory
  title: string;
  shortDescription: string;
  category: MemoryCategory;
  fullStory: string;
  memoryDate: string;
  approximateDateOnly: boolean;
  memoryYear: string;
  academicSession: string;
  location: string;

  // Step 2: Photos & Attribution
  images: MemoryUploadedImage[];
  photographerName: string;
  creditNote: string;
  isSelfPhotographer: boolean;
  hasPhotographerPermission: boolean;

  // Step 3: People & Community
  people: MemoryPersonEntry[];
  departmentName: string;
  hostelName: string;
  organizationName: string;
  eventName: string;
  achievementName: string;
  batch: string;

  // Step 4: Contributor & Consent
  contributorName: string;
  contributorEmail: string;
  contributorPhone: string;
  displayPublicly: boolean;
  visibility: MemoryVisibilityOption;

  // Consents (must be true)
  consentPermission: boolean;
  consentAccuracy: boolean;
  consentReview: boolean;
  consentDisplay: boolean;
}

export type MemorySubmissionStep = 1 | 2 | 3 | 4 | 5;
