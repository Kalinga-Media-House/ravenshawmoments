"use client";

import React from "react";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";

export interface RoleComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ROLES = ["student", "alumni", "teacher"];

export function RoleCombobox(props: RoleComboboxProps) {
  return (
    <SearchableCombobox
      options={ROLES}
      emptyText="No role found."
      placeholder="Select Role..."
      {...props}
    />
  );
}
