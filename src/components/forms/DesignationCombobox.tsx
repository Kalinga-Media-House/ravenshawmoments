"use client";

import React from "react";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";

export interface DesignationComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const DESIGNATIONS = [
  "Assistant Professor",
  "Associate Professor",
  "Professor",
  "Guest Faculty"
];

export function DesignationCombobox(props: DesignationComboboxProps) {
  return (
    <SearchableCombobox
      options={DESIGNATIONS}
      emptyText="No designation found."
      placeholder="Select Designation..."
      {...props}
    />
  );
}
