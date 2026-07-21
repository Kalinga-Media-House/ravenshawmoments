import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center min-h-[300px] border border-dashed border-[#2D1F23] rounded-lg bg-[#1A1214]/50", className)}>
      <div className="bg-[#2D1F23] p-4 rounded-full text-[#8B7078] mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-[#F5E6EA]">{title}</h3>
      {description && (
        <p className="text-sm text-[#8B7078] mt-2 max-w-sm">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button 
          onClick={onAction} 
          className="mt-6 bg-[#7C2D3E] text-[#F5E6EA] hover:bg-[#9B3A4D]"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
