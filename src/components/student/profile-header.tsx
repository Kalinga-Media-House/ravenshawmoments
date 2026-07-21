import React from 'react';
import { Camera, Edit, MapPin, Link as LinkIcon, Calendar } from 'lucide-react';
import { VerificationBadge } from './verification-badge';
import { DepartmentBadge } from './department-badge';

export interface ProfileHeaderProps {
  profile: {
    name: string;
    avatarUrl?: string | null;
    coverUrl?: string | null;
    bio?: string | null;
    verified?: boolean;
    department?: {
      name: string;
      slug: string;
    };
    location?: string | null;
    joinDate?: string | null;
    website?: string | null;
  };
  isOwner?: boolean;
  onEditAvatar?: () => void;
  onEditCover?: () => void;
  onEditProfile?: () => void;
}

export function ProfileHeader({
  profile,
  isOwner = false,
  onEditAvatar,
  onEditCover,
  onEditProfile,
}: ProfileHeaderProps) {
  return (
    <div className="w-full bg-[#1A1214] border border-[#2D1F23] rounded-xl overflow-hidden mb-6">
      {/* Cover Photo */}
      <div className="relative h-48 md:h-64 w-full bg-[#2D1F23]">
        {profile.coverUrl && (
          <img
            src={profile.coverUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        {isOwner && (
          <button
            onClick={onEditCover}
            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
            title="Edit Cover Photo"
          >
            <Camera size={20} />
          </button>
        )}
      </div>

      <div className="px-6 pb-6 relative">
        {/* Avatar Section */}
        <div className="flex justify-between items-start">
          <div className="relative -mt-16 md:-mt-20 z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#1A1214] bg-[#2D1F23] overflow-hidden relative group">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8B7078] text-4xl font-bold uppercase">
                  {profile.name.charAt(0)}
                </div>
              )}
              {isOwner && (
                <div
                  className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={onEditAvatar}
                >
                  <Camera size={24} className="text-white" />
                </div>
              )}
            </div>
          </div>

          {/* Edit Profile Button */}
          {isOwner && onEditProfile && (
            <button
              onClick={onEditProfile}
              className="mt-4 px-4 py-2 bg-[#7C2D3E] hover:bg-[#9B3A4D] text-[#F5E6EA] rounded-md font-medium transition-colors flex items-center gap-2"
            >
              <Edit size={16} />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="mt-4">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl md:text-3xl font-bold text-[#F5E6EA]">{profile.name}</h1>
            {profile.verified && <VerificationBadge size="lg" />}
          </div>
          
          {profile.department && (
            <div className="mt-2">
              <DepartmentBadge
                departmentName={profile.department.name}
                departmentSlug={profile.department.slug}
              />
            </div>
          )}

          {profile.bio && (
            <p className="mt-4 text-[#F5E6EA] text-sm md:text-base max-w-2xl whitespace-pre-wrap">
              {profile.bio}
            </p>
          )}

          {/* Meta Info */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-[#8B7078]">
            {profile.location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={16} />
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-1.5">
                <LinkIcon size={16} />
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9B3A4D] hover:underline"
                >
                  {new URL(profile.website).hostname.replace('www.', '')}
                </a>
              </div>
            )}
            {profile.joinDate && (
              <div className="flex items-center gap-1.5">
                <Calendar size={16} />
                <span>Joined {profile.joinDate}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
