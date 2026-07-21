import { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/database.types";
import { DatabaseError, NotFoundError } from "../lib/errors";
import { getPaginationOptions, buildPaginatedResponse, PaginatedResult } from "../lib/helpers/pagination";
import { RepositoryContext, IBaseRepository } from "./repository.types";


export abstract class BaseRepository<T extends { id: string }> implements IBaseRepository<T> {
  protected supabase: SupabaseClient<Database>;
  protected abstract tableName: keyof Database["public"]["Tables"];

  constructor(context: RepositoryContext) {
    this.supabase = context.supabase;
  }

  getClient(): SupabaseClient<Database> {
    return this.supabase;
  }

  
  async findById(id: string): Promise<T | null> {
    
    const { data, error } = (await (this.supabase as any).from(this.tableName) /* TS2589: Supabase generated types cause infinite recursion without this bypass. */.select("*").eq("id", id).single()); // TS2589: Supabase generated types cause infinite recursion without this bypass.

    if (error) {
      if (error.code === "PGRST116") return null; // PostgREST not found
      throw new DatabaseError(`Failed to fetch ${String(this.tableName)} by id`, error);
    }

    return data ;
  }

  
  async findAll(page: number = 1, limit: number = 10): Promise<PaginatedResult<T>> {
    const { from, to } = getPaginationOptions(page, limit);

    
    const { data, error, count } = await (this.supabase as any).from(this.tableName) /* TS2589: Supabase generated types cause infinite recursion without this bypass. */
      .select("*", { count: "exact" })
      .is("deleted_at", null)
      .range(from, to);

    if (error) {
      throw new DatabaseError(`Failed to fetch ${String(this.tableName)} list`, error);
    }

    
    return buildPaginatedResponse(data as T[], count || 0, page, limit);
  }

  
  async create(data: Partial<T>): Promise<T> {
    
    const { data: created, error } = await (this.supabase as any).from(this.tableName) /* TS2589: Supabase generated types cause infinite recursion without this bypass. */
      .insert(data )
      .select()
      .single();

    if (error) {
      throw new DatabaseError(`Failed to create ${String(this.tableName)}`, error);
    }

    
    return created as T;
  }

  
  async update(id: string, data: Partial<T>): Promise<T> {
    
    const { data: updated, error } = await (this.supabase as any).from(this.tableName) /* TS2589: Supabase generated types cause infinite recursion without this bypass. */
      .update(data )
      .eq("id" , id)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(`Failed to update ${String(this.tableName)}`, error);
    }

    if (!updated) {
      throw new NotFoundError(`${String(this.tableName)} with id ${id} not found`);
    }

    return updated as T;
  }

  
  async delete(id: string): Promise<boolean> {
    const { error } = (await (this.supabase as any).from(this.tableName) /* TS2589: Supabase generated types cause infinite recursion without this bypass. */.delete().eq("id", id)); // TS2589: Supabase generated types cause infinite recursion without this bypass.

    if (error) {
      throw new DatabaseError(`Failed to delete ${String(this.tableName)}`, error);
    }

    return true;
  }

  async softDelete(id: string): Promise<boolean> {
    return !!(await this.update(id, { deleted_at: new Date().toISOString() } as unknown as Partial<T> ));
  }
}
