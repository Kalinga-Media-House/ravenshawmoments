'use client';

import React from 'react';

export interface PrivacyToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function PrivacyToggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: PrivacyToggleProps) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-[#2D1F23] last:border-0">
      <div className="pr-4 flex-1">
        <h4 className="text-sm font-medium text-[#F5E6EA]">{label}</h4>
        {description && (
          <p className="text-xs text-[#8B7078] mt-1">{description}</p>
        )}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#9B3A4D] focus:ring-offset-2 focus:ring-offset-[#0F0A0B]
          ${checked ? 'bg-[#7C2D3E]' : 'bg-[#2D1F23]'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <span
          aria-hidden="true"
          className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
    </div>
  );
}
