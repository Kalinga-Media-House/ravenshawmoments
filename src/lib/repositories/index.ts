import { SupabaseClient } from "@supabase/supabase-js";

export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(limit?: number, offset?: number): Promise<T[]>;
}

export abstract class BaseRepository<T> implements IRepository<T> {
  constructor(
    protected readonly supabase: SupabaseClient,
    protected readonly tableName: string
  ) {}

  async findById(id: string): Promise<T | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) return null;
    return data as T;
  }

  async findAll(limit = 50, offset = 0): Promise<T[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .range(offset, offset + limit - 1);

    if (error) return [];
    return data as T[];
  }
}
