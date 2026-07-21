import React from "react";

export type OrganizationCategory = 
  | "All Organizations"
  | "Service and Social Impact"
  | "Leadership and Student Life"
  | "Culture and Creativity"
  | "Sports and Wellness"
  | "Innovation and Professional Development";

export interface OrganizationDirectoryItem {
  id: string;
  name: string;
  shortName?: string;
  slug: string;
  category: OrganizationCategory;
  shortDescription: string;
  icon: React.ReactNode;
  href: string;
  searchKeywords: string[];
}
