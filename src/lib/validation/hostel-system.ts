// =============================================================================
// Ravenshaw Moments
// File      : src/lib/validation/hostel-system.ts
// Purpose   : Zod Validation Schemas & Inferred Types for Universal Hostel Ecosystem
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

const roomTypeSchema = z.object({
  type: z.string().min(1, "Room type name is required").max(100),
  capacity: z.number().int().min(1, "Capacity must be at least 1"),
  rentPerMonth: z.string().optional(),
  isAvailable: z.boolean().optional().default(true),
});

const facilitySchema = z.object({
  name: z.string().min(1, "Facility name is required").max(100),
  category: z.enum(["basic", "security", "recreation", "dining"]).optional(),
  iconName: z.string().optional(),
});

// =============================================================================
// 1. Hostel & Housing Hub Validation
// =============================================================================

export const createHostelSchema = z.object({
  name: z.string().min(3, "Hostel name must be at least 3 characters").max(150),
  slug: slugSchema,
  hostel_type: z.enum(["university_boys", "university_girls", "private_sponsored"]),
  description: z.string().max(3000, "Description cannot exceed 3000 characters").optional(),
  history: z.string().max(5000, "History cannot exceed 5000 characters").optional(),
  address: z.string().min(5, "Address must be at least 5 characters").max(500),
  google_maps_url: z.string().url("Must be a valid Google Maps URL").optional(),
  contact_number: z.string().max(50).optional(),
  contact_email: z.string().email("Must be a valid email").optional(),
  owner_name: z.string().max(255).optional(),
  rent_info: z.string().max(1000).optional(),
  room_types: z.array(roomTypeSchema).optional().default([]),
  facilities: z.array(facilitySchema).optional().default([]),
  cover_image_url: z.string().url().optional(),
  logo_url: z.string().url().optional(),
});

export const updateHostelSchema = createHostelSchema.partial().omit({
  slug: true,
  hostel_type: true,
});

export type CreateHostelPayload = z.infer<typeof createHostelSchema>;
export type UpdateHostelPayload = z.infer<typeof updateHostelSchema>;

// =============================================================================
// 2. Hostel Warden Validation
// =============================================================================

export const createHostelWardenSchema = z.object({
  hostel_id: uuidSchema,
  profile_id: uuidSchema.optional(),
  name: z.string().min(2, "Warden name is required").max(255),
  designation: z.string().min(2, "Designation is required").max(255),
  contact_number: z.string().max(50).optional(),
  email: z.string().email().optional(),
  office_location: z.string().max(255).optional(),
  tenure_start: z.string().optional(),
  tenure_end: z.string().optional(),
  is_current: z.boolean().default(true),
});

export const updateHostelWardenSchema = createHostelWardenSchema.partial().omit({
  hostel_id: true,
});

export type CreateHostelWardenPayload = z.infer<typeof createHostelWardenSchema>;
export type UpdateHostelWardenPayload = z.infer<typeof updateHostelWardenSchema>;

// =============================================================================
// 3. Hostel BMC Council Validation
// =============================================================================

export const hostelBMCPermissionsSchema = z.object({
  can_post_notices: z.boolean().default(false),
  can_manage_events: z.boolean().default(false),
  can_manage_gallery: z.boolean().default(false),
  can_verify_residents: z.boolean().default(false),
});

export const createHostelBMCSchema = z.object({
  hostel_id: uuidSchema,
  profile_id: uuidSchema,
  role_title: z.enum([
    "general_secretary",
    "mess_secretary",
    "cultural_secretary",
    "sports_secretary",
    "member",
  ]),
  permissions_grant: hostelBMCPermissionsSchema.default({
    can_post_notices: false,
    can_manage_events: false,
    can_manage_gallery: false,
    can_verify_residents: false,
  }),
  term_year: z.string().min(4, "Invalid term year").max(20),
  is_active: z.boolean().default(true),
});

export const updateHostelBMCSchema = createHostelBMCSchema.partial().omit({
  hostel_id: true,
  profile_id: true,
});

export type CreateHostelBMCPayload = z.infer<typeof createHostelBMCSchema>;
export type UpdateHostelBMCPayload = z.infer<typeof updateHostelBMCSchema>;

// =============================================================================
// 4. Hostel Resident & Alumni Validation
// =============================================================================

