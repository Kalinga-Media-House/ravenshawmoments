export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export function getPaginationOptions(
  page: number = 1,
  limit: number = 10
): { from: number; to: number } {
  const safePage = Math.max(1, page);
  const safeLimit = Math.max(1, Math.min(100, limit)); // Cap at 100 max

  const from = (safePage - 1) * safeLimit;
  const to = from + safeLimit - 1;

  return { from, to };
}

export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    metadata: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
