export const APP_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ravenshawmoments.edu.in";

/**
 * Returns the canonical URL for a given path.
 */
export function getCanonicalUrl(path: string): string {
  // Ensure path starts with a slash
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${APP_BASE_URL}${normalizedPath}`;
}
