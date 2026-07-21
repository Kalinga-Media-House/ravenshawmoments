export interface UploadOptions {
  bucket: string;
  key: string;
  contentType: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
}

export interface UploadResult {
  key: string;
  url: string;
  size: number;
  mimeType: string;
  bucket: string;
}

export interface MultipartUploadConfig {
  bucket: string;
  key: string;
  contentType: string;
}

export interface MultipartUploadPart {
  partNumber: number;
  eTag: string;
}

export interface SignedUrlConfig {
  bucket: string;
  key: string;
  expiresInSeconds: number;
  contentType?: string;
}
