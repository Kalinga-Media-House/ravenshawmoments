import { FileValidationService } from "./file-validation.service";
import { StorageError } from "../../lib/errors";
// Assuming sharp is used for extracting image metadata natively on node servers
import sharp from "sharp";

export class ImageService {
  private validationService = new FileValidationService();

  async processAndValidate(buffer: Buffer, mimeType: string) {
    this.validationService.validateBuffer(buffer, mimeType, false);

    try {
      const metadata = await sharp(buffer).metadata();
      
      return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || "unknown",
        // Extract basic EXIF/metadata if needed to store in DB
        hasAlphaChannel: metadata.hasAlpha,
      };
    } catch (error) {
      throw new StorageError("Failed to extract image metadata. The file may be corrupt.", error as Record<string, any>);
    }
  }
}
