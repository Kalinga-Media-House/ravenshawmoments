import type { Database } from "../../types/database.types";
import { DatabaseError } from "../../lib/errors";

export class SearchRepository {
  constructor(private context: { supabase: any }) {}

  async searchDepartments(query: string) {
    const { data, error } = await this.context.supabase
      .rpc("department_search", { p_query: query });

    if (error) {
      throw new DatabaseError(`Failed to search departments with query: ${query}`, error);
    }

    return data;
  }
}
