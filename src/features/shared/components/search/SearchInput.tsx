// =============================================================================
// Ravenshaw Moments - Enterprise Search & Filter Primitives
// File: src/features/shared/components/search/SearchInput.tsx
// =============================================================================

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export interface SearchInputProps extends Omit<React.ComponentProps<"input">, "onChange"> {
  value?: string;
  onSearchChange?: (value: string) => void;
  debounceMs?: number;
  onClear?: () => void;
}

export function SearchInput({
  value: controlledValue,
  onSearchChange,
  debounceMs = 300,
  onClear,
  placeholder = "Search across platform...",
  className,
  ...props
}: SearchInputProps) {
  const [localValue, setLocalValue] = React.useState(controlledValue || "");

  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setLocalValue(controlledValue);
    }
  }, [controlledValue]);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      onSearchChange?.(val);
    }, debounceMs);
  };

  const handleClear = () => {
    setLocalValue("");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    onSearchChange?.("");
    onClear?.();
  };

  return (
    <div data-slot="search-input" className={cn("relative flex items-center w-full", className)}>
      <Search className="absolute left-3.5 size-4 text-muted-foreground pointer-events-none" />
      <Input
        type="search"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="pl-10 pr-10 h-11 rounded-xl bg-card/80 border-border/80 shadow-2xs focus-visible:bg-background"
        {...props}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3.5 size-5 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
