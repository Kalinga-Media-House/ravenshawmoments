"use client";

import React from "react";
import { UploadCloud, Image as ImageIcon } from "lucide-react";

export interface GalleryHeaderProps {
  title: string;
  subtitle?: string;
  photoCount: number;
  maxPhotos?: number;
  showUpload?: boolean;
}

export const GalleryHeader: React.FC<GalleryHeaderProps> = ({
  title,
  subtitle,
  photoCount,
  maxPhotos = 100,
  showUpload = true,
}) => {
  const percentage = Math.min(100, Math.round((photoCount / maxPhotos) * 100));
  const isNearLimit = percentage >= 90;

  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-[#EADFCF]">
      <div>
        <div className="flex items-center gap-2 text-[#5B001B] mb-2">
          <ImageIcon className="w-5 h-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Department Archive</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E1B1C] font-serif leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-base text-[#7A7476] mt-2 font-medium">
            {subtitle}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:items-end gap-3 shrink-0">
        <div className="flex flex-col items-start sm:items-end gap-1">
          <div className="text-sm font-bold text-[#1E1B1C]">
            <span className={isNearLimit ? "text-rose-600" : ""}>{photoCount}</span>
            <span className="text-[#7A7476] font-medium"> / {maxPhotos} Photos</span>
          </div>
          
          {/* Minimal Progress Bar */}
          <div className="w-full sm:w-32 h-1.5 rounded-full bg-[#EADFCF] overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${isNearLimit ? "bg-rose-500" : "bg-[#D4AF37]"}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {showUpload && (
          <button className="mt-1 w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#5B001B] hover:bg-[#720022] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors">
            <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
            <span>Upload Photos</span>
          </button>
        )}
      </div>
    </div>
  );
};
