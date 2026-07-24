import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/database.types';

export class CommunityModerationRepository {
  /**
   * Super Admins and Admins: Get all reported content
   */
  static async getReports() {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from('community_reports')
      .select(`
        *,
        reporter:profiles!reporter_profile_id (id, full_name, email)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  static async reportContent(reporterId: string, entityType: string, entityId: string, reason: string, details?: string) {
    const supabase = (await createClient()) as any;
    const { error } = await supabase
      .from('community_reports')
      .insert({
        reporter_profile_id: reporterId,
        reported_entity_type: entityType,
        reported_entity_id: entityId,
        reason,
        details
      });

    if (error) throw error;
    return true;
  }

  static async logModerationAction(moderatorId: string, targetId: string, action: string, reason: string) {
    const supabase = (await createClient()) as any;
    const { error } = await supabase
      .from('community_moderation')
      .insert({
        moderator_profile_id: moderatorId,
        target_profile_id: targetId,
        action,
        reason
      });

    // Also log in the global audit_events table per requirements
    await supabase.from('audit_events').insert({
      actor_id: moderatorId,
      action: `COMMUNITY_MODERATION: ${action}`,
      entity_type: 'profile',
      entity_id: targetId,
      details: { reason }
    });

    if (error) throw error;
    return true;
  }

  static async getModerationLogs() {
    const supabase = (await createClient()) as any;
    const { data, error } = await supabase
      .from('community_moderation')
      .select(`
        *,
        moderator:profiles!moderator_profile_id (id, full_name, email),
        target:profiles!target_profile_id (id, full_name, email)
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data;
  }

  static async updatePostModerationStatus(postId: string, status: string) {
    const supabase = (await createClient()) as any;
    const { error } = await supabase
      .from('community_posts')
      .update({ moderation_status: status })
      .eq('id', postId);

    if (error) throw error;
    return true;
  }

  static async getDeletedContent() {
    const supabase = (await createClient()) as any;
    // Using RLS override or a specific view if needed, but since we rely on soft deletes for moderation,
    // we can query where moderation_status = 'removed'
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        author:profiles!author_profile_id (id, full_name)
      `)
      .eq('moderation_status', 'removed');

    if (error) throw error;
    return data;
  }
}
