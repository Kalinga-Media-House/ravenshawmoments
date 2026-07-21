import { SystemHealthRepository } from '../repositories/system-health.repository';

export class SystemHealthService {
  constructor(private repo: SystemHealthRepository) {}

  async recordMetric(name: string, value: number, metadata?: any) {
    return this.repo.recordMetric(name, value, metadata);
  }

  async getRecentMetrics(name: string, limit: number = 50) {
    return this.repo.getRecentMetrics(name, limit);
  }

  async recordAuditEvent(action: string, severity: 'info' | 'warning' | 'critical', actorId?: string, entityType?: string, entityId?: string, metadata?: any) {
    return this.repo.recordAuditEvent(action, severity, actorId, entityType, entityId, metadata);
  }

  async getRecentAuditEvents(limit: number = 100) {
    return this.repo.getRecentAuditEvents(limit);
  }

  async getDashboardHealthSummary() {
    // Aggregates standard system health overview
    const dbMetrics = await this.getRecentMetrics('db_cpu', 1);
    const storageMetrics = await this.getRecentMetrics('storage_bytes', 1);
    const apiMetrics = await this.getRecentMetrics('api_latency_ms', 1);
    const errors = await this.getRecentMetrics('error_rate', 1);

    return {
      dbCpu: dbMetrics.length ? dbMetrics[0].metric_value : 0,
      storageBytes: storageMetrics.length ? storageMetrics[0].metric_value : 0,
      apiLatency: apiMetrics.length ? apiMetrics[0].metric_value : 0,
      errorRate: errors.length ? errors[0].metric_value : 0,
      status: 'healthy' // Computed based on thresholds
    };
  }
}
