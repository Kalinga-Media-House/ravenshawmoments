"use client";

import React, { useState } from "react";
import { uploadCompetitionCoverImage } from "@/app/actions/mediaAdminAction";

interface AdminMediaUploadProps {
  currentMediaId?: string;
  onUploadSuccess: (mediaId: string) => void;
}

export function AdminMediaUpload({ currentMediaId, onUploadSuccess }: AdminMediaUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // For local preview during upload

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    // Local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadCompetitionCoverImage(formData);

      if (result.success && result.mediaId) {
        onUploadSuccess(result.mediaId);
      } else {
        setError(result.message);
        setPreview(null); // Revert preview on failure
      }
    } catch (err: any) {
      setError("An unexpected error occurred during upload.");
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <label className="flex-1 cursor-pointer">
          <div className="border-2 border-dashed border-stone-300 rounded-xl p-6 flex flex-col items-center justify-center bg-stone-50 hover:bg-stone-100 transition-colors">
            {isUploading ? (
              <span className="text-stone-500 font-medium animate-pulse">Uploading...</span>
            ) : (
              <>
                <svg className="w-8 h-8 text-stone-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="text-stone-600 font-medium">Click to upload cover image</span>
                <span className="text-stone-400 text-xs mt-1">JPEG, PNG, WebP up to 5MB</span>
              </>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/jpeg, image/png, image/webp"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
        
        {(preview || currentMediaId) && (
          <div className="w-32 h-32 rounded-xl overflow-hidden border border-stone-200 relative shrink-0">
            {preview ? (
              <img src={preview} alt="Upload preview" className="w-full h-full object-cover" />
            ) : currentMediaId ? (
              <div className="w-full h-full bg-stone-100 flex items-center justify-center text-xs text-stone-500 text-center p-2">
                Media attached (ID: {currentMediaId.substring(0,8)}...)
              </div>
            ) : null}
          </div>
        )}
      </div>
      
      {error && <p className="text-red-500 text-sm mt-2 font-medium">{error}</p>}
      
      {currentMediaId && !error && !isUploading && (
        <p className="text-green-600 text-xs mt-2 font-medium">✓ Cover image attached securely.</p>
      )}
    </div>
  );
}
