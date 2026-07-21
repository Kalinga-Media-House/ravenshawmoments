import React from "react";

export type HostelGenderCategory = 
  | "All Hostels"
  | "Boys' Hostels"
  | "Girls' Hostels";

export interface HostelDirectoryItem {
  id: string;
  name: string;
  slug: string;
  genderCategory: HostelGenderCategory;
  shortDescription: string;
  icon: React.ReactNode;
  href: string;
  searchKeywords: string[];
}
