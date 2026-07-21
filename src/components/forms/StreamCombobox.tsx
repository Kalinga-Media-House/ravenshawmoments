"use client";

import React from "react";
import { SearchableCombobox } from "@/components/ui/searchable-combobox";
import { PLUS_TWO_STREAMS } from "@/lib/master-data/streams";

export interface StreamComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function StreamCombobox(props: StreamComboboxProps) {
  return (
    <SearchableCombobox
      options={PLUS_TWO_STREAMS}
      emptyText="No stream found."
      placeholder="Select Stream..."
      {...props}
    />
  );
}
