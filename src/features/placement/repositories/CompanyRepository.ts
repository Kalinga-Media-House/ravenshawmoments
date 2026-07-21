import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

export type CompanyRow = Database['public']['Tables']['companies']['Row'];
export type CompanyInsert = Database['public']['Tables']['companies']['Insert'];
export type CompanyUpdate = Database['public']['Tables']['companies']['Update'];

export interface GetCompaniesOptions {
  isActive?: boolean;
  industry?: string;
  limit?: number;
  offset?: number;
}

export class CompanyRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async getCompanies(options: GetCompaniesOptions = {}) {
    let query = this.supabase
      .from('companies')
      .select('*, logo:media_files!companies_logo_media_id_fkey(id, url, alt_text)', { count: 'exact' });

    if (options.isActive !== undefined) {
      query = query.eq('is_active', options.isActive);
    }
    if (options.industry) {
      query = query.ilike('industry', `%${options.industry}%`);
    }

    query = query.order('name', { ascending: true });

    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;
    if (error) throw error;
    return { companies: data, count };
  }

  async getCompanyById(id: string) {
    const { data, error } = await this.supabase
      .from('companies')
      .select('*, logo:media_files!companies_logo_media_id_fkey(id, url, alt_text)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async getCompanyBySlug(slug: string) {
    const { data, error } = await this.supabase
      .from('companies')
      .select('*, logo:media_files!companies_logo_media_id_fkey(id, url, alt_text)')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  }

  async createCompany(company: CompanyInsert) {
    const { data, error } = await this.supabase
      .from('companies')
      .insert(company)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCompany(id: string, updates: CompanyUpdate) {
    const { data, error } = await this.supabase
      .from('companies')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCompany(id: string) {
    const { error } = await this.supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
