import { createClient } from '@/lib/supabase/server';

export class AccessLogRepository {
  /**
   * Log an access event
   */
  static async logAccess(
    profileId: string, 
    logType: string, 
    success: boolean = true, 
    identityId?: string, 
    entityId?: string, 
    entityType?: string, 
    deviceId?: string,
    ipAddress?: string
  ) {
    const supabase = (await createClient()) as any;
    const { error } = await supabase
      .from('identity_access_logs')
      .insert({
        profile_id: profileId,
        identity_id: identityId,
        log_type: logType,
        success,
        entity_id: entityId,
        entity_type: entityType,
        device_id: deviceId,
        ip_address: ipAddress
      });
    if (error) throw error;
  }

  /**
   * Get logs for a specific user
   */
  static async getUserLogs(profileId: string) {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from('identity_access_logs')
      .select('*, identity_devices(device_name, os, browser)')
      .eq('profile_id', profileId)
      .order('timestamp', { ascending: false });
    if (error) throw error;
    return data;
  }

  /**
   * Get all access logs (admin)
   */
  static async getAllLogs() {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from('identity_access_logs')
      .select('*, profiles(id, full_name, email), identity_devices(device_name, os, browser)')
      .order('timestamp', { ascending: false })
      .limit(500);
    if (error) throw error;
    return data;
  }
}
