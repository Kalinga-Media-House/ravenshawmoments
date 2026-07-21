"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, X, Star, AlertCircle, Camera } from "lucide-react";
import { MemoryUploadedImage, MemorySubmissionFormData } from "../../types/submission";

export interface MemoryMediaUploadProps {
  formData: MemorySubmissionFormData;
  onChange: <K extends keyof MemorySubmissionFormData>(
    field: K,
    value: MemorySubmissionFormData[K]
  ) => void;
  errors: Partial<Record<keyof MemorySubmissionFormData, string>>;
}

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const MAX_FILE_COUNT = 10;
const SUPPORTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const MemoryMediaUpload: React.FC<MemoryMediaUploadProps> = ({
  formData,
  onChange,
  errors,
}) => {
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up Object URLs when component unmounts
  useEffect(() => {
    return () => {
      formData.images.forEach((img) => {
        if (img.previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, [formData.images]);

  const handleFilesSelected = (files: FileList | null) => {
    setUploadError(null);
    if (!files || files.length === 0) return;

    const currentCount = formData.images.length;
    if (currentCount + files.length > MAX_FILE_COUNT) {
      setUploadError(`You can upload a maximum of ${MAX_FILE_COUNT} images per submission.`);
      return;
    }

    const newImages: MemoryUploadedImage[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Type check
      if (!SUPPORTED_TYPES.includes(file.type)) {
        setUploadError(`Unsupported file format (${file.name}). Please use JPG, JPEG, PNG, or WEBP.`);
        return;
      }

      // Size check
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(
          `File (${file.name}) exceeds the maximum limit of 10 MB per image.`
        );
        return;
      }

      // Duplicate check
      const isDup = formData.images.some(
        (existing) => existing.file.name === file.name && existing.file.size === file.size
      );
      if (isDup) {
        setUploadError(`File (${file.name}) has already been added.`);
        return;
      }

      const previewUrl = URL.createObjectURL(file);
      newImages.push({
        id: `${Date.now()}-${i}-${file.name}`,
        file,
        previewUrl,
        caption: "",
        isCover: formData.images.length === 0 && i === 0, // make first image cover by default
      });
    }

    onChange("images", [...formData.images, ...newImages]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveImage = (idToRemove: string) => {
    const target = formData.images.find((img) => img.id === idToRemove);
    if (target && target.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(target.previewUrl);
    }

    const updated = formData.images.filter((img) => img.id !== idToRemove);
    // If removed image was cover, assign cover to first remaining
    if (target?.isCover && updated.length > 0) {
      updated[0].isCover = true;
    }
    onChange("images", updated);
  };

  const handleSetCover = (idToCover: string) => {
    const updated = formData.images.map((img) => ({
      ...img,
      isCover: img.id === idToCover,
    }));
    onChange("images", updated);
  };

  const handleCaptionChange = (id: string, caption: string) => {
    const updated = formData.images.map((img) =>
      img.id === id ? { ...img, caption } : img
    );
    onChange("images", updated);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg sm:text-xl font-extrabold text-white mb-1">
          Photos and Attribution
        </h2>
        <p className="text-xs sm:text-sm text-white/70">
          Upload photographs to accompany your story or share a written story alone.
        </p>
      </div>

      {/* Drop / Select Zone */}
      <div className="space-y-3">
        <label
          htmlFor="memory-upload-input"
          className="block text-xs font-bold uppercase tracking-wider text-[var(--color-rm-gold)]"
        >
          Photographs (Optional)
        </label>

        <div className="border-2 border-dashed border-white/20 hover:border-[var(--color-rm-gold)]/60 rounded-2xl p-6 sm:p-8 bg-black/30 transition-colors text-center">
          <input
            id="memory-upload-input"
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={(e) => handleFilesSelected(e.target.files)}
            className="sr-only"
            aria-describedby="upload-guidelines"
          />

          <div className="w-12 h-12 rounded-2xl bg-[var(--color-rm-maroon)]/40 border border-[var(--color-rm-gold)]/40 flex items-center justify-center mx-auto mb-4 text-[var(--color-rm-gold)]">
            <Upload className="w-6 h-6" aria-hidden="true" />
          </div>

          <p className="text-sm sm:text-base font-bold text-white mb-1">
            Choose photos to add to this memory
          </p>
          <p id="upload-guidelines" className="text-xs text-white/60 mb-5">
            Supported formats: JPG, JPEG, PNG, WEBP. Maximum file size: 10 MB per image. Up to 10 photos per submission.
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[44px] inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-bold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
          >
            Select Photographs
          </button>
        </div>

        {uploadError && (
          <div role="alert" className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{uploadError}</span>
          </div>
        )}
      </div>

      {/* Previews Grid */}
      {formData.images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/80">
            Selected Photographs ({formData.images.length}/{MAX_FILE_COUNT})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formData.images.map((img) => (
              <div
                key={img.id}
                className="p-3 rounded-2xl bg-black/40 border border-white/15 space-y-3"
              >
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-black/60">
                  <Image
                    src={img.previewUrl}
                    alt={img.file.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 50vw"
                    className="object-cover"
                  />
                  {img.isCover && (
                    <div className="absolute top-2 left-2 px-2.5 py-1 rounded-full bg-[var(--color-rm-gold)] text-black text-[10px] font-extrabold flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-black" aria-hidden="true" />
                      Cover Photo
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 hover:bg-black/90 text-white flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
                    aria-label={`Remove photo ${img.file.name}`}
                  >
                    <X className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-2">
                  {!img.isCover ? (
                    <button
                      type="button"
                      onClick={() => handleSetCover(img.id)}
                      className="text-xs font-semibold text-[var(--color-rm-gold)] hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-rm-gold)] rounded"
                    >
                      Set as Cover Photo
                    </button>
                  ) : (
                    <span className="text-xs font-semibold text-white/50">Primary Display</span>
                  )}

                  <span className="text-[10px] text-white/40 truncate max-w-[120px]">
                    {(img.file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>

                <div>
                  <label htmlFor={`caption-${img.id}`} className="sr-only">
                    Caption for {img.file.name}
                  </label>
                  <input
                    id={`caption-${img.id}`}
                    type="text"
                    value={img.caption || ""}
                    onChange={(e) => handleCaptionChange(img.id, e.target.value)}
                    placeholder="Add an optional photo caption..."
                    className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/10 focus:border-[var(--color-rm-gold)] text-xs text-white placeholder-white/30 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-rm-gold)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photo Credit Section */}
      <div className="rm-glass-card rounded-2xl p-6 border border-white/10 bg-black/20 space-y-4">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4 text-[var(--color-rm-gold)]" aria-hidden="true" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Photo Credit
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="photographer-name"
              className="block text-xs font-semibold text-white/80 mb-1.5"
            >
              Photographer Name (Optional)
            </label>
            <input
              id="photographer-name"
              type="text"
              value={formData.photographerName}
              onChange={(e) => onChange("photographerName", e.target.value)}
              placeholder="Who took these photographs?"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
            />
          </div>

          <div>
            <label
              htmlFor="credit-note"
              className="block text-xs font-semibold text-white/80 mb-1.5"
            >
              Credit Note (Optional)
            </label>
            <input
              id="credit-note"
              type="text"
              value={formData.creditNote}
              onChange={(e) => onChange("creditNote", e.target.value)}
              placeholder="e.g. Courtesy of Department Archives"
              className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-black/40 border border-white/20 focus:border-[var(--color-rm-gold)] text-white placeholder-white/40 text-base sm:text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-rm-gold)]"
            />
          </div>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2.5">
            <input
              id="self-photographer-check"
              type="checkbox"
              checked={formData.isSelfPhotographer}
              onChange={(e) => {
                onChange("isSelfPhotographer", e.target.checked);
                if (e.target.checked) onChange("hasPhotographerPermission", true);
              }}
              className="w-4 h-4 rounded border-white/30 bg-black/40 text-[var(--color-rm-gold)] focus:ring-[var(--color-rm-gold)]"
            />
            <label htmlFor="self-photographer-check" className="text-xs text-white/80">
              I took these photographs
            </label>
          </div>

          <div className="flex items-center gap-2.5">
            <input
              id="perm-photographer-check"
              type="checkbox"
              checked={formData.hasPhotographerPermission}
              onChange={(e) => onChange("hasPhotographerPermission", e.target.checked)}
              className="w-4 h-4 rounded border-white/30 bg-black/40 text-[var(--color-rm-gold)] focus:ring-[var(--color-rm-gold)]"
            />
            <label htmlFor="perm-photographer-check" className="text-xs text-white/80">
              The photographer has permitted me to share these photographs
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
