import React, { useMemo } from 'react';

export interface ProfileCompletionProps {
  profile: {
    avatarUrl?: string | null;
    bio?: string | null;
    department?: any;
    location?: string | null;
    website?: string | null;
    socialLinks?: any;
    education?: any[];
  };
  className?: string;
}

export function ProfileCompletion({ profile, className = '' }: ProfileCompletionProps) {
  const completionPercentage = useMemo(() => {
    if (!profile) return 0;
    
    const fields = [
      { weight: 20, isComplete: !!profile.avatarUrl },
      { weight: 20, isComplete: !!profile.bio && profile.bio.length > 10 },
      { weight: 15, isComplete: !!profile.department },
      { weight: 15, isComplete: !!profile.education && profile.education.length > 0 },
      { weight: 10, isComplete: !!profile.location },
      { weight: 10, isComplete: !!profile.socialLinks && Object.keys(profile.socialLinks).length > 0 },
      { weight: 10, isComplete: !!profile.website },
    ];

    let total = 0;
    fields.forEach(field => {
      if (field.isComplete) total += field.weight;
    });

    return Math.min(100, Math.round(total));
  }, [profile]);

  // SVG Circle calculations
  const size = 60;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className={`bg-[#1A1214] border border-[#2D1F23] rounded-xl p-4 flex items-center gap-4 ${className}`}>
      <div className="relative w-[60px] h-[60px] flex-shrink-0">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-[#2D1F23]"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-[#7C2D3E] transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>
        {/* Percentage Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-[#F5E6EA]">{completionPercentage}%</span>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-[#F5E6EA] mb-1">Profile Completion</h4>
        <p className="text-xs text-[#8B7078]">
          {completionPercentage === 100 
            ? 'Your profile is complete!' 
            : 'Complete your profile to increase visibility.'}
        </p>
      </div>
    </div>
  );
}
