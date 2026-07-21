"use client";

import React from "react";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { RAVENSHAW_ORGANIZATIONS } from "@/lib/master-data/organizations";

export interface OrganizationComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function OrganizationCombobox(props: OrganizationComboboxProps) {
  return (
    <SearchableCombobox
      options={RAVENSHAW_ORGANIZATIONS}
      emptyText="No organization found."
      placeholder="Select Organization..."
      {...props}
    />
  );
}
