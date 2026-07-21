import { ReportRepository } from '../repositories/report.repository';

export class ReportGenerationService {
  constructor(private repo: ReportRepository) {}

  async generateReport(name: string, format: 'csv' | 'pdf' | 'excel', parameters: any, profileId: string) {
    // In a real implementation, this would queue a background job.
    // For now, we mock the creation of the record.
    return this.repo.createReport({
      name,
      format,
      parameters,
      generated_by: profileId,
      status: 'pending' // Worker would pick this up
    });
  }

  async getReports() {
    return this.repo.getReports();
  }
}
