import { z } from "zod";
import { uuidSchema } from "./common";

export const uploadMediaSchema = z.object({
  file: z.instanceof(File, { message: "Valid file is required" }),
  bucket: z.enum(["gallery", "profiles", "achievements", "content", "departments"]),
  title: z.string().max(255).optional(),
  altText: z.string().max(255).optional(),
  caption: z.string().max(500).optional(),
  entityType: z.string().max(50).optional(),
  entityId: uuidSchema.optional(),
});

// A standard image validation matching the DB `app.allowed_image_mime`
export const imageValidation = z
  .custom<File>((v) => v instanceof File, "Must be a file")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "Only JPG, PNG and WEBP formats are supported."
  )
  .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB.");
