import { IntelligenceRepository } from '../repositories/intelligence.repository';

export class IntelligenceService {
  constructor(private repo: IntelligenceRepository) {}

  async getPlatformOverview() {
    return this.repo.getPlatformOverview();
  }

  async getDashboards() {
    return this.repo.getDashboards();
  }

  async getDashboardWidgets(dashboardId: string) {
    return this.repo.getDashboardWidgets(dashboardId);
  }

  async getUserGrowthTrend(days: number = 30) {
    const rawData = await this.repo.getUserGrowthTrend(days);
    // Group by day for simple charting
    const grouped = rawData.reduce((acc: any, curr: any) => {
      const date = new Date(curr.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    
    return Object.entries(grouped)
      .map(([date, count]) => ({ date, users: count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getDonationTrends() {
    const rawData = await this.repo.getDonationTrends();
    // Group by day
    const grouped = rawData.reduce((acc: any, curr: any) => {
      const date = new Date(curr.created_at).toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + curr.base_amount;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }
}
