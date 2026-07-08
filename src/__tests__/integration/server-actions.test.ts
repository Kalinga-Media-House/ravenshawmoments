import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  updateBasicProfile,
  updatePrivacySettings,
  claimStudentProfile,
  deleteProfileGalleryImageAction,
} from "@/app/actions/profile";
import { profileService } from "@/features/profile/services";

// Mock Supabase Auth
const mockGetUser = vi.fn();
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: { getUser: () => mockGetUser() },
  }),
}));

// Mock Profile Services
vi.mock("@/features/profile/services", () => ({
  profileService: {
    updateBasicProfile: vi.fn(),
    updateAcademicProfile: vi.fn(),
    deleteGalleryImageService: vi.fn(),
    claimProfile: vi.fn(),
    updatePrivacySettings: vi.fn(),
  },
}));

describe("Server Actions Integration & RBAC Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Authentication Enforcement", () => {
    it("updateBasicProfile should return error if user is unauthenticated", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: new Error("Unauthenticated") });

      const formData = new FormData();
      formData.append("full_name", "Test User");
      formData.append("username", "testuser");

      const res = await updateBasicProfile(formData);
      expect(res.success).toBe(false);
      expect(res.error).toEqual({ code: "UNAUTHORIZED", message: "Authentication required." });
      expect(profileService.updateBasicProfile).not.toHaveBeenCalled();
    });

    it("deleteProfileGalleryImageAction should reject unauthenticated requests", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });
      const res = await deleteProfileGalleryImageAction("img-uuid-123");
      expect(res.success).toBe(false);
      expect(res.error).toEqual({ code: "UNAUTHORIZED", message: "Authentication required." });
    });
  });

  describe("Input Validation & Sanitization", () => {
    it("updateBasicProfile should return validation error on invalid input data", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "user-1", email: "test@ravenshaw.edu" } } });
      vi.mocked(profileService.updateBasicProfile).mockRejectedValue(new Error("Full name must be at least 2 characters"));

      const formData = new FormData();
      formData.append("full_name", "A"); // Too short
      formData.append("username", "test!"); // Invalid character

      const res = await updateBasicProfile(formData);
      expect(res.success).toBe(false);
      expect(res.error?.message).toContain("Full name must be at least 2 characters");
    });
  });

  describe("Service Delegation on Valid Input", () => {
    it("updateBasicProfile should delegate to profileService when input is valid", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "user-1", email: "test@ravenshaw.edu" } } });
      vi.mocked(profileService.updateBasicProfile).mockResolvedValue(undefined);

      const formData = new FormData();
      formData.append("full_name", "Biswamohan Student");
      formData.append("username", "biswa_valid");
      formData.append("bio", "Verified biology student.");
      formData.append("gender", "male");

      const res = await updateBasicProfile(formData);
      expect(res.success).toBe(true);
      expect(profileService.updateBasicProfile).toHaveBeenCalledWith(
        "user-1",
        expect.objectContaining({
          full_name: "Biswamohan Student",
          username: "biswa_valid",
          bio: "Verified biology student.",
          gender: "male",
        })
      );
    });

    it("updatePrivacySettings should delegate to profileService.updatePrivacySettings", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
      vi.mocked(profileService.updatePrivacySettings).mockResolvedValue(undefined);

      const formData = new FormData();
      formData.append("profile_visibility", "public");
      formData.append("email_visibility", "private");
      formData.append("phone_visibility", "private");
      formData.append("dob_visibility", "ravenshaw_only");
      formData.append("gallery_visibility", "public");
      formData.append("achievements_visibility", "public");

      const res = await updatePrivacySettings(formData);
      expect(res.success).toBe(true);
      expect(profileService.updatePrivacySettings).toHaveBeenCalledWith("user-1", expect.any(Object));
    });

    it("claimStudentProfile should pass valid claims to profileService.claimProfile", async () => {
      mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
      vi.mocked(profileService.claimProfile).mockResolvedValue(undefined);

      const formData = new FormData();
      formData.append("roll_number", "2024-BOT-001");
      formData.append("registration_number", "REG-9988");
      formData.append("supporting_document_url", "https://storage.supabase.co/id-card.png");

      const res = await claimStudentProfile(formData);
      expect(res.success).toBe(true);
      expect(profileService.claimProfile).toHaveBeenCalledWith("user-1", {
        roll_number: "2024-BOT-001",
        registration_number: "REG-9988",
        supporting_document_url: "https://storage.supabase.co/id-card.png",
      });
    });
  });
});
