// =============================================================================
// Ravenshaw Moments
// File      : src/features/shared/search/index.ts
// Purpose   : Shared Platform Layer — Universal Search, Pagination & Filtering
// =============================================================================

export interface SharedPaginationParams {
  page: number;
  pageSize: number;
}

export interface SharedPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SharedSearchQuery extends SharedPaginationParams {
  query?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/**
 * Calculates SQL OFFSET and LIMIT range from 1-indexed pagination params.
 */
export function calculateRange(page = 1, pageSize = 20): { from: number; to: number } {
  const normalizedPage = Math.max(1, page);
  const normalizedSize = Math.max(1, Math.min(100, pageSize));
  const from = (normalizedPage - 1) * normalizedSize;
  const to = from + normalizedSize - 1;
  return { from, to };
}

/**
 * Builds a standardized paginated response structure.
 */
export function buildPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): SharedPaginatedResult<T> {
  const totalPages = Math.ceil(total / Math.max(1, pageSize));
  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  };
}
