'use client';

import React, { useCallback, useState } from 'react';
import { UploadCloud, X, File, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadDropzoneProps {
  onUpload: (files: File[]) => Promise<void>;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes
  disabled?: boolean;
  className?: string;
}

export function UploadDropzone({
  onUpload,
  accept = 'image/*,video/*',
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  disabled = false,
  className
}: UploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<{ file: File; progress: number; error?: string }[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragging(true);
    else if (e.type === 'dragleave') setIsDragging(false);
  }, []);

  const validateFile = (file: File) => {
    if (file.size > maxSize) return `File too large (max ${maxSize / 1024 / 1024}MB)`;
    // Basic accept type check (can be expanded based on mime types)
    return null;
  };

  const processFiles = async (selectedFiles: File[]) => {
    if (disabled || isUploading) return;
    
    const newFiles = Array.from(selectedFiles).slice(0, maxFiles - files.length).map(file => ({
      file,
      progress: 0,
      error: validateFile(file) || undefined
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
    
    const validFiles = newFiles.filter(f => !f.error).map(f => f.file);
    if (validFiles.length > 0) {
      setIsUploading(true);
      
      // Simulate progress for UI purposes while actual upload happens
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          validFiles.includes(f.file) ? { ...f, progress: Math.min(f.progress + 10, 90) } : f
        ));
      }, 200);

      try {
        await onUpload(validFiles);
        setFiles(prev => prev.map(f => 
          validFiles.includes(f.file) ? { ...f, progress: 100 } : f
        ));
      } catch (error) {
        setFiles(prev => prev.map(f => 
          validFiles.includes(f.file) ? { ...f, error: 'Upload failed' } : f
        ));
      } finally {
        clearInterval(progressInterval);
        setIsUploading(false);
      }
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, [disabled, isUploading, files.length, maxFiles]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (indexToRemove: number) => {
    if (isUploading) return;
    setFiles(files.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className={cn("w-full space-y-4", className)}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-xl transition-colors cursor-pointer",
          isDragging ? "border-[#9B3A4D] bg-[#7C2D3E]/10" : "border-[#2D1F23] bg-[#1A1214] hover:bg-[#2D1F23]/50",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept={accept}
          onChange={handleChange}
          disabled={disabled || isUploading || files.length >= maxFiles}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <UploadCloud className="w-10 h-10 text-[#8B7078] mb-4" />
        <h4 className="text-[#F5E6EA] font-medium text-lg">Click or drag files to upload</h4>
        <p className="text-[#8B7078] text-sm mt-1">
          Supported: {accept} (Max {maxSize / 1024 / 1024}MB)
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((fileObj, idx) => (
            <div key={idx} className="flex items-center p-3 bg-[#1A1214] border border-[#2D1F23] rounded-lg">
              <div className="bg-[#2D1F23] p-2 rounded mr-3">
                <File className="w-4 h-4 text-[#8B7078]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F5E6EA] truncate">
                  {fileObj.file.name}
                </p>
                {fileObj.error ? (
                  <p className="text-xs text-red-500">{fileObj.error}</p>
                ) : (
                  <div className="w-full bg-[#0F0A0B] h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="bg-[#7C2D3E] h-full transition-all duration-300" 
                      style={{ width: `${fileObj.progress}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="ml-4 flex items-center">
                {fileObj.progress === 100 && !fileObj.error ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                ) : null}
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  disabled={isUploading && fileObj.progress < 100 && !fileObj.error}
                  className="p-1 text-[#8B7078] hover:text-white disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
