"use client";

import React from "react";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";

export interface GenderComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const GENDERS = ["male", "female", "other"];

export function GenderCombobox(props: GenderComboboxProps) {
  return (
    <SearchableCombobox
      options={GENDERS}
      emptyText="No gender found."
      placeholder="Select Gender..."
      {...props}
    />
  );
}
