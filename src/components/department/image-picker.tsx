'use client';

import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: '1:1' | '16:9' | '4:3';
  className?: string;
}

export function ImagePicker({ value, onChange, aspectRatio = '1:1', className }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '16:9': return 'aspect-video';
      case '4:3': return 'aspect-[4/3]';
      case '1:1': 
      default: return 'aspect-square';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // In a real app, upload to storage and get URL
      // Here we use an object URL to preview immediately
      const objectUrl = URL.createObjectURL(file);
      onChange(objectUrl);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={cn("w-full max-w-sm", className)}>
      <div className={cn(
        "relative overflow-hidden rounded-xl border-2 border-dashed border-[#2D1F23] bg-[#1A1214] flex flex-col items-center justify-center group",
        getAspectClass(),
        value ? "border-solid border-[#7C2D3E]" : "hover:border-[#9B3A4D]"
      )}>
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <Button 
                type="button" 
                variant="secondary" 
                size="sm" 
                onClick={() => inputRef.current?.click()}
                className="bg-white/10 hover:bg-white/20 text-white border-none"
              >
                Change Image
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                size="sm" 
                onClick={handleRemove}
              >
                Remove
              </Button>
            </div>
          </>
        ) : (
          <div 
            className="flex flex-col items-center justify-center p-6 text-center cursor-pointer w-full h-full"
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? (
              <div className="w-8 h-8 rounded-full border-2 border-[#7C2D3E] border-t-transparent animate-spin mb-2" />
            ) : (
              <ImageIcon className="w-10 h-10 text-[#8B7078] mb-2 group-hover:text-[#9B3A4D] transition-colors" />
            )}
            <p className="text-sm font-medium text-[#F5E6EA]">Click to select an image</p>
            <p className="text-xs text-[#8B7078] mt-1">Recommended aspect ratio {aspectRatio}</p>
          </div>
        )}
        <input 
          type="file"
          ref={inputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
