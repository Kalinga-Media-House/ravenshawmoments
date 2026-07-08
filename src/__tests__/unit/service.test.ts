import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  profileCoreService,
  ProfileAccessDeniedError,
} from "@/features/profile/services/profile.service";

// Mock Supabase Server Client
vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({}),
}));

// Mock ProfileRepository methods
const mockFindBySlug = vi.fn();
const mockGetPrivacySettings = vi.fn();
const mockGetPrimaryEducationRecord = vi.fn();
const mockFindProfileGalleryAlbum = vi.fn();
const mockGetGalleryItems = vi.fn();
const mockGetCertificates = vi.fn();
const mockGetAchievements = vi.fn();
const mockUpsertProfile = vi.fn();
const mockUpdateByAuthUserId = vi.fn();

vi.mock("@/lib/repositories/profile.repository", () => {
  return {
    ProfileRepository: class {
      findBySlug = mockFindBySlug;
      getPrivacySettings = mockGetPrivacySettings;
      getPrimaryEducationRecord = mockGetPrimaryEducationRecord;
      findProfileGalleryAlbum = mockFindProfileGalleryAlbum;
      getGalleryItems = mockGetGalleryItems;
      getCertificates = mockGetCertificates;
      getAchievements = mockGetAchievements;
      upsertProfile = mockUpsertProfile;
      updateByAuthUserId = mockUpdateByAuthUserId;
    },
  };
});

describe("Profile Core Service Unit Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createProfile", () => {
    it("should validate input, sanitize slug, and call repository upsertProfile", async () => {
      await profileCoreService.createProfile("user-123", "student@ravenshaw.edu", {
        full_name: "John Doe",
        username: "John_Doe_2024",
        bio: "Test bio",
      });

      expect(mockUpsertProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          id: "user-123",
          auth_user_id: "user-123",
          email: "student@ravenshaw.edu",
          full_name: "John Doe",
          username: "john_doe_2024",
          slug: "john_doe_2024",
          bio: "Test bio",
        })
      );
    });

    it("should throw validation error if username is invalid", async () => {
      await expect(
        profileCoreService.createProfile("user-123", "student@ravenshaw.edu", {
          full_name: "John Doe",
          username: "invalid user !!!",
        })
      ).rejects.toThrow();
    });
  });

  describe("updateBasicProfile", () => {
    it("should update basic profile fields and lowercase username for slug", async () => {
      await profileCoreService.updateBasicProfile("user-123", {
        full_name: "Jane Doe",
        username: "Jane_RM",
        bio: "Updated bio",
      });

      expect(mockUpdateByAuthUserId).toHaveBeenCalledWith(
        "user-123",
        expect.objectContaining({
          full_name: "Jane Doe",
          username: "jane_rm",
          slug: "jane_rm",
          bio: "Updated bio",
        })
      );
    });
  });

  describe("getPublicProfileBySlug", () => {
    it("should return null if profile does not exist", async () => {
      mockFindBySlug.mockResolvedValue(null);
      const res = await profileCoreService.getPublicProfileBySlug("non-existent");
      expect(res).toBeNull();
    });

    it("should throw ProfileAccessDeniedError if profile visibility is set to private", async () => {
      mockFindBySlug.mockResolvedValue({ id: "profile-1", username: "test_private", slug: "test_private" });
      mockGetPrivacySettings.mockResolvedValue({ profile_visibility: "private" });

      await expect(profileCoreService.getPublicProfileBySlug("test_private")).rejects.toThrow(
        ProfileAccessDeniedError
      );
    });

    it("should return PublicProfile with gallery items hidden if gallery visibility is private", async () => {
      mockFindBySlug.mockResolvedValue({
        id: "profile-1",
        username: "test_user",
        slug: "test_user",
        full_name: "Test User",
        created_at: "2024-01-01T00:00:00Z",
      });
      mockGetPrivacySettings.mockResolvedValue({
        profile_visibility: "public",
        gallery_visibility: "private",
        achievements_visibility: "public",
      });
      mockGetPrimaryEducationRecord.mockResolvedValue({ department_name: "Computer Science", batch_year: "2024" });
      mockFindProfileGalleryAlbum.mockResolvedValue({ id: "album-1" });
      mockGetGalleryItems.mockResolvedValue([
        { id: "img-1", media_url: "https://example.com/photo.jpg", caption: "Photo" },
      ]);
      mockGetCertificates.mockResolvedValue([]);
      mockGetAchievements.mockResolvedValue([]);

      const result = await profileCoreService.getPublicProfileBySlug("test_user");
      expect(result).not.toBeNull();
      if (result) {
        expect(result.username).toBe("test_user");
        expect(result.gallery_items).toEqual([]); // Hidden due to private gallery visibility
      }
    });
  });
});
