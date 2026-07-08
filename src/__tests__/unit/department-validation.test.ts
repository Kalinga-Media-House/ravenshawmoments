// =============================================================================
// Ravenshaw Moments
// File      : src/__tests__/unit/department-validation.test.ts
// Purpose   : Unit Tests for Department Module Validation Schemas
// =============================================================================

import { describe, it, expect } from "vitest";
import {
  createDepartmentSchema,
  updateDepartmentSchema,
  createDepartmentCRSchema,
  createDepartmentTeacherSchema,
  createDepartmentStudentSchema,
  createDepartmentNoticeSchema,
  createDepartmentEventSchema,
  createDepartmentPublicationSchema,
} from "@/lib/validation/department-system";

const VALID_UUID_1 = "550e8400-e29b-41d4-a716-446655440000";
const VALID_UUID_2 = "550e8400-e29b-41d4-a716-446655440001";
const VALID_UUID_3 = "550e8400-e29b-41d4-a716-446655440002";

describe("Department Module Validation Schemas", () => {
  describe("createDepartmentSchema", () => {
    it("should pass valid department creation data", () => {
      const result = createDepartmentSchema.safeParse({
        name: "Department of Computer Science",
        short_name: "CSC",
        slug: "computer-science",
        description: "Premier computer science department.",
        established_year: 1998,
        contact_email: "cs@ravenshawmoments.com",
        office_location: "IT Block Room 101",
      });
      expect(result.success).toBe(true);
    });

    it("should reject invalid slug format or short name", () => {
      const invalidSlug = createDepartmentSchema.safeParse({
        name: "Department of Physics",
        slug: "Invalid Slug With Spaces!",
      });
      expect(invalidSlug.success).toBe(false);
    });
  });

  describe("updateDepartmentSchema", () => {
    it("should pass partial updates", () => {
      const result = updateDepartmentSchema.safeParse({
        vision: "Excellence in computing research and education.",
        contact_phone: "+91 671 2410 100",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("createDepartmentCRSchema", () => {
    it("should validate CR appointment with permissions", () => {
      const now = "2026-07-01";
      const result = createDepartmentCRSchema.safeParse({
        department_id: VALID_UUID_1,
        profile_id: VALID_UUID_2,
        role_title: "Department Representative",
        term_start_date: now,
        permissions_grant: {
          can_post_notices: true,
          can_manage_gallery: true,
          can_manage_events: true,
        },
      });
      expect(result.success).toBe(true);
    });
  });

  describe("createDepartmentTeacherSchema", () => {
    it("should validate teacher assignment with designation", () => {
      const result = createDepartmentTeacherSchema.safeParse({
        department_id: VALID_UUID_1,
        profile_id: VALID_UUID_2,
        designation_title: "Associate Professor",
        qualification: "Ph.D. in Computer Science",
        is_hod: true,
        is_visiting: false,
        display_order: 1,
      });
      expect(result.success).toBe(true);
    });

    it("should fail when designation_title is empty", () => {
      const result = createDepartmentTeacherSchema.safeParse({
        department_id: VALID_UUID_1,
        profile_id: VALID_UUID_2,
        designation_title: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("createDepartmentStudentSchema", () => {
    it("should pass valid student enrollment verification", () => {
      const result = createDepartmentStudentSchema.safeParse({
        department_id: VALID_UUID_1,
        profile_id: VALID_UUID_2,
        leadership_role: "Tech Club Coordinator",
        is_featured: true,
      });
      expect(result.success).toBe(true);
    });
  });

  describe("createDepartmentNoticeSchema", () => {
    it("should pass valid circular notice payload", () => {
      const result = createDepartmentNoticeSchema.safeParse({
        department_id: VALID_UUID_1,
        title: "Mid-Semester Practical Examination Schedule",
        slug: "mid-sem-practical-2026",
        content: "Please find the attached practical exam timetable for Sem 5.",
        is_pinned: true,
      });
      expect(result.success).toBe(true);
    });

    it("should reject notice titles shorter than 5 characters", () => {
      const result = createDepartmentNoticeSchema.safeParse({
        department_id: VALID_UUID_1,
        title: "Hi",
        slug: "hi",
        content: "Short title circular.",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("createDepartmentEventSchema", () => {
    it("should validate scheduled academic event dates correctly", () => {
      const now = new Date().toISOString();
      const result = createDepartmentEventSchema.safeParse({
        department_id: VALID_UUID_1,
        title: "National Symposium on Quantum AI",
        slug: "national-symposium-quantum-ai",
        description: "Annual two-day symposium organized by Computer Science.",
        event_type: "seminar",
        event_start_time: now,
        event_end_time: now,
        venue: "Convention Centre Auditorium",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("createDepartmentPublicationSchema", () => {
    it("should pass valid department syllabus or publication entry", () => {
      const result = createDepartmentPublicationSchema.safeParse({
        department_id: VALID_UUID_1,
        title: "B.Sc Computer Science CBCS Syllabus 2024",
        slug: "bsc-cs-cbcs-2024",
        publish_date: "2026-07-01",
        document_media_id: VALID_UUID_3,
        is_public: true,
      });
      expect(result.success).toBe(true);
    });
  });
});
