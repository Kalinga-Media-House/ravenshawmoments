// =============================================================================
// Ravenshaw Moments
// File      : src/lib/validation/department-system.ts
// Purpose   : Universal Department Ecosystem Zod Validation Schemas
// =============================================================================

import { z } from "zod";
import { sanitizeHtml, sanitizeText } from "../sanitize";

// ============================================================================
// 1. Shared Validators & Reusable Transforms
// ============================================================================

/**
 * Regex for URL-friendly slugs (lowercase alphanumeric and hyphens).
 */
const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Regex for international and domestic telephone numbers.
 */
const PHONE_REGEX = /^\+?[\d\s-]{10,15}$/;

/**
 * Regex for YYYY-MM-DD dates.
 */
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Reusable UUID validator.
 */
export const uuidSchema = z
  .string()
  .trim()
  .uuid("Invalid UUID format.");

/**
 * Reusable Slug validator.
 */
export const slugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters long.")
  .max(100, "Slug must not exceed 100 characters.")
  .regex(SLUG_REGEX, "Slug may only contain lowercase alphanumeric characters and hyphens.")
  .trim();

/**
 * Normalized email validator.
 */
export const emailSchema = z
  .string()
  .min(1, "Email address is required.")
  .email("Invalid email address format.")
  .max(255, "Email address is too long.")
  .trim()
  .toLowerCase();

/**
 * Normalized phone number validator.
 */
export const phoneSchema = z
  .string()
  .regex(PHONE_REGEX, "Invalid telephone number format (10-15 digits expected).")
  .trim();

/**
 * Date validator enforcing YYYY-MM-DD.
 */
export const dateSchema = z
  .string()
  .regex(DATE_REGEX, "Date must follow the YYYY-MM-DD format.")
  .trim();

/**
 * ISO 8601 timestamp validator.
 */
export const dateTimeSchema = z
  .string()
  .trim()
  .refine((val) => !isNaN(Date.parse(val)), "Invalid ISO 8601 timestamp format.");

/**
 * Reusable URL validator with optional empty string handling.
 */
export const urlSchema = z
  .string()
  .url("Invalid URL format.")
  .trim();

