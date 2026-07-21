import { CompanyRepository, CompanyInsert, CompanyUpdate, GetCompaniesOptions } from '../repositories/CompanyRepository';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export class CompanyService {
  private repository: CompanyRepository;

  constructor(supabase: SupabaseClient<Database>) {
    this.repository = new CompanyRepository(supabase);
  }

  async getCompanies(options?: GetCompaniesOptions) {
    return this.repository.getCompanies(options);
  }

  async getCompanyById(id: string) {
    return this.repository.getCompanyById(id);
  }

  async getCompanyBySlug(slug: string) {
    return this.repository.getCompanyBySlug(slug);
  }

  async createCompany(company: CompanyInsert) {
    return this.repository.createCompany(company);
  }

  async updateCompany(id: string, updates: CompanyUpdate) {
    return this.repository.updateCompany(id, updates);
  }

  async deleteCompany(id: string) {
    return this.repository.deleteCompany(id);
  }
}
