// =============================================================================
// Ravenshaw Moments
// File      : src/lib/storage/media-url.ts
// Purpose   : Isomorphic public URL helpers for R2-stored media
// =============================================================================

import { env } from "@/lib/env";

/**
 * Generates the public URL for an R2 object given its storage path.
 * Uses `CLOUDFLARE_R2_PUBLIC_URL` environment variable.
 *
 * @example
 * getMediaUrl("avatars/abc123/d4e5f6.jpg")
 * // => "https://media.ravenshawmoments.com/avatars/abc123/d4e5f6.jpg"
 */
export function getMediaUrl(storagePath: string): string {
  if (!storagePath) return "";

  const base = (env.CLOUDFLARE_R2_PUBLIC_URL || "https://media.ravenshawmoments.com").replace(
    /\/$/,
    ""
  );
  const path = storagePath.replace(/^\//, "");

  return `${base}/${path}`;
}

/**
 * Checks if a URL is a legacy Supabase storage URL.
 * Useful for migration and backward compatibility.
 */
export function isLegacyStorageUrl(url: string): boolean {
  if (!url) return false;
  return (
    url.includes("supabase.co/storage") ||
    url.includes(".r2.dev/") ||
    url.includes("r2.cloudflarestorage.com")
  );
}

/**
 * Extracts the storage path from a full media URL.
 * Returns null if the URL does not match the expected public URL pattern.
 *
 * @example
 * extractStoragePath("https://media.ravenshawmoments.com/avatars/abc123/file.jpg")
 * // => "avatars/abc123/file.jpg"
 */
export function extractStoragePath(url: string): string | null {
  if (!url) return null;

  const base = (env.CLOUDFLARE_R2_PUBLIC_URL || "https://media.ravenshawmoments.com").replace(
    /\/$/,
    ""
  );

  if (url.startsWith(base)) {
    return url.substring(base.length + 1); // +1 for the "/"
  }

  return null;
}
