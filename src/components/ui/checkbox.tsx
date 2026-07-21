"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onChange, onCheckedChange, disabled, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
      onCheckedChange?.(e.target.checked);
    };

    return (
      <label
        data-slot="checkbox"
        className={cn(
          "relative inline-flex items-center justify-center size-5 shrink-0 rounded-md border border-input/80 bg-background shadow-2xs transition-colors cursor-pointer outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          checked && "bg-primary border-primary text-primary-foreground",
          disabled && "cursor-not-allowed opacity-50",
          className
        )}
      >
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        {checked && <Check className="size-3.5 stroke-[3] pointer-events-none" />}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
