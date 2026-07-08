// =============================================================================
// Ravenshaw Moments
// File      : src/lib/validation/organization-system.ts
// Purpose   : Zod Validation Schemas for Organization Ecosystem
// =============================================================================

import { z } from "zod";

// =============================================================================
// Common Field Validations
// =============================================================================

const uuidSchema = z.string().uuid("Invalid UUID format");

const slugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(100, "Slug cannot exceed 100 characters")
  .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens");

// =============================================================================
// 1. Organization Validation
// =============================================================================

export const createOrganizationSchema = z.object({
  name: z.string().min(2, "Organization name must be at least 2 characters").max(255),
  slug: slugSchema,
  org_type: z.enum(["ncc", "nss", "yrc", "rotaract", "cell", "society", "club", "council", "other"]).default("club"),
  description: z.string().max(5000, "Description cannot exceed 5000 characters").optional(),
  vision: z.string().max(2000).optional(),
  mission: z.string().max(2000).optional(),
  established_year: z.number().int().min(1868).max(new Date().getFullYear()).optional(),
  contact_email: z.string().email("Must be a valid email").optional(),
  contact_phone: z.string().max(50).optional(),
  social_links: z.record(z.string(), z.string().url()).optional().default({}),
  logo_url: z.string().url().optional(),
  cover_image_url: z.string().url().optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial().omit({
  slug: true,
  org_type: true,
});

export type CreateOrganizationPayload = z.infer<typeof createOrganizationSchema>;
export type UpdateOrganizationPayload = z.infer<typeof updateOrganizationSchema>;

// =============================================================================
// 2. Organization Members Validation
// =============================================================================

export const createOrganizationMemberSchema = z.object({
  org_id: uuidSchema,
  profile_id: uuidSchema,
  role: z.enum(["member", "executive", "office_bearer", "alumni", "honorary"]).default("member"),
  designation: z.string().max(255).optional(),
  start_date: z.string().date("Must be a valid date"),
  end_date: z.string().date("Must be a valid date").optional(),
  status: z.enum(["active", "alumni", "past"]).default("active"),
  can_manage_org: z.boolean().default(false),
});

export const updateOrganizationMemberSchema = createOrganizationMemberSchema.partial().omit({
  org_id: true,
  profile_id: true,
});

export type CreateOrganizationMemberPayload = z.infer<typeof createOrganizationMemberSchema>;
export type UpdateOrganizationMemberPayload = z.infer<typeof updateOrganizationMemberSchema>;

// =============================================================================
// 3. Organization Advisors Validation
// =============================================================================

export const createOrganizationAdvisorSchema = z.object({
  org_id: uuidSchema,
  profile_id: uuidSchema.optional(),
  name: z.string().min(2).max(255),
  designation: z.string().min(2).max(255),
  department: z.string().max(255).optional(),
  start_date: z.string().date(),
  end_date: z.string().date().optional(),
  is_current: z.boolean().default(true),
});

export const updateOrganizationAdvisorSchema = createOrganizationAdvisorSchema.partial().omit({
  org_id: true,
});

export type CreateOrganizationAdvisorPayload = z.infer<typeof createOrganizationAdvisorSchema>;
export type UpdateOrganizationAdvisorPayload = z.infer<typeof updateOrganizationAdvisorSchema>;

// =============================================================================
// 4. Organization Events Validation
// =============================================================================

const baseOrganizationEventSchema = z.object({
  org_id: uuidSchema,
  title: z.string().min(3).max(255),
  slug: slugSchema,
  category: z.enum(["workshop", "camp", "drive", "cultural", "competition", "meeting"]).default("workshop"),
  description: z.string().max(5000).optional(),
  venue: z.string().min(2).max(255),
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  is_published: z.boolean().default(true),
  is_registration_required: z.boolean().default(false),
  registration_url: z.string().url().optional(),
});

export const createOrganizationEventSchema = baseOrganizationEventSchema.refine(
  (data) => new Date(data.end_time).getTime() > new Date(data.start_time).getTime(),
  {
    message: "End time must be after start time",
    path: ["end_time"],
  }
);

export const updateOrganizationEventSchema = baseOrganizationEventSchema.partial().omit({
  org_id: true,
  slug: true,
});

export type CreateOrganizationEventPayload = z.infer<typeof createOrganizationEventSchema>;
export type UpdateOrganizationEventPayload = z.infer<typeof updateOrganizationEventSchema>;

// =============================================================================
// 5. Organization Gallery Validation
// =============================================================================

export const createOrganizationGalleryItemSchema = z.object({
  org_id: uuidSchema,
  title: z.string().min(3).max(255),
  description: z.string().max(1000).optional(),
  media_type: z.enum(["image", "video"]).default("image"),
  media_url: z.string().url(),
  thumbnail_url: z.string().url().optional(),
  event_id: uuidSchema.optional(),
  is_featured: z.boolean().default(false),
});

export const updateOrganizationGalleryItemSchema = createOrganizationGalleryItemSchema.partial().omit({
  org_id: true,
});

export type CreateOrganizationGalleryItemPayload = z.infer<typeof createOrganizationGalleryItemSchema>;
export type UpdateOrganizationGalleryItemPayload = z.infer<typeof updateOrganizationGalleryItemSchema>;

// =============================================================================
// 6. Organization Notices Validation
// =============================================================================

export const createOrganizationNoticeSchema = z.object({
  org_id: uuidSchema,
  title: z.string().min(5).max(255),
  content: z.string().min(10),
  priority: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  audience: z.enum(["public", "members", "executives"]).default("public"),
  attachment_url: z.string().url().optional(),
  expires_at: z.string().datetime().optional(),
});

export const updateOrganizationNoticeSchema = createOrganizationNoticeSchema.partial().omit({
  org_id: true,
});

export type CreateOrganizationNoticePayload = z.infer<typeof createOrganizationNoticeSchema>;
export type UpdateOrganizationNoticePayload = z.infer<typeof updateOrganizationNoticeSchema>;

// =============================================================================
// 7. Organization Achievements Validation
// =============================================================================

export const createOrganizationAchievementSchema = z.object({
  org_id: uuidSchema,
  title: z.string().min(5).max(255),
  description: z.string().min(10).max(2000),
  date: z.string().date(),
  category: z.enum(["award", "recognition", "competition", "impact"]).default("award"),
  image_url: z.string().url().optional(),
});

export const updateOrganizationAchievementSchema = createOrganizationAchievementSchema.partial().omit({
  org_id: true,
});

export type CreateOrganizationAchievementPayload = z.infer<typeof createOrganizationAchievementSchema>;
export type UpdateOrganizationAchievementPayload = z.infer<typeof updateOrganizationAchievementSchema>;

// =============================================================================
// 8. Organization Publications Validation
// =============================================================================

export const createOrganizationPublicationSchema = z.object({
  org_id: uuidSchema,
  title: z.string().min(5).max(255),
  type: z.enum(["annual_report", "magazine", "newsletter", "research"]).default("annual_report"),
  description: z.string().max(2000).optional(),
  publication_date: z.string().date(),
  file_url: z.string().url(),
  cover_image_url: z.string().url().optional(),
});

export const updateOrganizationPublicationSchema = createOrganizationPublicationSchema.partial().omit({
  org_id: true,
});

export type CreateOrganizationPublicationPayload = z.infer<typeof createOrganizationPublicationSchema>;
export type UpdateOrganizationPublicationPayload = z.infer<typeof updateOrganizationPublicationSchema>;
