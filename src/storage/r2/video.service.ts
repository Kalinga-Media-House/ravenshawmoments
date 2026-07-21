import { FileValidationService } from "./file-validation.service";

export class VideoService {
  private validationService = new FileValidationService();

  async validate(buffer: Buffer, mimeType: string) {
    this.validationService.validateBuffer(buffer, mimeType, true);

    // Note: Deep video duration metadata extraction in Node usually requires ffprobe/ffmpeg.
    // In a serverless/edge context, it's typically extracted client-side before upload 
    // or sent as part of the payload. We will return basic metadata here.
    return {
      isValid: true,
      size: buffer.length,
      mimeType
    };
  }
}
