export type ContentType =
  | "News"
  | "Announcement"
  | "Story"
  | "Article"
  | "Interview"
  | "Achievement"
  | "Magazine"
  | "Newsletter"
  | "Report"
  | "E-Publication";

export type ContentCategory =
  | "Campus"
  | "Academics"
  | "Research"
  | "Culture"
  | "Sports"
  | "Alumni"
  | "Departments"
  | "Hostels"
  | "Organizations"
  | "Student Life"
  | "Achievements"
  | "Official Updates";

export type ContentStatus = "Published" | "Draft" | "Archived";

export interface ContentItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  contentType: ContentType;
  category: ContentCategory;
  coverImage?: string;
  coverImageAlt?: string;
  publishedDate: string; // ISO string
  author?: string;
  publisher?: string;
  department?: string;
  hostel?: string;
  organization?: string;
  readingTime?: number; // minutes
  featured?: boolean;
  tags: string[];
  externalUrl?: string;
  publicationFile?: string;
  status: ContentStatus;
  // Publication-specific
  edition?: string;
  volume?: string;
  pageCount?: number;
}
