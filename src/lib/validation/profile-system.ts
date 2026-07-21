// =============================================================================
// Ravenshaw Moments
// File      : src/lib/validation/profile-system.ts
// Purpose   : Universal Profile System Zod Validation Schemas
// =============================================================================

import { z } from "zod";

/**
 * Constants for file upload validation (Gallery, Avatars, Proofs).
 */
export const PROFILE_FILE_RULES = {
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024, // 5 MB
  MAX_DOCUMENT_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB
  ALLOWED_IMAGE_MIMES: ["image/jpeg", "image/png", "image/webp"] as const,
  ALLOWED_DOC_MIMES: ["application/pdf", "image/jpeg", "image/png"] as const,
  MAX_GALLERY_QUOTA: 50,
} as const;

/**
 * Schema for updating basic identity information.
 */
export const basicProfileSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters long.")
    .max(100, "Full name must not exceed 100 characters.")
    .trim(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .max(30, "Username must not exceed 30 characters.")
    .regex(
      /^[a-zA-Z0-9_-]+$/,
      "Username may only contain letters, numbers, underscores, and hyphens."
    )
    .trim()
    .toLowerCase(),
  bio: z
    .string()
    .max(500, "Biography must not exceed 500 characters.")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  gender: z
    .enum(["male", "female", "other", "prefer_not_to_say"])
    .optional(),
  date_of_birth: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must follow the YYYY-MM-DD format.")
    .optional(),
  avatar_url: z.string().url("Invalid avatar image URL.").optional(),
  cover_url: z.string().url("Invalid cover image URL.").optional(),
  level: z.string().optional(),
  stream: z.string().optional(),
  department_name: z.string().optional(),
  batch_year: z.string().optional(),
  profile_type: z.enum([
    "student",
    "teacher",
    "alumni",
    "department_cr",
    "hostel_bmc",
    "organization_admin",
    "contributor",
    "volunteer",
    "external_participant",
    "admin",
    "super_admin"
  ]).optional(),
  university_name: z.string().optional(),
});

/**
 * Schema for academic and enrollment record updates.
 */
export const academicRecordSchema = z.object({
  department_id: z.string().uuid("Invalid department UUID."),
  batch_id: z.string().uuid("Invalid batch UUID."),
  roll_number: z
    .string()
    .min(4, "Roll number must be at least 4 characters.")
    .max(30, "Roll number must not exceed 30 characters.")
    .regex(
      /^[a-zA-Z0-9-]+$/,
      "Roll number may only contain alphanumeric characters and hyphens."
    )
    .trim()
    .toUpperCase(),
  registration_number: z
    .string()
    .max(50, "Registration number must not exceed 50 characters.")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  date_of_birth: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      "Date of birth must follow the YYYY-MM-DD format."
    )
    .optional(),
});

/**
 * Schema for user-controlled privacy matrix settings.
 */
export const privacySettingsSchema = z.object({
  profile_visibility: z.enum(["public", "ravenshaw_only", "private"]),
  email_visibility: z.enum(["public", "ravenshaw_only", "private"]),
  phone_visibility: z.enum(["public", "ravenshaw_only", "private"]),
  dob_visibility: z.enum(["public", "ravenshaw_only", "private"]),
  gallery_visibility: z.enum(["public", "ravenshaw_only", "private"]),
  achievements_visibility: z.enum(["public", "ravenshaw_only", "private"]),
});

/**
 * Schema for submitting existing student Roll Number profile claims.
 */
export const profileClaimSchema = z.object({
  roll_number: z
    .string()
    .min(4, "Roll number is required for verification.")
    .max(30, "Roll number must not exceed 30 characters.")
    .trim()
    .toUpperCase(),
  registration_number: z
    .string()
    .max(50, "Registration number is too long.")
    .optional(),
  supporting_document_url: z
    .string()
    .url("A valid supporting document or ID card image URL is required."),
});

/**
 * Schema for adding a new item to the personal 50-image gallery.
 */
export const galleryItemSchema = z.object({
  media_file_id: z.string().uuid("Invalid media file UUID."),
  media_url: z.string().url("Invalid image URL."),
  caption: z
    .string()
    .max(200, "Caption must not exceed 200 characters.")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  display_order: z.number().int().min(0).default(0),
  is_cover: z.boolean().default(false),
  is_featured: z.boolean().default(false),
});

/**
 * Schema for submitting a private contribution proof or receipt.
 */
export const contributionProofSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters long.")
    .max(250, "Title must not exceed 250 characters.")
    .trim(),
  description: z
    .string()
    .max(500, "Description must not exceed 500 characters.")
    .optional()
    .transform((val) => (val === "" ? undefined : val)),
  amount_reference: z
    .number()
    .nonnegative("Amount must be zero or a positive number.")
    .optional(),
  media_file_id: z.string().uuid("Invalid proof document media UUID."),
});

// Type inferences
export type BasicProfileInput = z.infer<typeof basicProfileSchema>;
export type AcademicRecordInput = z.infer<typeof academicRecordSchema>;
export type PrivacySettingsInput = z.infer<typeof privacySettingsSchema>;
export type ProfileClaimInput = z.infer<typeof profileClaimSchema>;
export type GalleryItemInput = z.infer<typeof galleryItemSchema>;
export type ContributionProofInput = z.infer<typeof contributionProofSchema>;
