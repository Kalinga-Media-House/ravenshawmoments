import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbProps {
  items: { label: string; href?: string }[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)}>
      <ol className="flex items-center space-x-2 text-sm text-[#8B7078]">
        <li>
          <a href="/" className="hover:text-[#F5E6EA] transition-colors flex items-center">
            <Home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </a>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight className="h-4 w-4 text-[#2D1F23]" />
              {isLast || !item.href ? (
                <span className="text-[#F5E6EA] font-medium" aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className="hover:text-[#F5E6EA] transition-colors">
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
