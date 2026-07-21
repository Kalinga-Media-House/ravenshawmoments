import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export interface DepartmentBadgeProps {
  departmentName: string;
  departmentSlug: string;
  className?: string;
}

export function DepartmentBadge({ departmentName, departmentSlug, className = '' }: DepartmentBadgeProps) {
  return (
    <Link
      href={`/departments/${departmentSlug}`}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2D1F23] text-[#F5E6EA] text-xs font-medium hover:bg-[#7C2D3E] transition-colors border border-[#2D1F23] hover:border-[#9B3A4D] ${className}`}
      title={departmentName}
    >
      <BookOpen size={12} className="text-[#8B7078] group-hover:text-[#F5E6EA]" />
      <span className="line-clamp-1">{departmentName}</span>
    </Link>
  );
}
