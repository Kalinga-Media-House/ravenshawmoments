'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { uploadMedia } from '@/actions/department/media.actions';

interface UploadOptions {
  maxFiles?: number;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  onUploadComplete?: (urls: string[]) => void;
  onUploadError?: (error: Error) => void;
}

interface UploadedFile {
  url: string;
  name: string;
  type: string;
}

export function useMediaUpload(options: UploadOptions = {}) {
  const { maxFiles = 10, maxSize = 5 * 1024 * 1024, acceptedTypes = [] } = options;
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const upload = useCallback(async (files: File[]) => {
    if (files.length === 0) return;

    if (uploadedFiles.length + files.length > maxFiles) {
      toast.error(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} exceeds max size of ${maxSize / (1024 * 1024)}MB`);
        return false;
      }
      
      if (acceptedTypes.length > 0 && !acceptedTypes.includes(file.type)) {
        toast.error(`File ${file.name} type not supported`);
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    
    try {
      const newUploadedFiles: UploadedFile[] = [];
      
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('file', file);
        
        const result = await uploadMedia(formData);
        
        if (result.success) {
          const url = typeof result.data === 'string' ? result.data : (result.data as any).url || (result.data as any).id;
          newUploadedFiles.push({
            url,
            name: file.name,
            type: file.type
          });
        } else {
          throw new Error(result.error);
        }
      }
      
      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
      options.onUploadComplete?.(newUploadedFiles.map(f => f.url));
      toast.success('Upload complete');
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Upload failed');
      options.onUploadError?.(err);
      toast.error(err.message);
    } finally {
      setIsUploading(false);
    }
  }, [uploadedFiles.length, maxFiles, maxSize, acceptedTypes, options]);

  const removeFile = useCallback((urlToRemove: string) => {
    setUploadedFiles(prev => prev.filter(f => f.url !== urlToRemove));
  }, []);

  const clearFiles = useCallback(() => {
    setUploadedFiles([]);
  }, []);

  return { upload, uploadedFiles, isUploading, removeFile, clearFiles };
}
