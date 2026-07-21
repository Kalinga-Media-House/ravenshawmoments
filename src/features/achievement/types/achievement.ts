export type AchievementCategory =
  | "Academic"
  | "Competitive Examination"
  | "Research"
  | "Sports"
  | "Culture"
  | "Literature"
  | "Debate"
  | "Innovation"
  | "Entrepreneurship"
  | "Leadership"
  | "Social Service"
  | "Career"
  | "Alumni"
  | "Department"
  | "Hostel"
  | "Organization"
  | "Other";

export type AchieverType =
  | "Student"
  | "Alumni"
  | "Teacher"
  | "Department"
  | "Hostel"
  | "Organization"
  | "Team";

export type AchievementLevel =
  | "University"
  | "District"
  | "State"
  | "National"
  | "International"
  | "Institutional"
  | "Other";

export interface AchievementItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  category: AchievementCategory;
  level: AchievementLevel;
  achieverType: AchieverType;
  achieverName: string;
  achieverProfileSlug?: string;
  departmentName?: string;
  departmentSlug?: string;
  hostelName?: string;
  hostelSlug?: string;
  organizationName?: string;
  organizationSlug?: string;
  teamName?: string;
  awardName?: string;
  recognition?: string;
  rank?: string;
  position?: string;
  eventName?: string;
  eventSlug?: string;
  institutionName?: string;
  location?: string;
  achievedAt: string; // ISO date string
  publishedAt: string; // ISO date string
  coverImage?: string;
  imageAlt?: string;
  featured?: boolean;
  verified?: boolean;
  tags?: string[];
  searchKeywords?: string[];
}
