import React from 'react';
import { Badge } from '@/components/ui/badge';

export interface DepartmentHeaderProps {
  name: string;
  slug: string;
  logoUrl?: string;
  status?: 'active' | 'draft' | 'archived';
}

export function DepartmentHeader({ name, slug, logoUrl, status = 'active' }: DepartmentHeaderProps) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-[#2D1F23] mb-6">
      <div className="w-16 h-16 rounded-lg bg-[#2D1F23] border border-[#7C2D3E]/30 flex items-center justify-center overflow-hidden shrink-0">
        {logoUrl ? (
          <img src={logoUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-2xl font-bold text-[#8B7078]">{name.charAt(0).toUpperCase()}</span>
        )}
      </div>
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-[#F5E6EA]">{name}</h2>
          {status === 'active' && <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">Active</Badge>}
          {status === 'draft' && <Badge variant="outline" className="text-[#8B7078] border-[#2D1F23]">Draft</Badge>}
          {status === 'archived' && <Badge variant="secondary" className="bg-[#2D1F23] text-[#F5E6EA]">Archived</Badge>}
        </div>
        <p className="text-sm text-[#8B7078] mt-1 font-mono">/{slug}</p>
      </div>
    </div>
  );
}
