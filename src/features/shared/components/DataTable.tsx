// =============================================================================
// Ravenshaw Moments - Enterprise Accessible Data Table
// File: src/features/shared/components/DataTable.tsx
// =============================================================================

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { TableSkeleton } from "@/features/shared/components/skeletons/TableSkeleton";
import { EmptyState, type EmptyPreset } from "@/features/shared/components/EmptyState";
import { Checkbox } from "@/components/ui/checkbox";

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  sortable?: boolean;
}

export interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string | number;
  isLoading?: boolean;
  emptyPreset?: EmptyPreset;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  selectable?: boolean;
  selectedKeys?: Set<string | number>;
  onSelectionChange?: (selectedKeys: Set<string | number>) => void;
  onRowClick?: (row: T, index: number) => void;
  className?: string;
  stickyHeader?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading = false,
  emptyPreset = "search",
  emptyTitle,
  emptyDescription,
  emptyAction,
  selectable = false,
  selectedKeys = new Set(),
  onSelectionChange,
  onRowClick,
  className,
  stickyHeader = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return <TableSkeleton rows={6} columns={columns.length + (selectable ? 1 : 0)} className={className} />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        preset={emptyPreset}
        title={emptyTitle}
        description={emptyDescription}
        primaryAction={emptyAction}
        className={className}
      />
    );
  }

  const allSelected = data.length > 0 && data.every((row, idx) => selectedKeys.has(rowKey(row, idx)));
  const someSelected = data.some((row, idx) => selectedKeys.has(rowKey(row, idx))) && !allSelected;

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      const next = new Set(selectedKeys);
      data.forEach((row, idx) => next.add(rowKey(row, idx)));
      onSelectionChange(next);
    } else {
      const next = new Set(selectedKeys);
      data.forEach((row, idx) => next.delete(rowKey(row, idx)));
      onSelectionChange(next);
    }
  };

  const handleSelectRow = (key: string | number, checked: boolean) => {
    if (!onSelectionChange) return;
    const next = new Set(selectedKeys);
    if (checked) {
      next.add(key);
    } else {
      next.delete(key);
    }
    onSelectionChange(next);
  };

  return (
    <div
      data-slot="data-table"
      className={cn(
        "relative w-full overflow-x-auto rounded-2xl border border-border/80 bg-card shadow-sm transition-all",
        className
      )}
    >
      <Table>
        <TableHeader className={cn(stickyHeader && "sticky top-0 z-10 bg-muted shadow-2xs")}>
          <TableRow>
            {selectable && (
              <TableHead className="w-12 px-4 text-center">
                <Checkbox
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  aria-label="Select all rows"
                />
              </TableHead>
            )}
            {columns.map((col) => (
              <TableHead
                key={col.key}
                className={cn("h-12 px-4 font-semibold text-muted-foreground", col.headerClassName)}
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const key = rowKey(row, index);
            const isSelected = selectedKeys.has(key);
            const isClickable = Boolean(onRowClick);

            return (
              <TableRow
                key={key}
                data-state={isSelected ? "selected" : undefined}
                onClick={isClickable ? () => onRowClick?.(row, index) : undefined}
                className={cn(
                  "transition-colors hover:bg-muted/40",
                  isClickable && "cursor-pointer",
                  isSelected && "bg-muted/70 font-medium"
                )}
              >
                {selectable && (
                  <TableCell
                    className="w-12 px-4 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(key, e.target.checked)}
                      aria-label={`Select row ${index + 1}`}
                    />
                  </TableCell>
                )}
                {columns.map((col) => (
                  <TableCell key={col.key} className={cn("p-4", col.className)}>
                    {col.cell(row, index)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
