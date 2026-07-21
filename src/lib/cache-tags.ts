export const CacheTags = {
  DEPARTMENTS: "departments",
  DEPARTMENT: (slug: string) => `dept-${slug}` as const,
  DEPARTMENT_FACULTY: (slug: string) => `dept-${slug}-faculty` as const,
  DEPARTMENT_STUDENTS: (slug: string) => `dept-${slug}-students` as const,
  DEPARTMENT_PROGRAMS: (slug: string) => `dept-${slug}-programs` as const,
  DEPARTMENT_GALLERY: (slug: string) => `dept-${slug}-gallery` as const,
  DEPARTMENT_ACHIEVEMENTS: (slug: string) => `dept-${slug}-achievements` as const,
  DEPARTMENT_STATS: "dept-stats",
  PROFILE: "profile",
  STUDENT_PROFILE: (slug: string) => `profile-${slug}` as const,
} as const;