export const optionalUrlSchema = z
  .string()
  .trim()
  .optional()
  .or(z.literal(""))
  .transform((val) => (!val || val === "" ? undefined : val))
  .refine((val) => !val || /^https?:\/\//.test(val), "URL must start with http:// or https://");

/**
 * Helper to generate sanitized plain text Zod schema with length bounds.
 */
export const textSchema = (min: number, max: number, fieldName = "Field") =>
  z
    .string()
    .min(min, `${fieldName} must be at least ${min} characters long.`)
    .max(max, `${fieldName} must not exceed ${max} characters.`)
    .trim()
    .transform((val) => sanitizeText(val));

/**
 * Helper to generate sanitized optional plain text Zod schema.
 */
export const optionalTextSchema = (max: number, fieldName = "Field") =>
  z
    .string()
    .max(max, `${fieldName} must not exceed ${max} characters.`)
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((val) => (!val || val === "" ? undefined : sanitizeText(val)));

/**
 * Helper to generate DOMPurify sanitized rich text HTML schema.
 */
export const richTextSchema = (min: number, max: number, fieldName = "Content") =>
  z
    .string()
    .min(min, `${fieldName} must be at least ${min} characters long.`)
    .max(max, `${fieldName} must not exceed ${max} characters.`)
    .trim()
    .transform((val) => sanitizeHtml(val));

/**
 * Helper for optional DOMPurify sanitized rich text.
 */
export const optionalRichTextSchema = (max: number, fieldName = "Content") =>
  z
    .string()
    .max(max, `${fieldName} must not exceed ${max} characters.`)
    .trim()
    .optional()
    .or(z.literal(""))
    .transform((val) => (!val || val === "" ? undefined : sanitizeHtml(val)));

// ============================================================================
// 2. Core Domain Validation Schemas
// ============================================================================

/**
 * Create Department Schema
 */
export const createDepartmentSchema = z.object({
  name: textSchema(3, 150, "Department name"),
  short_name: optionalTextSchema(20, "Short name"),
  slug: slugSchema,
  description: optionalRichTextSchema(2000, "Description"),
  established_year: z
    .number()
    .int("Established year must be an integer.")
    .min(1868, "Established year cannot be earlier than 1868 (Ravenshaw College founding).")
    .max(new Date().getFullYear(), "Established year cannot be in the future.")
    .optional(),
  logo_media_id: uuidSchema.optional(),
  cover_media_id: uuidSchema.optional(),
  vision: optionalRichTextSchema(1000, "Vision statement"),
  mission: optionalRichTextSchema(1000, "Mission statement"),
  contact_email: emailSchema.optional(),
  contact_phone: phoneSchema.optional(),
  office_location: optionalTextSchema(150, "Office location"),
  hod_profile_id: uuidSchema.optional(),
  hod_message: optionalRichTextSchema(2000, "HOD message"),
  is_active: z.boolean().default(true),
});

/**
 * Update Department Schema
 */
export const updateDepartmentSchema = createDepartmentSchema.partial();

/**
 * Create Department CR Appointment Schema
 */
export const createDepartmentCRSchema = z.object({
  department_id: uuidSchema,
  profile_id: uuidSchema,
  academic_session_id: uuidSchema.optional(),
  role_title: textSchema(2, 100, "Role title").default("Department CR"),
  term_start_date: dateSchema,
  term_end_date: dateSchema.optional(),
  is_active: z.boolean().default(true),
  permissions_grant: z
    .object({
      can_post_notices: z.boolean().default(true),
      can_manage_gallery: z.boolean().default(true),
      can_manage_events: z.boolean().default(true),
      can_verify_students: z.boolean().optional(),
      can_upload_publications: z.boolean().optional(),
    })
    .catchall(z.boolean().optional()),
  remarks: optionalTextSchema(500, "Remarks"),
});

/**
 * Update Department CR Schema
 */
export const updateDepartmentCRSchema = createDepartmentCRSchema.partial();

/**
 * Create Department Teacher Roster Schema
 */
export const createDepartmentTeacherSchema = z.object({
  department_id: uuidSchema,
  profile_id: uuidSchema,
  designation_id: uuidSchema.optional(),
  designation_title: textSchema(2, 100, "Designation title").default("Faculty Member"),
  qualification: optionalTextSchema(150, "Qualification"),
  research_interests: z
    .array(textSchema(2, 50, "Research interest"))
    .max(20, "Cannot specify more than 20 research interests.")
    .optional(),
  office_location: optionalTextSchema(150, "Office location"),
  contact_email: emailSchema.optional(),
  contact_phone: phoneSchema.optional(),
  is_hod: z.boolean().default(false),
  is_visiting: z.boolean().default(false),
  is_active: z.boolean().default(true),
  display_order: z.number().int().min(0, "Display order cannot be negative.").default(0),
  bio_override: optionalRichTextSchema(2000, "Biography"),
});

/**
 * Update Department Teacher Schema
 */
export const updateDepartmentTeacherSchema = createDepartmentTeacherSchema.partial();

/**
 * Create Department Student Affiliation Schema
 */
export const createDepartmentStudentSchema = z.object({
  department_id: uuidSchema,
  profile_id: uuidSchema,
  batch_id: uuidSchema.optional(),
  academic_session_id: uuidSchema.optional(),
  department_program_id: uuidSchema.optional(),
  leadership_role: optionalTextSchema(100, "Leadership role"),
  is_featured: z.boolean().default(false),
  is_verified_by_cr: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

/**
 * Update Department Student Schema
 */
export const updateDepartmentStudentSchema = createDepartmentStudentSchema.partial();

// ============================================================================
// 3. Content Validation Schemas (Notices, Events, Publications)
// ============================================================================

/**
 * Create Department Notice Schema
 */
export const createDepartmentNoticeSchema = z.object({
  department_id: uuidSchema,
  title: textSchema(5, 250, "Notice title"),
  slug: slugSchema,
  content: richTextSchema(10, 10000, "Notice content"),
  priority: z.enum(["low", "normal", "high", "critical"]).default("normal"),
  target_audience: z.enum(["all", "students", "faculty", "alumni"]).default("all"),
  attachment_media_id: uuidSchema.optional(),
  published_at: dateTimeSchema.optional(),
  expires_at: dateTimeSchema.optional(),
  is_published: z.boolean().default(true),
  is_pinned: z.boolean().default(false),
});

/**
 * Update Department Notice Schema
 */
export const updateDepartmentNoticeSchema = createDepartmentNoticeSchema.partial();

/**
 * Create Department Event Schema
 */
export const createDepartmentEventSchema = z.object({
  department_id: uuidSchema,
  title: textSchema(5, 250, "Event title"),
  slug: slugSchema,
  description: richTextSchema(10, 10000, "Event description"),
  event_type: z
    .enum([
      "seminar",
      "workshop",
      "conference",
      "guest_lecture",
      "festival",
      "farewell",
      "freshers",
      "competition",
      "other",
    ])
    .default("seminar"),
  venue: textSchema(2, 200, "Event venue"),
  event_start_time: dateTimeSchema,
  event_end_time: dateTimeSchema,
  cover_media_id: uuidSchema.optional(),
  registration_url: optionalUrlSchema,
  is_registration_required: z.boolean().default(false),
  coordinator_profile_id: uuidSchema.optional(),
  is_published: z.boolean().default(true),
  is_featured: z.boolean().default(false),
});

/**
 * Update Department Event Schema
 */
export const updateDepartmentEventSchema = createDepartmentEventSchema.partial();

/**
 * Create Department Publication (Annual Magazine) Schema
 */
export const createDepartmentPublicationSchema = z.object({
  department_id: uuidSchema,
  academic_session_id: uuidSchema.optional(),
  title: textSchema(5, 250, "Publication title"),
  slug: slugSchema,
  publication_type: z
    .enum(["annual_magazine", "newsletter", "research_journal", "souvenir", "proceedings", "other"])
    .default("annual_magazine"),
  description: optionalRichTextSchema(2000, "Publication description"),
  publish_date: dateSchema,
  volume_number: optionalTextSchema(50, "Volume number"),
  editor_in_chief: optionalTextSchema(150, "Editor in chief"),
  cover_media_id: uuidSchema.optional(),
  document_media_id: uuidSchema,
  is_public: z.boolean().default(true),
});

/**
 * Update Department Publication Schema
 */
export const updateDepartmentPublicationSchema = createDepartmentPublicationSchema.partial();

// ============================================================================
// 4. View & Showcase Response Validation Schemas
// ============================================================================

/**
 * Validation schema for Department Statistics view items
 */
export const departmentStatisticsSchema = z.object({
  department_id: uuidSchema,
  department_name: z.string(),
  department_slug: z.string(),
  is_active: z.boolean(),
  is_verified: z.boolean(),
  total_students: z.number().int().min(0),
  total_teachers: z.number().int().min(0),
  total_crs: z.number().int().min(0),
  total_events: z.number().int().min(0),
  total_notices: z.number().int().min(0),
  total_publications: z.number().int().min(0),
  total_gallery_albums: z.number().int().min(0),
  total_achievements: z.number().int().min(0),
});

/**
 * Validation schema for Department Gallery showcase items
 */
export const departmentGallerySchema = z.object({
  album_id: uuidSchema,
  public_id: z.string(),
  department_id: uuidSchema,
  department_name: z.string().optional(),
  department_slug: z.string().optional(),
  title: z.string(),
  album_slug: z.string(),
  description: z.string().optional(),
  cover_media_id: uuidSchema.optional(),
  cover_url: z.string().url().optional(),
  is_featured: z.boolean(),
  item_count: z.number().int().min(0),
});

/**
 * Validation schema for Department Achievement showcase items
 */
export const departmentAchievementSchema = z.object({
  achievement_id: uuidSchema,
  public_id: z.string(),
  department_id: uuidSchema,
  department_name: z.string().optional(),
  department_slug: z.string().optional(),
  category_name: z.string().optional(),
  title: z.string(),
  achievement_slug: z.string(),
  description: z.string().optional(),
  achievement_date: z.string().optional(),
  issuing_organization: z.string().optional(),
  featured_image_url: z.string().url().optional(),
  is_featured: z.boolean(),
});

/**
 * Validation schema for Department News showcase items
 */
export const departmentNewsSchema = z.object({
  content_id: uuidSchema,
  public_id: z.string(),
  department_id: uuidSchema,
  department_name: z.string().optional(),
  department_slug: z.string().optional(),
  title: z.string(),
  news_slug: z.string(),
  summary: z.string().optional(),
  body: z.string(),
  featured_image_url: z.string().url().optional(),
  published_at: z.string().optional(),
  view_count: z.number().int().min(0),
  is_featured: z.boolean(),
});

// ============================================================================
// 5. Search & Filter Query Schemas
// ============================================================================

/**
 * General Department Search & Pagination Schema
 */
export const departmentSearchSchema = z.object({
  query: optionalTextSchema(100, "Search query"),
  is_active: z.boolean().optional(),
  is_verified: z.boolean().optional(),
  page: z.coerce.number().int().min(1, "Page must be at least 1.").default(1),
  pageSize: z.coerce.number().int().min(1).max(100, "Page size cannot exceed 100.").default(20),
});

/**
 * Notice Filtering Schema
 */
export const departmentNoticeFilterSchema = z.object({
  department_id: uuidSchema.optional(),
  priority: z.enum(["low", "normal", "high", "critical"]).optional(),
  target_audience: z.enum(["all", "students", "faculty", "alumni"]).optional(),
  is_pinned: z.boolean().optional(),
  is_published: z.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Event Filtering Schema
 */
export const departmentEventFilterSchema = z.object({
  department_id: uuidSchema.optional(),
  event_type: z
    .enum([
      "seminar",
      "workshop",
      "conference",
      "guest_lecture",
      "festival",
      "farewell",
      "freshers",
      "competition",
      "other",
    ])
    .optional(),
  is_featured: z.boolean().optional(),
  is_published: z.boolean().optional(),
  upcoming_only: z.boolean().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Faculty Teacher Roster Filtering Schema
 */
export const departmentTeacherFilterSchema = z.object({
  department_id: uuidSchema.optional(),
  is_hod: z.boolean().optional(),
  is_visiting: z.boolean().optional(),
  is_active: z.boolean().optional(),
  search: optionalTextSchema(100, "Search query"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

/**
 * Student Roster Directory Filtering Schema
 */
export const departmentStudentFilterSchema = z.object({
  department_id: uuidSchema.optional(),
  batch_id: uuidSchema.optional(),
  academic_session_id: uuidSchema.optional(),
  is_featured: z.boolean().optional(),
  is_verified_by_cr: z.boolean().optional(),
  is_active: z.boolean().optional(),
  search: optionalTextSchema(100, "Search query"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

// ============================================================================
// 6. Inferred TypeScript Types from Schemas
// ============================================================================

export type CreateDepartmentPayload = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentPayload = z.infer<typeof updateDepartmentSchema>;
export type CreateDepartmentCRPayload = z.infer<typeof createDepartmentCRSchema>;
export type UpdateDepartmentCRPayload = z.infer<typeof updateDepartmentCRSchema>;
export type CreateDepartmentTeacherPayload = z.infer<typeof createDepartmentTeacherSchema>;
export type UpdateDepartmentTeacherPayload = z.infer<typeof updateDepartmentTeacherSchema>;
export type CreateDepartmentStudentPayload = z.infer<typeof createDepartmentStudentSchema>;
export type UpdateDepartmentStudentPayload = z.infer<typeof updateDepartmentStudentSchema>;
export type CreateDepartmentNoticePayload = z.infer<typeof createDepartmentNoticeSchema>;
export type UpdateDepartmentNoticePayload = z.infer<typeof updateDepartmentNoticeSchema>;
export type CreateDepartmentEventPayload = z.infer<typeof createDepartmentEventSchema>;
export type UpdateDepartmentEventPayload = z.infer<typeof updateDepartmentEventSchema>;
export type CreateDepartmentPublicationPayload = z.infer<typeof createDepartmentPublicationSchema>;
export type UpdateDepartmentPublicationPayload = z.infer<typeof updateDepartmentPublicationSchema>;
export type DepartmentSearchQuery = z.infer<typeof departmentSearchSchema>;
export type DepartmentNoticeFilterQuery = z.infer<typeof departmentNoticeFilterSchema>;
export type DepartmentEventFilterQuery = z.infer<typeof departmentEventFilterSchema>;
export type DepartmentTeacherFilterQuery = z.infer<typeof departmentTeacherFilterSchema>;
export type DepartmentStudentFilterQuery = z.infer<typeof departmentStudentFilterSchema>;
