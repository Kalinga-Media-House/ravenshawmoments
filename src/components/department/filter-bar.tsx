'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterDefinition {
  key: string;
  label: string;
  options: FilterOption[];
}

export interface FilterBarProps {
  filters: FilterDefinition[];
  activeFilters: Record<string, string>;
  onFilterChange: (filters: Record<string, string>) => void;
  className?: string;
}

export function FilterBar({ filters, activeFilters, onFilterChange, className }: FilterBarProps) {
  const hasActiveFilters = Object.values(activeFilters).some(v => v !== undefined && v !== '');

  const handleValueChange = (key: string, value: string) => {
    onFilterChange({
      ...activeFilters,
      [key]: value === 'all' ? '' : value,
    });
  };

  const handleClearAll = () => {
    onFilterChange({});
  };

  if (!filters || filters.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className || ''}`}>
      {filters.map((filter) => {
        const currentValue = activeFilters[filter.key] || 'all';
        return (
          <Select
            key={filter.key}
            value={currentValue}
            // @ts-ignore
            onValueChange={(val) => handleValueChange(filter.key, val)}
          >
            <SelectTrigger className="w-[180px] bg-[#1A1214] border-[#2D1F23] text-[#F5E6EA]">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1214] border-[#2D1F23] text-[#F5E6EA]">
              <SelectItem value="all" className="focus:bg-[#7C2D3E] focus:text-[#F5E6EA]">
                All {filter.label}s
              </SelectItem>
              {filter.options.map((opt) => (
                <SelectItem 
                  key={opt.value} 
                  value={opt.value}
                  className="focus:bg-[#7C2D3E] focus:text-[#F5E6EA]"
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      })}
      
      {hasActiveFilters && (
        <Button
          variant="ghost"
          onClick={handleClearAll}
          className="text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23] flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
