"use client";

import React from "react";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { RAVENSHAW_COURSES } from "@/lib/master-data/courses";

export interface CourseComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CourseCombobox(props: CourseComboboxProps) {
  return (
    <SearchableCombobox
      options={RAVENSHAW_COURSES}
      emptyText="No course found."
      placeholder="Select Course..."
      {...props}
    />
  );
}
