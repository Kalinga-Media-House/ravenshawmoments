'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(i)}
          className={cn(
            "w-8 h-8 text-sm",
            currentPage === i 
              ? "bg-[#7C2D3E] hover:bg-[#9B3A4D] text-[#F5E6EA] border-none" 
              : "bg-transparent border-[#2D1F23] text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23]"
          )}
        >
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <div className={cn("flex items-center justify-between px-2", className)}>
      <div className="text-sm text-[#8B7078]">
        Page <span className="font-medium text-[#F5E6EA]">{currentPage}</span> of{" "}
        <span className="font-medium text-[#F5E6EA]">{totalPages}</span>
      </div>
      
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="w-8 h-8 border-[#2D1F23] text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23] disabled:opacity-50 bg-transparent"
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-8 h-8 border-[#2D1F23] text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23] disabled:opacity-50 bg-transparent"
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div className="hidden sm:flex items-center space-x-1 mx-2">
          {renderPageNumbers()}
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 border-[#2D1F23] text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23] disabled:opacity-50 bg-transparent"
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="w-8 h-8 border-[#2D1F23] text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23] disabled:opacity-50 bg-transparent"
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
