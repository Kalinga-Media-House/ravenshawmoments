"use client";

import React, { useState, useCallback } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { updateAvatar, updateCoverPhoto } from "@/actions/student/profile.actions";
import { toast } from "sonner";

export interface PhotoUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "avatar" | "cover";
  onUpload: (url: string) => Promise<void>;
}

export function PhotoUploadModal({
  open,
  onOpenChange,
  type,
  onUpload,
}: PhotoUploadModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be under 5MB");
      return;
    }
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
  };

  const handleUploadClick = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const action = type === "avatar" ? updateAvatar : updateCoverPhoto;
      const result = await action(formData);

      // @ts-ignore
      if (result.success && result.data?.url) {
        // @ts-ignore
        await onUpload(result.data.url);
        toast.success(
          type === "avatar" ? "Profile photo updated" : "Cover photo updated"
        );
        handleClose();
      } else {
        // @ts-ignore
        toast.error(result.error || "Upload failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    onOpenChange(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
      <div
        className="w-full max-w-md bg-[#1A1214] border border-[#2D1F23] rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2D1F23]">
          <h2 className="text-lg font-semibold text-[#F5E6EA]">
            Update {type === "avatar" ? "Profile Picture" : "Cover Photo"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23] rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!preview ? (
            <div
              className={`
                relative border-2 border-dashed rounded-xl p-8 text-center transition-colors
                ${
                  dragActive
                    ? "border-[#9B3A4D] bg-[#7C2D3E]/10"
                    : "border-[#2D1F23] hover:border-[#7C2D3E]/50 bg-[#0F0A0B]"
                }
              `}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleChange}
                accept="image/*"
              />
              <Upload size={32} className="mx-auto text-[#8B7078] mb-4" />
              <p className="text-sm font-medium text-[#F5E6EA] mb-1">
                Click or drag image here
              </p>
              <p className="text-xs text-[#8B7078]">
                JPG, PNG or GIF (max. 5MB)
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                className="relative w-full bg-[#0F0A0B] rounded-xl overflow-hidden flex items-center justify-center"
                style={{
                  aspectRatio: type === "avatar" ? "1/1" : "16/9",
                }}
              >
                <img
                  src={preview}
                  alt="Preview"
                  className={
                    type === "avatar"
                      ? "w-full h-full object-cover rounded-full max-w-[240px] max-h-[240px]"
                      : "w-full h-full object-cover"
                  }
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (preview) URL.revokeObjectURL(preview);
                    setPreview(null);
                    setFile(null);
                  }}
                  className="flex-1 py-2.5 px-4 bg-[#2D1F23] hover:bg-[#2D1F23]/80 text-[#F5E6EA] rounded-lg text-sm font-medium transition-colors"
                  disabled={isUploading}
                >
                  Choose Different
                </button>
                <button
                  onClick={handleUploadClick}
                  className="flex-1 py-2.5 px-4 bg-[#7C2D3E] hover:bg-[#9B3A4D] text-[#F5E6EA] rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Save Photo"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
