"use client";

import React from "react";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { RAVENSHAW_DEPARTMENTS } from "@/lib/master-data/departments";

export interface DepartmentComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DepartmentCombobox(props: DepartmentComboboxProps) {
  return (
    <SearchableCombobox
      options={RAVENSHAW_DEPARTMENTS}
      emptyText="No department found."
      placeholder="Select Department..."
      {...props}
    />
  );
}
