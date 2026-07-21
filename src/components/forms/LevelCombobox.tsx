"use client";

import React from "react";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";

export interface LevelComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const LEVELS = ["+2", "UG", "PG", "PhD"];

export function LevelCombobox(props: LevelComboboxProps) {
  return (
    <SearchableCombobox
      options={LEVELS}
      emptyText="No level found."
      placeholder="Select Level..."
      {...props}
    />
  );
}
