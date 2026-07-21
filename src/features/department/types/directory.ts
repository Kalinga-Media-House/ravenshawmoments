import React from "react";

export type AcademicCategory = 
  | "All Departments"
  | "Science"
  | "Arts"
  | "Commerce"
  | "Management"
  | "Computer Science"
  | "Social Science"
  | "Professional Studies"
  | "Language"
  | "Research"
  | "Humanities"
  | "Social Sciences"
  | "Commerce and Management"
  | "Technology and Professional Studies"
  | "Education";

export interface DepartmentDirectoryItem {
  id: string;
  name: string;
  slug: string;
  shortName?: string;
  category: AcademicCategory;
  description: string;
  icon: React.ReactNode;
  href: string;
  searchKeywords: string[];
  studentCount?: number;
  facultyCount?: number;
  alumniCount?: number;
  memoriesCount?: number;
  eventsCount?: number;
  establishedYear?: number;
  coverImage?: string;
  badges?: string[];
  motto?: string;
  vision?: string;
  mission?: string;
  academicExcellence?: string;
}
