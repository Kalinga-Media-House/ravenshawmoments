// =============================================================================
// Ravenshaw Moments
// File      : src/lib/storage/validation.ts
// Purpose   : Centralized file validation, sanitization, and path generation
// =============================================================================

import crypto from "crypto";
import type { R2Folder, UploadRuleSet } from "./storage.constants";
import { isValidR2Folder, UPLOAD_RULES } from "./storage.constants";

// ---------------------------------------------------------------------------
// File Validation
// ---------------------------------------------------------------------------

export interface ValidationResult {
  valid: true;
}

export interface ValidationError {
  valid: false;
  error: string;
  code: "INVALID_FILE" | "UNSUPPORTED_MIME" | "UNSUPPORTED_EXTENSION" | "FILE_TOO_LARGE" | "INVALID_FILENAME";
}

/**
 * Validates a file against a set of upload rules.
 * Checks MIME type, file extension, and size.
 */
export function validateUploadFile(
  file: File | Blob,
  originalFilename: string,
  rules: UploadRuleSet
): ValidationResult | ValidationError {
  // 1. Basic file check
  if (!file || file.size === 0) {
    return { valid: false, error: "No valid file provided for upload.", code: "INVALID_FILE" };
  }

  // 2. MIME type validation
  const mimeType = file instanceof File ? file.type : (file as Blob).type;
  if (!mimeType || !rules.allowedMimeTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `File type "${mimeType || "unknown"}" is not supported. Allowed: ${rules.allowedMimeTypes.join(", ")}`,
      code: "UNSUPPORTED_MIME",
    };
  }

  // 3. Extension validation
  const ext = extractExtension(originalFilename);
  if (!ext || !(rules.allowedExtensions as readonly string[]).includes(ext)) {
    return {
      valid: false,
      error: `File extension ".${ext || "none"}" is not supported. Allowed: ${rules.allowedExtensions.map((e) => `.${e}`).join(", ")}`,
      code: "UNSUPPORTED_EXTENSION",
    };
  }

  // 4. Size validation
  if (file.size > rules.maxSizeBytes) {
    const maxMb = Math.round(rules.maxSizeBytes / (1024 * 1024));
    const fileMb = (file.size / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size (${fileMb} MB) exceeds the maximum limit of ${maxMb} MB.`,
      code: "FILE_TOO_LARGE",
    };
  }

  return { valid: true };
}

// ---------------------------------------------------------------------------
// Filename Sanitization
// ---------------------------------------------------------------------------

/**
 * Generates a UUID-based filename, preserving only the sanitized extension.
 * Original filename is never used in the storage path to prevent all
 * filename-based attacks (traversal, encoding, collision).
 */
export function generateSafeFilename(originalFilename: string): string {
  const ext = extractExtension(originalFilename);
  const uuid = crypto.randomUUID();
  return ext ? `${uuid}.${ext}` : uuid;
}

/**
 * Extracts and lowercases the file extension from a filename.
 * Returns empty string if no extension found.
 */
export function extractExtension(filename: string): string {
  if (!filename) return "";
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1 || lastDot === filename.length - 1) return "";
  return filename
    .substring(lastDot + 1)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ""); // strip any non-alphanumeric
}

// ---------------------------------------------------------------------------
// Storage Key Generation
// ---------------------------------------------------------------------------

/**
 * Generates a standardized R2 object key (storage path).
 *
 * Format: `{folder}/{entityId}/{uuid}.{ext}`
 *
 * - Validates `folder` against `R2_FOLDERS` enum
 * - Prevents path traversal (`..`, leading `/`, null bytes)
 * - Uses UUID for collision-free naming
 *
 * @param folder     - One of `R2_FOLDERS` values (e.g. "avatars", "departments")
 * @param entityId   - The owner entity ID (profileId, departmentId, etc.)
 * @param filename   - Original filename (used only for extension extraction)
 * @returns          - Safe storage key like "avatars/abc123/d4e5f6g7-h8i9.jpg"
 */
export function generateStorageKey(
  folder: R2Folder,
  entityId: string,
  filename: string
): string {
  // Validate folder
  if (!isValidR2Folder(folder)) {
    throw new Error(`Invalid storage folder: "${folder}". Must be one of: ${Object.values(R2_FOLDERS).join(", ")}`);
  }

  // Validate entityId — prevent traversal
  validatePathSegment(entityId, "entityId");

  // Generate safe filename
  const safeFilename = generateSafeFilename(filename);

  return `${folder}/${entityId}/${safeFilename}`;
}

/**
 * Generates a storage key without an entity ID prefix.
 * Useful for platform-level uploads (e.g. competition covers).
 *
 * Format: `{folder}/{uuid}.{ext}`
 */
export function generateFlatStorageKey(
  folder: R2Folder,
  filename: string
): string {
  if (!isValidR2Folder(folder)) {
    throw new Error(`Invalid storage folder: "${folder}".`);
  }

  const safeFilename = generateSafeFilename(filename);
  return `${folder}/${safeFilename}`;
}

// ---------------------------------------------------------------------------
// Path Traversal Prevention
// ---------------------------------------------------------------------------

/**
 * Validates a path segment to prevent directory traversal attacks.
 */
function validatePathSegment(segment: string, label: string): void {
  if (!segment || typeof segment !== "string") {
    throw new Error(`${label} is required and must be a non-empty string.`);
  }
  if (segment.includes("..")) {
    throw new Error(`${label} must not contain "..".`);
  }
  if (segment.includes("/") || segment.includes("\\")) {
    throw new Error(`${label} must not contain path separators.`);
  }
  if (segment.includes("\0")) {
    throw new Error(`${label} must not contain null bytes.`);
  }
}

// ---------------------------------------------------------------------------
// Checksum
// ---------------------------------------------------------------------------

/**
 * Computes SHA-256 checksum of file content.
 */
export async function computeSha256(buffer: Buffer | Uint8Array): Promise<string> {
  const hash = crypto.createHash("sha256");
  hash.update(buffer);
  return hash.digest("hex");
}

// ---------------------------------------------------------------------------
// Upload Logging
// ---------------------------------------------------------------------------

export interface UploadLogEntry {
  userId: string;
  userRole?: string;
  originalFilename: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  folder: R2Folder;
  status: "success" | "validation_failed" | "upload_failed" | "metadata_failed";
  durationMs?: number;
  error?: string;
  timestamp: string;
}

/**
 * Logs upload activity. Currently logs to console in structured JSON format.
 * Can be extended to write to a database table or external logging service.
 */
export function logUpload(entry: UploadLogEntry): void {
  const logLine = {
    type: "UPLOAD_LOG",
    ...entry,
  };
  if (entry.status === "success") {
    console.log(JSON.stringify(logLine));
  } else {
    console.error(JSON.stringify(logLine));
  }
}

// Re-export R2_FOLDERS for convenience (avoid needing two imports)
import { R2_FOLDERS } from "./storage.constants";
export { R2_FOLDERS };
