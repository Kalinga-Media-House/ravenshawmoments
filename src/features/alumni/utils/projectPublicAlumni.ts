import { PublicAlumniProfile } from "../types/alumni";
import { isProfileVerified } from "@/lib/utils/permissions";
import { PublicProfile } from "@/types/profile";

/**
 * Projects a canonical PublicProfile into a strictly public-safe PublicAlumniProfile.
 * Completely strips any private or non-public sensitive fields.
 */
export function projectCanonicalToPublicAlumni(
  profile: PublicProfile
): PublicAlumniProfile {
  const departmentName = profile.department_name
    ? String(profile.department_name)
    : undefined;
  const batch = profile.batch_year ? String(profile.batch_year) : undefined;
  const fullName = profile.full_name || "Alumnus";

  const departmentSlug = departmentName
    ? departmentName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : undefined;

  return {
    id: String(profile.id || profile.public_id || ""),
    slug: String(profile.slug || ""),
    fullName,
    publicDisplayName: fullName,
    profilePhoto: profile.avatar_url ? String(profile.avatar_url) : undefined,
    profilePhotoAlt: `${fullName} profile photograph`,
    profilePhotoPublic: Boolean(profile.avatar_url),
    profileVerificationStatus: isProfileVerified(profile) ? "approved" : "pending",
    profileType: "alumni",
    academicLevel: profile.level ? String(profile.level) : undefined,
    programme: profile.stream ? String(profile.stream) : undefined,
    departmentName,
    departmentSlug,
    batch,
    graduationYear: batch,
    shortBio: profile.bio ? String(profile.bio) : undefined,
    bio: profile.bio ? String(profile.bio) : undefined,
    ravenshawStory: profile.bio ? String(profile.bio) : undefined,
    achievements: profile.achievements || [],
    galleryItems: profile.gallery_items || [],
    certificates: profile.winner_certificates || [],
    featured: false,
    publicProfileEnabled: true,
    publicSearchEnabled: true,
    profileHref: `/profile/${profile.slug}`,
    searchKeywords: [
      fullName.toLowerCase(),
      departmentName?.toLowerCase() || "",
      batch || "",
    ].filter(Boolean),
  };
}
