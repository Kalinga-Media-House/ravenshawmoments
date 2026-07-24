// =============================================================================
// Ravenshaw Moments
// File      : src/lib/storage/storage.constants.ts
// Purpose   : Single source of truth for R2 folder structure and upload rules
// =============================================================================

/**
 * Standardized R2 folder prefixes (key prefixes within the single bucket).
 * Every upload MUST use one of these folders. Arbitrary folders are rejected.
 */
export const R2_FOLDERS = {
  AVATARS: "avatars",
  PROFILES: "profiles",
  DEPARTMENTS: "departments",
  ORGANIZATIONS: "organizations",
  EVENTS: "events",
  GALLERY: "gallery",
  COMPETITIONS: "competitions",
  CERTIFICATES: "certificates",
  DOCUMENTS: "documents",
  NEWS: "news",
  BUSINESS: "business",
  DONATIONS: "donations",
  MEMORIES: "memories",
  HOSTELS: "hostels",
  TEMP: "temp",
} as const;

export type R2Folder = (typeof R2_FOLDERS)[keyof typeof R2_FOLDERS];

/** Set of all valid R2 folder values for runtime validation */
const VALID_FOLDERS = new Set<string>(Object.values(R2_FOLDERS));

/** Validates that a folder name is one of the standardized R2 folders */
export function isValidR2Folder(folder: string): folder is R2Folder {
  return VALID_FOLDERS.has(folder);
}

// ---------------------------------------------------------------------------
// MIME Types
// ---------------------------------------------------------------------------

export const ALLOWED_IMAGE_MIMES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const ALLOWED_VIDEO_MIMES = [
  "video/mp4",
  "video/webm",
] as const;

export const ALLOWED_DOCUMENT_MIMES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
] as const;

export const ALL_ALLOWED_MIMES = [
  ...ALLOWED_IMAGE_MIMES,
  ...ALLOWED_VIDEO_MIMES,
  ...ALLOWED_DOCUMENT_MIMES,
] as const;

// ---------------------------------------------------------------------------
// File Extensions
// ---------------------------------------------------------------------------

export const ALLOWED_IMAGE_EXTENSIONS = [
  "jpg", "jpeg", "png", "webp", "gif",
] as const;

export const ALLOWED_VIDEO_EXTENSIONS = [
  "mp4", "webm",
] as const;

export const ALLOWED_DOCUMENT_EXTENSIONS = [
  "pdf", "doc", "docx", "xls", "xlsx",
] as const;

// ---------------------------------------------------------------------------
// Size Limits
// ---------------------------------------------------------------------------

/** Size limits in bytes */
export const SIZE_LIMITS = {
  AVATAR: 5 * 1024 * 1024,           // 5 MB
  IMAGE: 10 * 1024 * 1024,           // 10 MB
  DEPARTMENT_IMAGE: 20 * 1024 * 1024, // 20 MB
  DOCUMENT: 25 * 1024 * 1024,        // 25 MB
  VIDEO: 50 * 1024 * 1024,           // 50 MB
} as const;

// ---------------------------------------------------------------------------
// Upload Rule Sets — per-module configurations
// ---------------------------------------------------------------------------

export interface UploadRuleSet {
  allowedMimeTypes: readonly string[];
  allowedExtensions: readonly string[];
  maxSizeBytes: number;
}

/** Pre-defined upload rules for each module / category */
export const UPLOAD_RULES = {
  AVATAR: {
    allowedMimeTypes: ALLOWED_IMAGE_MIMES,
    allowedExtensions: ALLOWED_IMAGE_EXTENSIONS,
    maxSizeBytes: SIZE_LIMITS.AVATAR,
  },
  IMAGE: {
    allowedMimeTypes: ALLOWED_IMAGE_MIMES,
    allowedExtensions: ALLOWED_IMAGE_EXTENSIONS,
    maxSizeBytes: SIZE_LIMITS.IMAGE,
  },
  DEPARTMENT_IMAGE: {
    allowedMimeTypes: ALLOWED_IMAGE_MIMES,
    allowedExtensions: ALLOWED_IMAGE_EXTENSIONS,
    maxSizeBytes: SIZE_LIMITS.DEPARTMENT_IMAGE,
  },
  DOCUMENT: {
    allowedMimeTypes: [...ALLOWED_DOCUMENT_MIMES, ...ALLOWED_IMAGE_MIMES] as readonly string[],
    allowedExtensions: [...ALLOWED_DOCUMENT_EXTENSIONS, ...ALLOWED_IMAGE_EXTENSIONS] as readonly string[],
    maxSizeBytes: SIZE_LIMITS.DOCUMENT,
  },
  VIDEO: {
    allowedMimeTypes: ALLOWED_VIDEO_MIMES,
    allowedExtensions: ALLOWED_VIDEO_EXTENSIONS,
    maxSizeBytes: SIZE_LIMITS.VIDEO,
  },
  /** Accepts images, videos, and documents — broadest rule set */
  ANY_MEDIA: {
    allowedMimeTypes: ALL_ALLOWED_MIMES,
    allowedExtensions: [
      ...ALLOWED_IMAGE_EXTENSIONS,
      ...ALLOWED_VIDEO_EXTENSIONS,
      ...ALLOWED_DOCUMENT_EXTENSIONS,
    ] as readonly string[],
    maxSizeBytes: SIZE_LIMITS.VIDEO,
  },
} as const satisfies Record<string, UploadRuleSet>;

// ---------------------------------------------------------------------------
// Image Variant Definitions (architecture-ready, not implemented)
// ---------------------------------------------------------------------------

export const IMAGE_VARIANTS = {
  ORIGINAL: "original",
  THUMBNAIL: "thumbnail",
  MEDIUM: "medium",
  LARGE: "large",
} as const;

export type ImageVariant = (typeof IMAGE_VARIANTS)[keyof typeof IMAGE_VARIANTS];

// ---------------------------------------------------------------------------
// Rate Limit Tiers (architecture-ready, configurable per role)
// ---------------------------------------------------------------------------

export const UPLOAD_RATE_LIMITS = {
  STUDENT: { maxUploadsPerHour: 20, maxTotalBytesPerHour: 100 * 1024 * 1024 },
  CR: { maxUploadsPerHour: 50, maxTotalBytesPerHour: 250 * 1024 * 1024 },
  ADMIN: { maxUploadsPerHour: 200, maxTotalBytesPerHour: 1024 * 1024 * 1024 },
} as const;
