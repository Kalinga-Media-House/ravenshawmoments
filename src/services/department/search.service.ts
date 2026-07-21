import { SearchRepository } from "../../repositories/department/search.repository";

export class SearchService {
  constructor(private readonly repository: SearchRepository) {}

  async searchDepartments(query: string) {
    if (!query || query.length < 2) return [];
    
    // Relies purely on the DB RPC pg_trgm logic. No Node.js search logic.
    return await this.repository.searchDepartments(query);
  }
}
