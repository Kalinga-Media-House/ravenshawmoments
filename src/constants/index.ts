export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  DASHBOARD: "/dashboard",
  PROFILE: "/profile",
  DEPARTMENTS: "/departments",
  HOSTELS: "/hostels",
  ORGANIZATIONS: "/organizations",
  EVENTS: "/events",
  COMPETITIONS: "/competitions",
  GALLERY: "/gallery",
  CONTRIBUTIONS: "/contributions",
  ADMIN: "/admin",
} as const;

export const USER_ROLES = {
  SUPER_ADMIN: "super_admin",
  MODERATOR: "moderator",
  DEPARTMENT_CR: "department_cr",
  HOSTEL_BMC: "hostel_bmc",
  ORGANIZATION_ADMIN: "organization_admin",
  VOLUNTEER: "volunteer",
  TEACHER: "teacher",
  STUDENT: "student",
  ALUMNI: "alumni",
  EXTERNAL_PARTICIPANT: "external_participant",
  CONTRIBUTOR_SPONSOR: "contributor_sponsor",
  GUEST: "guest",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const STORAGE_BUCKETS = {
  PROFILE_IMAGES: "profile-images",
  GALLERY: "gallery",
  CERTIFICATES: "certificates",
  COMPETITION_SUBMISSIONS: "competition-submissions",
  HOSTEL_IMAGES: "hostel-images",
  DEPARTMENT_ASSETS: "department-assets",
  ORGANIZATION_ASSETS: "organization-assets",
  CONTRIBUTION_PROOFS: "contribution-proofs",
  HERITAGE_ARCHIVE: "heritage-archive",
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "You must be logged in to perform this action.",
  FORBIDDEN: "You do not have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  VALIDATION_ERROR: "Please check your input data and try again.",
  SERVER_ERROR: "An unexpected error occurred. Please try again later.",
  RATE_LIMIT_EXCEEDED: "Too many requests. Please slow down and try again later.",
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;
