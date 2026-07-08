// =============================================================================
// Ravenshaw Moments
// File      : src/features/shared/media/index.ts
// Purpose   : Shared Platform Layer — Universal Media & Storage Rules
// =============================================================================

export const UNIVERSAL_FILE_RULES = {
  MAX_IMAGE_BYTES: 5 * 1024 * 1024, // 5 MB
  MAX_DOCUMENT_BYTES: 25 * 1024 * 1024, // 25 MB
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"] as const,
  ALLOWED_DOCUMENT_TYPES: ["application/pdf"] as const,
};

export type AllowedImageType = (typeof UNIVERSAL_FILE_RULES.ALLOWED_IMAGE_TYPES)[number];
export type AllowedDocumentType = (typeof UNIVERSAL_FILE_RULES.ALLOWED_DOCUMENT_TYPES)[number];

export interface SharedMediaMetadata {
  bucket: string;
  folder: string;
  fileName: string;
  contentType: string;
  sizeBytes: number;
}

/**
 * Validates if a file MIME type is an allowed image.
 */
export function isAllowedImageType(mimeType: string): boolean {
  return UNIVERSAL_FILE_RULES.ALLOWED_IMAGE_TYPES.includes(mimeType as AllowedImageType);
}

/**
 * Validates if a file MIME type is an allowed document.
 */
export function isAllowedDocumentType(mimeType: string): boolean {
  return UNIVERSAL_FILE_RULES.ALLOWED_DOCUMENT_TYPES.includes(mimeType as AllowedDocumentType);
}

/**
 * Generates a sanitized deterministic storage path for multi-tenant assets.
 */
export function generatePlatformStoragePath(tenantId: string, category: string, fileName: string): string {
  const sanitizedName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
  const timestamp = Date.now();
  return `${category}/${tenantId}/${timestamp}_${sanitizedName}`;
}
