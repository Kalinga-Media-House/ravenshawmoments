export type SortOrder = "asc" | "desc";

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface SortOptions {
  sortBy: string;
  sortOrder: SortOrder;
}

export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export type FetchOptions = {
  includeDeleted?: boolean;
} & Partial<PaginationOptions> & Partial<SortOptions>;
