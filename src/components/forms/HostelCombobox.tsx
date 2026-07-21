"use client";

import React from "react";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { RAVENSHAW_HOSTELS } from "@/lib/master-data/hostels";

export interface HostelComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function HostelCombobox(props: HostelComboboxProps) {
  return (
    <SearchableCombobox
      options={RAVENSHAW_HOSTELS}
      emptyText="No hostel found."
      placeholder="Select Hostel..."
      {...props}
    />
  );
}
