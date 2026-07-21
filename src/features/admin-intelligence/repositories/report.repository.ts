import { Database } from '@/types/database.types';

export class ReportRepository {
  constructor(private supabase: any) {}

  async createReport(reportData: any) {
    const { data, error } = await this.supabase
      .from('analytics_reports')
      .insert(reportData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getReports() {
    const { data, error } = await this.supabase
      .from('analytics_reports')
      .select('*, generated_by(id, full_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }
}
