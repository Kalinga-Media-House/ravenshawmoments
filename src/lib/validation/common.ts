import { z } from "zod";

export const uuidSchema = z.string().uuid("Invalid UUID format");

export const slugSchema = z
  .string()
  .min(2, "Slug must be at least 2 characters")
  .max(100, "Slug cannot exceed 100 characters")
  .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens");

export const idParamSchema = z.object({
  id: uuidSchema,
});

export const slugParamSchema = z.object({
  slug: slugSchema,
});
