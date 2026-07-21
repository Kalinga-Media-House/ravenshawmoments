import { CommunityModerationRepository } from '../repositories/community-moderation.repository';
import { Database } from '@/types/database.types';

export class CommunityModerationService {
  static async getReports() {
    try {
      const reports = await CommunityModerationRepository.getReports();
      return { success: true, data: reports };
    } catch (error: any) {
      console.error('Error fetching reports:', error);
      return { success: false, error: error.message };
    }
  }

  static async reportContent(reporterId: string, payload: {
    entity_type: string;
    entity_id: string;
    reason: string;
    details?: string;
  }) {
    try {
      await CommunityModerationRepository.reportContent(
        reporterId,
        payload.entity_type,
        payload.entity_id,
        payload.reason,
        payload.details
      );
      return { success: true };
    } catch (error: any) {
      console.error('Error reporting content:', error);
      return { success: false, error: error.message };
    }
  }

  static async moderatePost(moderatorId: string, postId: string, authorId: string, action: 'hide' | 'restore' | 'remove', reason: string) {
    try {
      let status: string = 'published';
      if (action === 'hide') status = 'hidden';
      if (action === 'remove') status = 'removed';

      await CommunityModerationRepository.updatePostModerationStatus(postId, status);
      
      await CommunityModerationRepository.logModerationAction(moderatorId, authorId, `POST_${action.toUpperCase()}`, reason);
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async getModerationLogs() {
    try {
      const logs = await CommunityModerationRepository.getModerationLogs();
      return { success: true, data: logs };
    } catch (error: any) {
      console.error('Error fetching moderation logs:', error);
      return { success: false, error: error.message };
    }
  }

  static async getDeletedContent() {
    try {
      const data = await CommunityModerationRepository.getDeletedContent();
      return { success: true, data };
    } catch (error: any) {
      console.error('Error fetching deleted content:', error);
      return { success: false, error: error.message };
    }
  }
}
