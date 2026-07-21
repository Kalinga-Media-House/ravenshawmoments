"use server";

import { createClient } from "@/lib/supabase/server";
import { isProfileVerified } from "@/lib/utils/permissions";
import { logger } from "@/lib/logger";
import { PublicAlumniProfile } from "../types/alumni";
import { PublicProfile } from "@/types/profile";

interface ProfileRow {
  id?: string;
  public_id?: string;
  username?: string;
  slug?: string;
  full_name?: string;
  avatar_url?: string;
  profile_type?: string;
  bio?: string;
  level?: string;
  stream?: string;
  department_name?: string;
  batch_year?: string;
  is_verified?: boolean;
  profile_status?: string;
  is_featured?: boolean;
  created_at?: string;
}

/**
 * Server action to fetch approved public alumni profiles safely from Supabase.
 * Excludes private profile information, unapproved profiles, suspended profiles,
 * and sensitive private fields (email, phone, DOB, roll number, internal IDs).
 */
export async function getPublicAlumniAction(): Promise<PublicAlumniProfile[]> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, public_id, username, slug, full_name, avatar_url, profile_type, bio, level, stream, department_name, batch_year, is_verified, profile_status, is_featured, created_at"
      )
      .eq("profile_type", "alumni")
      .not("slug", "is", null);

    if (error || !data) {
      if (error) {
        logger.warn("getPublicAlumniAction: Supabase query returned error or empty", {
          error: error.message,
        });
      }
      return [];
    }

    const rows = data as ProfileRow[];

    const publicAlumni: PublicAlumniProfile[] = rows
      .filter((row) => Boolean(row.slug) && Boolean(row.full_name) && isProfileVerified(row))
      .map((row) => {
        const id = String(row.id || row.public_id || "");
        const slug = String(row.slug || "");
        const fullName = String(row.full_name || "");
        const departmentName = row.department_name ? String(row.department_name) : undefined;
        const batch = row.batch_year ? String(row.batch_year) : undefined;
        const isVerified = isProfileVerified(row);
        const isFeatured = Boolean(row.is_featured);

        const departmentSlug = departmentName
          ? departmentName
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-+|-+$/g, "")
          : undefined;

        return {
          id,
          slug,
          fullName,
          publicDisplayName: fullName,
          profilePhoto: row.avatar_url ? String(row.avatar_url) : undefined,
          profilePhotoAlt: `${fullName} profile photograph`,
          profilePhotoPublic: Boolean(row.avatar_url),
          profileVerificationStatus: isVerified ? "approved" : "pending",
          profileType: "alumni",
          academicLevel: row.level ? String(row.level) : undefined,
          programme: row.stream ? String(row.stream) : undefined,
          departmentName,
          departmentSlug,
          batch,
          graduationYear: batch,
          shortBio: row.bio ? String(row.bio) : undefined,
          featured: isFeatured,
          publicProfileEnabled: true,
          publicSearchEnabled: true,
          profileHref: `/profile/${slug}`,
          searchKeywords: [
            fullName.toLowerCase(),
            departmentName?.toLowerCase() || "",
            batch || "",
          ].filter(Boolean),
        };
      });

    return publicAlumni;
  } catch (error) {
    logger.error("getPublicAlumniAction: Uncaught error while retrieving public alumni", {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
}
