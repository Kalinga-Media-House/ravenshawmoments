import React from 'react';
import { Award, Calendar } from 'lucide-react';

export interface AchievementCardProps {
  title: string;
  description: string;
  date: string;
  category: string;
  imageUrl?: string | null;
}

export function AchievementCard({
  title,
  description,
  date,
  category,
  imageUrl,
}: AchievementCardProps) {
  return (
    <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl overflow-hidden hover:border-[#7C2D3E]/50 transition-colors h-full flex flex-col">
      {imageUrl && (
        <div className="h-40 w-full bg-[#2D1F23] relative">
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="text-lg font-semibold text-[#F5E6EA] line-clamp-2">{title}</h3>
          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-[#7C2D3E]/20 text-[#9B3A4D] border border-[#7C2D3E]/30 shrink-0">
            {category}
          </span>
        </div>
        
        <p className="text-sm text-[#8B7078] line-clamp-3 mb-4 flex-1">
          {description}
        </p>
        
        <div className="flex items-center gap-1.5 text-xs text-[#8B7078] mt-auto pt-4 border-t border-[#2D1F23]">
          <Calendar size={14} />
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
}
