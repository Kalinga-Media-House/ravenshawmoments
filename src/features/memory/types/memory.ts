export type MemoryCategory =
  | "Campus Life"
  | "Friendship"
  | "Department"
  | "Hostel Life"
  | "Organizations"
  | "Events"
  | "Celebrations"
  | "Festivals"
  | "Academic Life"
  | "Achievements"
  | "Sports"
  | "Culture"
  | "Farewell"
  | "Alumni"
  | "Everyday Moments"
  | "Heritage"
  | "Other";

export type CommunityType =
  | "Departments"
  | "Hostels"
  | "Organizations"
  | "Events"
  | "Achievements";

export interface MemoryItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullStory?: string;
  memoryType?: string;
  category: MemoryCategory;
  coverImage: string;
  imageAlt: string;
  galleryImages?: string[];
  capturedAt?: string;
  memoryYear?: string;
  academicSession?: string;
  location?: string;
  communityType?: CommunityType;
  departmentName?: string;
  departmentSlug?: string;
  hostelName?: string;
  hostelSlug?: string;
  organizationName?: string;
  organizationSlug?: string;
  eventName?: string;
  eventSlug?: string;
  achievementName?: string;
  achievementSlug?: string;
  contributorName?: string;
  contributorProfileSlug?: string;
  photographerName?: string;
  people?: string[];
  batch?: string;
  featured?: boolean;
  publicVisibility?: boolean;
  approved?: boolean;
  tags?: string[];
  href: string;
  searchKeywords?: string[];
}
