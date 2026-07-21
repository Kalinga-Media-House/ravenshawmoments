"use client";

import React from "react";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";

export interface TeacherComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MOCK_TEACHERS = [
  "Dr. A. K. Das",
  "Dr. S. Mishra",
  "Prof. B. Nayak",
  "Dr. P. K. Sahoo",
  "Prof. M. R. Mohanty",
];

export function TeacherCombobox(props: TeacherComboboxProps) {
  return (
    <SearchableCombobox
      options={MOCK_TEACHERS}
      emptyText="No teacher found."
      placeholder="Select Teacher..."
      {...props}
    />
  );
}
