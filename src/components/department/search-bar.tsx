'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

export interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  defaultValue?: string;
  className?: string;
}

export function SearchBar({ placeholder = 'Search...', onSearch, defaultValue = '', className }: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (value !== defaultValue) {
        onSearch(value);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [value, onSearch, defaultValue]);

  const handleClear = useCallback(() => {
    setValue('');
    onSearch('');
  }, [onSearch]);

  return (
    <div className={`relative flex items-center w-full max-w-sm ${className || ''}`}>
      <Search className="absolute left-3 h-4 w-4 text-[#8B7078]" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="pl-9 pr-9 bg-[#1A1214] border-[#2D1F23] text-[#F5E6EA] focus-visible:ring-[#7C2D3E]"
      />
      {value && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 h-7 w-7 text-[#8B7078] hover:text-[#F5E6EA] hover:bg-[#2D1F23]"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}
