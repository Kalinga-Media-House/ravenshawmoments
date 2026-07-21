import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/database.types";
import { getPaginationOptions, PaginatedResult, buildPaginatedResponse } from "../lib/helpers/pagination";

export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(page?: number, limit?: number): Promise<PaginatedResult<T>>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<boolean>;
}

export interface RepositoryContext {
  supabase: SupabaseClient<Database>;
}
