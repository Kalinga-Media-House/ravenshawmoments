import { describe, it, expect } from "vitest";
import { createHostelSchema, updateHostelSchema } from "@/lib/validation/hostel-system";

describe("Hostel System Validation", () => {
  it("should validate a valid hostel creation payload", () => {
    const payload = {
      name: "Kathajodi Boys Hostel",
      slug: "kathajodi-boys",
      hostel_type: "university_boys",
      address: "East Campus, Ravenshaw University",
      contact_number: "+91-9876543210",
      contact_email: "kathajodi@ravenshaw.edu",
    };
    const result = createHostelSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });

  it("should reject invalid slug formats", () => {
    const payload = {
      name: "Valid Name",
      slug: "Invalid Slug!",
      hostel_type: "university_boys",
      address: "Valid Address",
    };
    const result = createHostelSchema.safeParse(payload);
    expect(result.success).toBe(false);
  });

  it("should validate partial updates correctly", () => {
    const payload = {
      description: "Updated description",
    };
    const result = updateHostelSchema.safeParse(payload);
    expect(result.success).toBe(true);
  });
});
