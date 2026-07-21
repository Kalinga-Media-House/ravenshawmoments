import React from 'react';
import { Users, Calendar } from 'lucide-react';

export interface OrganizationCardProps {
  orgName: string;
  role: string;
  joinDate: string;
  leaveDate?: string | null;
  logo?: string | null;
  type?: 'NCC' | 'NSS' | 'Society' | 'Club' | string;
}

export function OrganizationCard({
  orgName,
  role,
  joinDate,
  leaveDate,
  logo,
  type,
}: OrganizationCardProps) {
  return (
    <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl p-5 hover:border-[#7C2D3E]/50 transition-colors flex items-center gap-4">
      <div className="w-14 h-14 rounded-lg bg-[#2D1F23] overflow-hidden flex items-center justify-center flex-shrink-0">
        {logo ? (
          <img src={logo} alt={orgName} className="w-full h-full object-cover" />
        ) : (
          <Users size={24} className="text-[#8B7078]" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-base font-semibold text-[#F5E6EA] truncate">{orgName}</h3>
          {type && (
            <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#2D1F23] text-[#8B7078] border border-[#2D1F23]">
              {type}
            </span>
          )}
        </div>
        
        <p className="text-sm font-medium text-[#9B3A4D] truncate">{role}</p>
        
        <div className="flex items-center gap-1.5 text-xs text-[#8B7078] mt-1.5">
          <Calendar size={12} />
          <span>
            {joinDate} - {leaveDate || 'Present'}
          </span>
        </div>
      </div>
    </div>
  );
}
