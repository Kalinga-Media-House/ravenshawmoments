'use client';

import React from 'react';

export interface ProfileTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export const PROFILE_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'education', label: 'Education' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'organizations', label: 'Organizations' },
  { id: 'activity', label: 'Activity' },
];

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="w-full bg-[#1A1214] border-b border-[#2D1F23] sticky top-0 z-20">
      <div className="flex overflow-x-auto no-scrollbar">
        {PROFILE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors relative
              ${
                activeTab === tab.id
                  ? 'text-[#F5E6EA]'
                  : 'text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23]/50'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9B3A4D]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
