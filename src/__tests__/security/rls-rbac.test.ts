import { describe, it, expect, vi, beforeEach } from "vitest";
import { profileCoreService, ProfileAccessDeniedError } from "@/features/profile/services/profile.service";
import { basicProfileSchema } from "@/lib/validation/profile-system";

// Mock Supabase Server Client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({}),
}));

const mockFindBySlug = vi.fn();
const mockGetPrivacySettings = vi.fn();
const mockUpdateByAuthUserId = vi.fn();
const mockGetPrimaryEducationRecord = vi.fn();
const mockFindProfileGalleryAlbum = vi.fn();
const mockGetGalleryItems = vi.fn();
const mockGetCertificates = vi.fn();
const mockGetAchievements = vi.fn();

vi.mock("@/lib/repositories/profile.repository", () => {
  return {
    ProfileRepository: class {
      findBySlug = mockFindBySlug;
      getPrivacySettings = mockGetPrivacySettings;
      updateByAuthUserId = mockUpdateByAuthUserId;
      getPrimaryEducationRecord = mockGetPrimaryEducationRecord;
      findProfileGalleryAlbum = mockFindProfileGalleryAlbum;
      getGalleryItems = mockGetGalleryItems;
      getCertificates = mockGetCertificates;
      getAchievements = mockGetAchievements;
    },
  };
});

describe("Security, RBAC & Privacy Enforcement Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Privilege Escalation Prevention", () => {
    it("should strip role or verification_status fields from basicProfileSchema", () => {
      // Attempting to pass role or verification status in user profile updates
      const rawInput = {
        full_name: "Attacker User",
        username: "attacker",
        role: "super_admin", // Attempted privilege escalation
        verification_status: "verified", // Attempted verification bypass
      };

      const validated = basicProfileSchema.parse(rawInput);
      // Ensure role and verification_status are stripped by Zod
      expect((validated as Record<string, unknown>).role).toBeUndefined();
      expect((validated as Record<string, unknown>).verification_status).toBeUndefined();
    });

    it("updateBasicProfile should only send allowed identity columns to repository", async () => {
      await profileCoreService.updateBasicProfile("user-attack-1", {
        full_name: "Safe Name",
        username: "safe_user",
        bio: "Safe bio",
        role: "admin", // Must be ignored
      });

      expect(mockUpdateByAuthUserId).toHaveBeenCalledWith(
        "user-attack-1",
        expect.not.objectContaining({
          role: "admin",
        })
      );
    });
  });

  describe("RLS & Privacy Matrix Enforcement", () => {
    it("should deny public access when profile_visibility is private", async () => {
      mockFindBySlug.mockResolvedValue({ id: "priv-user-id", username: "secret_user", slug: "secret_user" });
      mockGetPrivacySettings.mockResolvedValue({ profile_visibility: "private" });

      await expect(profileCoreService.getPublicProfileBySlug("secret_user")).rejects.toThrow(
        ProfileAccessDeniedError
      );
    });

    it("should allow public access when profile_visibility is public", async () => {
      mockFindBySlug.mockResolvedValue({
        id: "pub-user-id",
        username: "public_user",
        slug: "public_user",
        full_name: "Public Student",
      });
      mockGetPrivacySettings.mockResolvedValue({ profile_visibility: "public" });
      mockGetPrimaryEducationRecord.mockResolvedValue({ department_name: "Physics" });
      mockFindProfileGalleryAlbum.mockResolvedValue(null);
      mockGetGalleryItems.mockResolvedValue([]);
      mockGetCertificates.mockResolvedValue([]);
      mockGetAchievements.mockResolvedValue([]);

      const res = await profileCoreService.getPublicProfileBySlug("public_user");
      expect(res).not.toBeNull();
      if (res) {
        expect(res.username).toBe("public_user");
      }
    });
  });

  describe("Filename Sanitization & Path Traversal Protection", () => {
    it("should strip directory traversal sequences in usernames or filenames", () => {
      const maliciousInput = {
        full_name: "Test Hacker",
        username: "../../etc/passwd",
      };

      const res = basicProfileSchema.safeParse(maliciousInput);
      expect(res.success).toBe(false); // Rejected by alphanumeric/hyphen/underscore regex
    });
  });
});
