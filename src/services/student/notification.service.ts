import { SupabaseClient } from '@supabase/supabase-js';
import { NotificationRepository, Notification } from '../../repositories/student/notification.repository';
import { NotFoundError } from '../../lib/errors';

export class NotificationService {
  private repository: NotificationRepository;

  constructor(supabase: SupabaseClient) {
    this.repository = new NotificationRepository({ supabase });
  }

  async getNotifications(userId: string, page: number = 1, limit: number = 20) {
    return this.repository.findByUserId(userId, page, limit);
  }

  async markAsRead(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new NotFoundError('Notification not found');
    await this.repository.markAsRead(id);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.repository.markAllAsRead(userId);
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.repository.getUnreadCount(userId);
  }
}
