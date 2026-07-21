import { ValidationError } from "../../lib/errors";

export class FileValidationService {
  private static MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  private static MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB

  private static ALLOWED_IMAGE_TYPES = new Set([
    "image/jpeg",
    "image/png",
    "image/webp",
  ]);

  private static ALLOWED_VIDEO_TYPES = new Set([
    "video/mp4",
    "video/webm",
  ]);

  validateImage(file: File) {
    if (!FileValidationService.ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new ValidationError(`Unsupported image type: ${file.type}. Allowed: JPG, PNG, WEBP`);
    }

    if (file.size > FileValidationService.MAX_IMAGE_SIZE) {
      throw new ValidationError(`Image size exceeds 5MB limit: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    return true;
  }

  validateVideo(file: File) {
    if (!FileValidationService.ALLOWED_VIDEO_TYPES.has(file.type)) {
      throw new ValidationError(`Unsupported video type: ${file.type}. Allowed: MP4, WEBM`);
    }

    if (file.size > FileValidationService.MAX_VIDEO_SIZE) {
      throw new ValidationError(`Video size exceeds 50MB limit: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    return true;
  }

  // To validate directly on Node Buffers if file isn't available (e.g. Server Actions raw byte streams)
  validateBuffer(buffer: Buffer, mimeType: string, isVideo: boolean = false) {
    const maxSize = isVideo ? FileValidationService.MAX_VIDEO_SIZE : FileValidationService.MAX_IMAGE_SIZE;
    const allowedSet = isVideo ? FileValidationService.ALLOWED_VIDEO_TYPES : FileValidationService.ALLOWED_IMAGE_TYPES;
    
    if (!allowedSet.has(mimeType)) {
      throw new ValidationError(`Unsupported MIME type: ${mimeType}`);
    }

    if (buffer.length > maxSize) {
      throw new ValidationError(`File size exceeds limit.`);
    }

    return true;
  }
}
