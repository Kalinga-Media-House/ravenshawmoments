'use client';

import { useState } from 'react';
import {
  SortingState,
  VisibilityState,
  PaginationState,
// @ts-ignore
} from '@tanstack/react-table';

export function useTableState(initialItemsPerPage = 10) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialItemsPerPage,
  });

  return {
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    globalFilter,
    setGlobalFilter,
    pagination,
    setPagination,
    tableState: {
      sorting,
      columnVisibility,
      rowSelection,
      globalFilter,
      pagination,
    }
  };
}
