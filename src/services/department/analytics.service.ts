import { AnalyticsRepository } from "../../repositories/department/analytics.repository";

export class AnalyticsService {
  constructor(private readonly repository: AnalyticsRepository) {}

  async getDepartmentStats(slug: string) {
    // Relies purely on the optimized materialized view. No Node.js counting.
    return await this.repository.getDepartmentStatistics(slug);
  }

  async getGlobalStats() {
    return await this.repository.getAllStatistics();
  }

  async getStatsByLevel(level: string) {
    return await this.repository.getStatisticsByLevel(level);
  }
}
