import React from 'react';
import { Check } from 'lucide-react';

export interface VerificationBadgeProps {
  verified?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function VerificationBadge({ verified = true, size = 'md', className = '' }: VerificationBadgeProps) {
  if (!verified) return null;

  const sizeClasses = {
    sm: 'w-4 h-4 text-[10px]',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm',
  };

  const iconSizes = {
    sm: 10,
    md: 12,
    lg: 14,
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-blue-500 text-white ${sizeClasses[size]} ${className}`}
      title="Verified Student"
    >
      <Check size={iconSizes[size]} strokeWidth={3} />
    </div>
  );
}
