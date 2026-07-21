import { Database } from '@/types/database.types';

export class SystemHealthRepository {
  constructor(private supabase: any) {}

  async recordMetric(metricName: string, value: number, metadata?: any) {
    const { error } = await this.supabase
      .from('system_health_metrics')
      .insert({ metric_name: metricName, metric_value: value, metadata });
    if (error) console.error('Failed to record system metric:', error);
  }

  async getRecentMetrics(metricName: string, limit: number = 50) {
    const { data, error } = await this.supabase
      .from('system_health_metrics')
      .select('*')
      .eq('metric_name', metricName)
      .order('recorded_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }

  async recordAuditEvent(action: string, severity: 'info' | 'warning' | 'critical', actorId?: string, entityType?: string, entityId?: string, metadata?: any) {
    const { error } = await this.supabase
      .from('audit_events')
      .insert({
        action,
        severity,
        actor_id: actorId,
        entity_type: entityType,
        entity_id: entityId,
        metadata
      });
    if (error) console.error('Failed to record audit event:', error);
  }

  async getRecentAuditEvents(limit: number = 100) {
    const { data, error } = await this.supabase
      .from('audit_events')
      .select('*, actor:actor_id(id, full_name, role)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  }
}
