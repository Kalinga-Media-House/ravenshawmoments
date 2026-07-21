import React from 'react';
import Link from 'next/link';
import { VerificationBadge } from './verification-badge';
import { DepartmentBadge } from './department-badge';

export interface ProfileCardProps {
  profile: {
    name: string;
    slug: string;
    avatarUrl?: string | null;
    department?: {
      name: string;
      slug: string;
    } | null;
    verified?: boolean;
    headline?: string | null;
  };
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Link href={`/profile/${profile.slug}`} className="block group">
      <div className="bg-[#1A1214] border border-[#2D1F23] rounded-xl p-5 hover:border-[#7C2D3E] transition-colors h-full flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#2D1F23] mb-4 overflow-hidden relative">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#8B7078] text-2xl font-bold uppercase group-hover:text-[#F5E6EA] transition-colors">
              {profile.name.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <h3 className="text-lg font-semibold text-[#F5E6EA] line-clamp-1">{profile.name}</h3>
          {profile.verified && <VerificationBadge size="sm" />}
        </div>
        
        {profile.department && (
          <div className="mb-3">
            <DepartmentBadge
              departmentName={profile.department.name}
              departmentSlug={profile.department.slug}
            />
          </div>
        )}
        
        {profile.headline && (
          <p className="text-sm text-[#8B7078] line-clamp-2 mt-auto">
            {profile.headline}
          </p>
        )}
      </div>
    </Link>
  );
}
