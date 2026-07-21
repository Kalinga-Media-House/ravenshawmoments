import React from 'react';
import { GraduationCap, Calendar, Edit2, Trash2 } from 'lucide-react';

export interface EducationCardProps {
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear?: string | null;
  description?: string | null;
  isCurrently?: boolean;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function EducationCard({
  institution,
  degree,
  field,
  startYear,
  endYear,
  description,
  isCurrently,
  isOwner,
  onEdit,
  onDelete,
}: EducationCardProps) {
  return (
    <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl p-5 hover:border-[#7C2D3E]/50 transition-colors relative group">
      {isOwner && (
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button onClick={onEdit} className="p-1.5 text-[#8B7078] hover:text-[#F5E6EA] bg-[#2D1F23] hover:bg-[#7C2D3E] rounded transition-colors" title="Edit">
              <Edit2 size={14} />
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="p-1.5 text-[#8B7078] hover:text-red-400 bg-[#2D1F23] hover:bg-red-400/20 rounded transition-colors" title="Delete">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}

      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-lg bg-[#2D1F23] flex items-center justify-center flex-shrink-0">
          <GraduationCap size={24} className="text-[#9B3A4D]" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-[#F5E6EA]">{institution}</h3>
          <p className="text-[#F5E6EA] font-medium">{degree} in {field}</p>
          
          <div className="flex items-center gap-1.5 text-sm text-[#8B7078] mt-1">
            <Calendar size={14} />
            <span>
              {startYear} - {isCurrently ? 'Present' : endYear}
            </span>
          </div>

          {description && (
            <p className="mt-3 text-sm text-[#8B7078] whitespace-pre-wrap">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
