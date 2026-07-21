export type GalleryCategory = 
  | "All Memories"
  | "Campus Life"
  | "Achievements"
  | "Departments"
  | "Hostels"
  | "Culture";

export interface GalleryItem {
  id: string;
  slug: string;
  title: string;
  description?: string;
  imageUrl: string;
  imageAlt: string;
  category: GalleryCategory;
  communityType?: "Department" | "Hostel" | "Organization";
  communityName?: string;
  eventName?: string;
  capturedAt?: string;
  location?: string;
  photographer?: string;
  featured?: boolean;
  href: string;
  searchKeywords: string[];
}