export const createHostelResidentSchema = z.object({
  hostel_id: uuidSchema,
  profile_id: uuidSchema,
  room_number: z.string().max(50).optional(),
  batch_year: z.string().min(4, "Invalid batch year").max(20),
  department_name: z.string().max(255).optional(),
  is_alumni: z.boolean().default(false),
  joined_date: z.string().optional(),
  left_date: z.string().optional(),
});

export const updateHostelResidentSchema = createHostelResidentSchema.partial().omit({
  hostel_id: true,
  profile_id: true,
});

export type CreateHostelResidentPayload = z.infer<typeof createHostelResidentSchema>;
export type UpdateHostelResidentPayload = z.infer<typeof updateHostelResidentSchema>;

// =============================================================================
// 5. Hostel Notice Validation
// =============================================================================

export const createHostelNoticeSchema = z.object({
  hostel_id: uuidSchema,
  title: z.string().min(3, "Title must be at least 3 characters").max(255),
  slug: slugSchema,
  content: z.string().min(10, "Content must be at least 10 characters").max(10000),
  priority: z.enum(["low", "normal", "high", "critical"]).default("normal"),
  target_audience: z.enum(["all", "residents", "alumni"]).default("all"),
  is_published: z.boolean().default(true),
  is_pinned: z.boolean().default(false),
  expires_at: z.string().datetime().optional(),
});

export const updateHostelNoticeSchema = createHostelNoticeSchema.partial().omit({
  hostel_id: true,
  slug: true,
});

export type CreateHostelNoticePayload = z.infer<typeof createHostelNoticeSchema>;
export type UpdateHostelNoticePayload = z.infer<typeof updateHostelNoticeSchema>;

// =============================================================================
// 6. Hostel Event Validation
// =============================================================================

export const createHostelEventSchema = z
  .object({
    hostel_id: uuidSchema,
    title: z.string().min(3).max(255),
    slug: slugSchema,
    category: z.enum(["festival", "competition", "farewell", "freshers", "other"]).default("festival"),
    description: z.string().max(5000).optional(),
    venue: z.string().min(2).max(255),
    start_time: z.string().datetime(),
    end_time: z.string().datetime(),
    is_published: z.boolean().default(true),
    is_registration_required: z.boolean().default(false),
    registration_url: z.string().url().optional(),
  })
  .refine(
    (data) => new Date(data.end_time).getTime() > new Date(data.start_time).getTime(),
    {
      message: "End time must be after start time",
      path: ["end_time"],
    }
  );

export const updateHostelEventSchema = createHostelEventSchema.partial().omit({
  hostel_id: true,
  slug: true,
});

export type CreateHostelEventPayload = z.infer<typeof createHostelEventSchema>;
export type UpdateHostelEventPayload = z.infer<typeof updateHostelEventSchema>;

// =============================================================================
// 7. Hostel Gallery Item Validation
// =============================================================================

export const createHostelGalleryItemSchema = z.object({
  hostel_id: uuidSchema,
  media_id: z.string().min(1),
  media_url: z.string().url(),
  title: z.string().max(255).optional(),
  caption: z.string().max(1000).optional(),
  category: z.enum(["event", "historic", "daily_life", "celebration"]).default("event"),
  display_order: z.number().int().min(0).default(0),
  is_public: z.boolean().default(true),
});

export const updateHostelGalleryItemSchema = createHostelGalleryItemSchema.partial().omit({
  hostel_id: true,
  media_id: true,
});

export type CreateHostelGalleryItemPayload = z.infer<typeof createHostelGalleryItemSchema>;
export type UpdateHostelGalleryItemPayload = z.infer<typeof updateHostelGalleryItemSchema>;

// =============================================================================
// 8. Hostel Achievement Validation
// =============================================================================

export const createHostelAchievementSchema = z.object({
  hostel_id: uuidSchema,
  resident_profile_id: uuidSchema.optional(),
  title: z.string().min(3).max(255),
  description: z.string().max(3000).optional(),
  category: z.enum(["academic", "sports", "cultural", "leadership", "inter_hostel"]).default("inter_hostel"),
  awarded_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Must be formatted as YYYY-MM-DD"),
  issuer: z.string().max(255).optional(),
  certificate_media_id: z.string().optional(),
  certificate_url: z.string().url().optional(),
});

export const updateHostelAchievementSchema = createHostelAchievementSchema.partial().omit({
  hostel_id: true,
});

export type CreateHostelAchievementPayload = z.infer<typeof createHostelAchievementSchema>;
export type UpdateHostelAchievementPayload = z.infer<typeof updateHostelAchievementSchema>;
