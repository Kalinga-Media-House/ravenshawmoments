import { describe, it, expect } from "vitest";
import {
  basicProfileSchema,
  academicRecordSchema,
  privacySettingsSchema,
  profileClaimSchema,
  galleryItemSchema,
  contributionProofSchema,
  PROFILE_FILE_RULES,
} from "@/lib/validation/profile-system";

describe("Profile System Validation Schemas", () => {
  describe("PROFILE_FILE_RULES", () => {
    it("should define strict limits and MIME types", () => {
      expect(PROFILE_FILE_RULES.MAX_IMAGE_SIZE_BYTES).toBe(5 * 1024 * 1024);
      expect(PROFILE_FILE_RULES.MAX_GALLERY_QUOTA).toBe(50);
      expect(PROFILE_FILE_RULES.ALLOWED_IMAGE_MIMES).toContain("image/webp");
    });
  });

  describe("basicProfileSchema", () => {
    it("should pass valid basic profile data", () => {
      const result = basicProfileSchema.safeParse({
        full_name: "Biswamohan Student",
        username: "biswa_rm",
        bio: "Proud student at Ravenshaw University.",
        gender: "male",
        avatar_url: "https://example.com/avatar.png",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.username).toBe("biswa_rm");
      }
    });

    it("should reject usernames with invalid characters", () => {
      const result = basicProfileSchema.safeParse({
        full_name: "John Doe",
        username: "john doe!@#",
      });
      expect(result.success).toBe(false);
    });

    it("should reject full names under 2 characters", () => {
      const result = basicProfileSchema.safeParse({
        full_name: "J",
        username: "johndoe",
      });
      expect(result.success).toBe(false);
    });

    it("should transform empty string bio to undefined", () => {
      const result = basicProfileSchema.safeParse({
        full_name: "Jane Doe",
        username: "janedoe",
        bio: "",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.bio).toBeUndefined();
      }
    });
  });

  describe("academicRecordSchema", () => {
    it("should validate correct academic records and uppercase roll number", () => {
      const result = academicRecordSchema.safeParse({
        department_id: "550e8400-e29b-41d4-a716-446655440000",
        batch_id: "550e8400-e29b-41d4-a716-446655440001",
        roll_number: "cs-2024-001",
        date_of_birth: "2003-05-15",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.roll_number).toBe("CS-2024-001");
      }
    });

    it("should reject invalid date of birth formats", () => {
      const result = academicRecordSchema.safeParse({
        department_id: "550e8400-e29b-41d4-a716-446655440000",
        batch_id: "550e8400-e29b-41d4-a716-446655440001",
        roll_number: "2024001",
        date_of_birth: "15-05-2003",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("privacySettingsSchema", () => {
    it("should validate standard visibility matrices", () => {
      const result = privacySettingsSchema.safeParse({
        profile_visibility: "public",
        email_visibility: "private",
        phone_visibility: "private",
        dob_visibility: "ravenshaw_only",
        gallery_visibility: "public",
        achievements_visibility: "public",
      });
      expect(result.success).toBe(true);
    });

    it("should reject unknown visibility options", () => {
      const result = privacySettingsSchema.safeParse({
        profile_visibility: "everyone",
        email_visibility: "private",
        phone_visibility: "private",
        dob_visibility: "private",
        gallery_visibility: "private",
        achievements_visibility: "private",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("profileClaimSchema", () => {
    it("should require a valid URL for supporting document", () => {
      const valid = profileClaimSchema.safeParse({
        roll_number: "2024-CSC-010",
        supporting_document_url: "https://storage.supabase.co/proof.pdf",
      });
      expect(valid.success).toBe(true);

      const invalid = profileClaimSchema.safeParse({
        roll_number: "2024-CSC-010",
        supporting_document_url: "not-a-url",
      });
      expect(invalid.success).toBe(false);
    });
  });

  describe("galleryItemSchema", () => {
    it("should set default display order and feature flags", () => {
      const result = galleryItemSchema.safeParse({
        media_file_id: "550e8400-e29b-41d4-a716-446655440002",
        media_url: "https://example.com/photo.jpg",
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.display_order).toBe(0);
        expect(result.data.is_cover).toBe(false);
        expect(result.data.is_featured).toBe(false);
      }
    });

    it("should reject captions exceeding 200 characters", () => {
      const result = galleryItemSchema.safeParse({
        media_file_id: "550e8400-e29b-41d4-a716-446655440002",
        media_url: "https://example.com/photo.jpg",
        caption: "a".repeat(201),
      });
      expect(result.success).toBe(false);
    });
  });

  describe("contributionProofSchema", () => {
    it("should validate non-negative amount references", () => {
      const result = contributionProofSchema.safeParse({
        title: "Alumni Donation",
        amount_reference: 5000,
        media_file_id: "550e8400-e29b-41d4-a716-446655440003",
      });
      expect(result.success).toBe(true);
    });

    it("should reject negative amounts", () => {
      const result = contributionProofSchema.safeParse({
        title: "Alumni Donation",
        amount_reference: -100,
        media_file_id: "550e8400-e29b-41d4-a716-446655440003",
      });
      expect(result.success).toBe(false);
    });
  });
});
