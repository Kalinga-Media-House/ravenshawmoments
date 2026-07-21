'use client';

import React from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  VisibilityState,
// @ts-ignore
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
// @ts-ignore
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Download, Search } from 'lucide-react';
import { EmptyState } from '@/features/shared/components/EmptyState';
import { TableSkeleton } from '@/features/shared/components/skeletons/TableSkeleton';
import { PaginationControls } from './pagination-controls';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  pageCount?: number;
  pagination?: { pageIndex: number; pageSize: number };
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedRows: TData[]) => void;
  bulkActions?: { label: string; onClick: (rows: TData[]) => void; variant?: 'default' | 'danger' | 'outline' }[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = 'Search...',
  isLoading = false,
  pageCount = 1,
  pagination = { pageIndex: 0, pageSize: 10 },
  onPaginationChange,
  sorting = [],
  onSortingChange,
  enableRowSelection = false,
  onRowSelectionChange,
  bulkActions = [],
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = React.useState('');

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: onPaginationChange ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    // @ts-ignore
    onSortingChange: onSortingChange ? (updater) => {
      if (typeof updater === 'function') {
         onSortingChange(updater(sorting));
      } else {
         onSortingChange(updater);
      }
    } : undefined,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      globalFilter,
      pagination: onPaginationChange ? pagination : undefined,
    },
    manualPagination: !!onPaginationChange,
    pageCount: onPaginationChange ? pageCount : undefined,
    enableRowSelection,
  });

  React.useEffect(() => {
    if (onRowSelectionChange) {
      // @ts-ignore
      const selectedRows = table.getFilteredSelectedRowModel().rows.map(row => row.original);
      onRowSelectionChange(selectedRows);
    }
  }, [rowSelection, table, onRowSelectionChange]);

  const handleExportCSV = () => {
    const headers = columns.map(c => c.id || (c as any).accessorKey).filter(Boolean).join(',');
    const rows = data.map(row => {
      return columns.map(c => {
        const val = (row as any)[c.id || (c as any).accessorKey as string];
        return `"${String(val || '').replace(/"/g, '""')}"`;
      }).join(',');
    }).join('\n');
    
    const blob = new Blob([`${headers}\n${rows}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const selectedCount = Object.keys(rowSelection).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2 flex-wrap gap-2">
          {searchKey && (
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder={searchPlaceholder}
                value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ''}
                onChange={(event) =>
                  table.getColumn(searchKey)?.setFilterValue(event.target.value)
                }
                className="pl-10 h-10 rounded-xl bg-background border-border/80"
              />
            </div>
          )}
          {selectedCount > 0 && bulkActions.length > 0 && (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-muted/60 border border-border/60">
              <span className="text-xs sm:text-sm font-medium text-foreground">{selectedCount} selected</span>
              {bulkActions.map((action, i) => (
                <Button
                  key={i}
                  size="sm"
                  variant={action.variant === 'danger' ? 'destructive' : action.variant === 'outline' ? 'outline' : 'primary'}
                  // @ts-ignore
                  onClick={() => action.onClick(table.getFilteredSelectedRowModel().rows.map(r => r.original))}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="rounded-xl"
          >
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <DropdownMenu>
            // @ts-ignore
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm" className="ml-auto rounded-xl">
                Columns <ChevronDown className="ml-2 size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              {table
                .getAllColumns()
                // @ts-ignore
                .filter((column) => column.getCanHide())
                // @ts-ignore
                .map((column: any) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/60">
            // @ts-ignore
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                // @ts-ignore
                {headerGroup.headers.map((header: any) => {
                  return (
                    <TableHead key={header.id} className="h-11 px-4 font-semibold text-muted-foreground">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0">
                  <TableSkeleton rows={5} columns={columns.length} className="border-none shadow-none rounded-none" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              // @ts-ignore
              table.getRowModel().rows.map((row: any) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className="hover:bg-muted/40 data-[state=selected]:bg-muted"
                >
                  // @ts-ignore
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id} className="p-4 text-foreground">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-48 p-0">
                  <EmptyState
                    preset="search"
                    title="No records found"
                    description="We couldn't find any results matching your search criteria."
                    variant="clean"
                    className="py-10"
                  />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {table.getPageCount() > 1 && (
        <PaginationControls
          currentPage={table.getState().pagination.pageIndex + 1}
          totalPages={table.getPageCount()}
          onPageChange={(page) => table.setPageIndex(page - 1)}
        />
      )}
    </div>
  );
}
