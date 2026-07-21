import { createClient } from '@/lib/supabase/server';

export class DeviceRepository {
  /**
   * Get or register a device
   */
  static async registerDevice(profileId: string, fingerprint: string, browser?: string, os?: string, ipAddress?: string, country?: string) {
    const supabase = (await createClient()) as any;
    
    // Check if device exists
    const { data: existing } = await supabase
      .from('identity_devices')
      .select('*')
      .eq('profile_id', profileId)
      .eq('device_fingerprint', fingerprint)
      .single();

    if (existing) {
      // Update last used
      const { data, error } = await supabase
        .from('identity_devices')
        .update({ last_used_at: new Date().toISOString(), ip_address: ipAddress, country })
        .eq('id', existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      // Create new
      const { data, error } = await supabase
        .from('identity_devices')
        .insert({
          profile_id: profileId,
          device_fingerprint: fingerprint,
          device_name: `${os} - ${browser}`,
          browser,
          os,
          ip_address: ipAddress,
          country
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }

  /**
   * Get all devices for a user
   */
  static async getUserDevices(profileId: string) {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from('identity_devices')
      .select('*')
      .eq('profile_id', profileId)
      .order('last_used_at', { ascending: false });
    if (error) throw error;
    return data;
  }

  /**
   * Remove a device
   */
  static async removeDevice(deviceId: string, profileId: string) {
    const supabase = (await createClient()) as any;
    const { error } = await supabase
      .from('identity_devices')
      .delete()
      .eq('id', deviceId)
      .eq('profile_id', profileId);
    if (error) throw error;
  }
}
