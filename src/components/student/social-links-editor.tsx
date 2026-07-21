'use client';

import React from 'react';
import { Github, Linkedin, Twitter, Instagram, Globe, LayoutTemplate } from 'lucide-react';

export type SocialLinks = {
  github?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
  portfolio?: string;
};

export interface SocialLinksEditorProps {
  links: SocialLinks;
  onChange: (links: SocialLinks) => void;
}

const SOCIAL_PLATFORMS = [
  { id: 'github', label: 'GitHub URL', icon: Github, placeholder: 'https://github.com/username' },
  { id: 'linkedin', label: 'LinkedIn URL', icon: Linkedin, placeholder: 'https://linkedin.com/in/username' },
  { id: 'twitter', label: 'Twitter URL', icon: Twitter, placeholder: 'https://twitter.com/username' },
  { id: 'instagram', label: 'Instagram URL', icon: Instagram, placeholder: 'https://instagram.com/username' },
  { id: 'website', label: 'Personal Website', icon: Globe, placeholder: 'https://yourwebsite.com' },
  { id: 'portfolio', label: 'Portfolio URL', icon: LayoutTemplate, placeholder: 'https://portfolio.com' },
];

export function SocialLinksEditor({ links, onChange }: SocialLinksEditorProps) {
  const handleChange = (id: string, value: string) => {
    onChange({
      ...links,
      [id]: value || undefined,
    });
  };

  return (
    <div className="space-y-4">
      {SOCIAL_PLATFORMS.map((platform) => {
        const Icon = platform.icon;
        const value = links[platform.id as keyof SocialLinks] || '';
        
        return (
          <div key={platform.id} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#2D1F23] flex items-center justify-center text-[#8B7078] flex-shrink-0">
              <Icon size={20} />
            </div>
            <div className="flex-1">
              <input
                type="url"
                value={value}
                onChange={(e) => handleChange(platform.id, e.target.value)}
                placeholder={platform.placeholder}
                className="w-full bg-[#1A1214] border border-[#2D1F23] rounded-lg px-4 py-2.5 text-[#F5E6EA] placeholder-[#8B7078] focus:outline-none focus:border-[#7C2D3E] focus:ring-1 focus:ring-[#7C2D3E] transition-colors"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
